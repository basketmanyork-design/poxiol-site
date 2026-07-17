<#
.SYNOPSIS
  POXIOL Stage C1 -- External Pre-Import Gate
  Self-locating. Project-local sanity.cmd. Auth postcheck rewrites.
  NO dataset imports. NO mutations. NO asset uploads.
#>

$ErrorActionPreference = "Stop"

# -- Locked constants --
$projectId             = "oqpv1xbc"
$dataset               = "production"
$runId                 = "run-2026-07-17-03-15-18"
$approvedNdjsonSha256  = "075e9fdcb8a5db8aaa96dfb3644381862f7efa7ed936a0d959e4840e50a03acf"

# -- Self-locating --
$scriptDir   = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$projectRoot = Resolve-Path (Join-Path $scriptDir "..")
$studioDir   = Join-Path $projectRoot "studio"
$sanityCmd   = Join-Path $studioDir "node_modules\.bin\sanity.cmd"
if (-not (Test-Path $sanityCmd)) { Write-Error "[FATAL] sanity.cmd not found: $sanityCmd"; exit 1 }

$runDir    = Join-Path $projectRoot "migration-output\$runId"
$runFile   = Join-Path $runDir "content-drafts.ndjson"
$backupDir = Join-Path $projectRoot "backups"
$gateFile  = Join-Path $runDir "external-gate-result.json"
$logDir    = Join-Path $runDir "external-gate-logs"

# -- Result object --
$result = [PSCustomObject]@{
    runId                     = $runId
    projectId                 = $projectId
    projectName               = $null
    dataset                   = $dataset
    executedAt                = $null
    sanityCliVersion          = $null
    nodeVersion               = (node --version) -replace 'v',''
    npmVersion                = (npm --version)
    powershellVersion         = $PSVersionTable.PSVersion.ToString()
    authPrecheckExitCode      = $null
    authPrecheckProjectFound  = $false
    authPrecheckOutputParsed  = $false
    authSessionValid          = $false
    existingAuthEnvironment   = $false
    loginAttempted            = $false
    loginProvider             = $null
    loginAttempts             = 0
    loginExitCode             = $null
    loginCommandReportedSuccess = $false
    authPostcheckAttemptCount = 0
    authPostcheckExitCode     = $null
    authPostcheckProjectFound = $false
    authPostcheckPassed       = $false
    authAccountMismatch       = $false
    authNetworkFailure        = $false
    authenticatedProjectConfirmed = $false
    networkRetryCount         = 0
    failureStage              = $null
    failureMessage            = $null
    currentNdjsonSha256       = $null
    approvedNdjsonSha256      = $approvedNdjsonSha256
    ndjsonIntegrityMatch      = $false
    ndjsonSizeBytes           = 0
    ndjsonLastWriteTime       = $null
    datasetBaselineDocuments  = $null
    datasetBaselineDrafts     = $null
    datasetBaselineAssets     = $null
    datasetBackupCompleted    = $false
    datasetBackupPath         = $null
    datasetBackupSizeBytes    = 0
    datasetBackupSha256       = $null
    datasetBackupTime         = $null
    datasetExportExitCode     = $null
    sanityValidationFormat    = $null
    sanityValidationFile      = $null
    sanityValidationFileSha256 = $null
    sanityValidationStderrFile = $null
    sanityValidationExitCode  = $null
    sanityDocumentsValidated  = $null
    sanityValidationErrors    = $null
    sanityValidationWarnings  = $null
    sanityFailedDocumentIds   = @()
    sanityFailedFieldPaths    = @()
    validationResultParsingStatus = $null
    blockingWarnings          = @()
    webhookDisabled           = $true
    cloudflareDeployHookDisabled = $true
    externalGatePassed        = $false
    failReasons               = @()
}

# -- Helpers --
function Write-Step { param([string]$N) Write-Host "`n==== [$N] ====" -ForegroundColor Cyan }
function Write-Pass { param([string]$M) Write-Host "  [PASS] $M" -ForegroundColor Green }
function Write-Fail { param([string]$M) Write-Host "  [FAIL] $M" -ForegroundColor Red; $result.failReasons += $M }
function Write-Warn { param([string]$M) Write-Host "  [WARN] $M" -ForegroundColor Yellow }
function Save-Result { $result | ConvertTo-Json -Depth 6 | Out-File -FilePath $gateFile -Encoding utf8; Write-Host "`nResult saved: $gateFile" -ForegroundColor Cyan }

function Remove-AnsiEscapeSequence {
    param([string]$Text)
    $Text -replace '\x1b\[[0-9;]*m', ''
}

function Invoke-SanityCommand {
    param(
        [string]$CommandName,
        [string[]]$Arguments,
        [string]$StdoutFile,
        [string]$StderrFile
    )
    $started = Get-Date
    $prevEA = $ErrorActionPreference; $ErrorActionPreference = "Continue"
    try {
        New-Item -ItemType Directory -Force $logDir | Out-Null
        $so = if ($StdoutFile) { Join-Path $logDir $StdoutFile } else { $null }
        $se = if ($StderrFile) { Join-Path $logDir $StderrFile } else { $null }
        $stderrPath = if ($se) { $se } else { Join-Path $logDir "sanity-null.stderr.txt" }
        if ($so) { & $sanityCmd @Arguments 1> $so 2> $stderrPath }
        else     { $output = & $sanityCmd @Arguments 2>&1 }
        $ec = $LASTEXITCODE
        return @{ CommandName=$CommandName; StartedAt=$started.ToString("o"); CompletedAt=(Get-Date).ToString("o"); ExitCode=$ec; StdoutFile=$so; StderrFile=$se }
    } finally { $ErrorActionPreference = $prevEA }
}

function Test-ProjectIdInOutput {
    param([string]$StdoutFile, [string]$StderrFile)
    $text = ""
    if ($StdoutFile -and (Test-Path $StdoutFile)) { $text += Get-Content $StdoutFile -Raw -ErrorAction SilentlyContinue }
    if ($StderrFile -and (Test-Path $StderrFile)) { $text += Get-Content $StderrFile -Raw -ErrorAction SilentlyContinue }
    $clean = Remove-AnsiEscapeSequence $text
    $found = $clean -match [regex]::Escape($projectId)
    return $found
}

# -- Detect auth token --
if ($env:SANITY_AUTH_TOKEN) { $result.existingAuthEnvironment = $true; Write-Pass "SANITY_AUTH_TOKEN detected (value hidden)" }

# -- NDJSON integrity gate --
Write-Step "NDJSON Integrity"
if (-not (Test-Path $runFile)) { Write-Fail "NDJSON not found"; Save-Result; exit 1 }
$ndjsonItem = Get-Item $runFile
$result.currentNdjsonSha256 = (Get-FileHash $runFile -Algorithm SHA256).Hash.ToLower()
$result.ndjsonSizeBytes     = $ndjsonItem.Length
$result.ndjsonLastWriteTime = $ndjsonItem.LastWriteTime.ToString("o")
if ($result.currentNdjsonSha256 -ne $result.approvedNdjsonSha256) { Write-Fail "SHA-256 MISMATCH"; Save-Result; exit 1 }
$result.ndjsonIntegrityMatch = $true
Write-Pass "NDJSON integrity verified"

# -- Sanity CLI version --
$ver = & $sanityCmd --version 2>&1 | Where-Object { $_ -match '\d+\.\d+\.\d+' } | Select-Object -Last 1
$result.sanityCliVersion = if ($ver) { ($ver -split '\s+')[-1] } else { "unknown" }
Write-Host "Sanity CLI: $($result.sanityCliVersion)"

# =================================================================
# AUTHENTICATION PRE-CHECK (runs FIRST, decides whether login needed)
# =================================================================
Write-Step "Authentication Precheck"
$preResp = Invoke-SanityCommand -CommandName "projects-list-precheck" -Arguments @("projects","list") `
    -StdoutFile "projects-list-precheck.stdout.txt" -StderrFile "projects-list-precheck.stderr.txt"
$result.authPrecheckExitCode = $preResp.ExitCode
$precheckFound = Test-ProjectIdInOutput -StdoutFile $preResp.StdoutFile -StderrFile $preResp.StderrFile
$result.authPrecheckProjectFound = $precheckFound
$result.authPrecheckOutputParsed = $true

if ($preResp.ExitCode -eq 0 -and $precheckFound) {
    # === CASE A: already authenticated for correct project ===
    $result.authSessionValid = $true
    $result.authenticatedProjectConfirmed = $true
    $result.loginAttempted = $false
    Write-Pass "Already authenticated. Project $projectId confirmed."
} elseif ($preResp.ExitCode -eq 0 -and -not $precheckFound) {
    # === CASE B: authenticated but wrong project/account ===
    $result.authAccountMismatch = $true
    Write-Warn "Session exists but project $projectId not visible. Will attempt re-login."
} elseif ($preResp.ExitCode -ne 0) {
    # Check stderr for network error vs auth error
    $stderrContent = if ($preResp.StderrFile -and (Test-Path $preResp.StderrFile)) { Get-Content $preResp.StderrFile -Raw -ErrorAction SilentlyContinue } else { "" }
    if ($stderrContent -match "ECONNRESET|ETIMEDOUT|ENOTFOUND") {
        $result.authNetworkFailure = $true; Write-Warn "Network error during precheck"
    }
    Write-Warn "Not authenticated (exit code $($preResp.ExitCode))"
}

# =================================================================
# LOGIN  (only if precheck did NOT confirm the project)
# =================================================================
if (-not $result.authenticatedProjectConfirmed) {
    Write-Step "Sanity Login"
    $result.loginAttempted = $true

    $prevEA = $ErrorActionPreference; $ErrorActionPreference = "Continue"
    $help = & $sanityCmd login --help 2>&1 | Out-String; $ErrorActionPreference = $prevEA
    $providers = @()
    if ($help -match 'google') { $providers += "google" }
    if ($help -match 'github') { $providers += "github" }
    if ($providers.Count -eq 0) { $providers = @("google","github") }

    $maxRetries = 3; $waitSecs = @(5, 15, 30)
    for ($attempt = 1; $attempt -le $maxRetries; $attempt++) {
        $result.loginAttempts = $attempt
        $provider = $providers[($attempt - 1) % $providers.Count]
        $result.loginProvider = $provider
        Write-Host "  Login attempt $attempt/$maxRetries with --provider $provider"
        if ($waitSecs[$attempt-1] -gt 0) { Start-Sleep -Seconds $waitSecs[$attempt-1] }

        $lResp = Invoke-SanityCommand -CommandName "login" -Arguments @("login","--provider",$provider) `
            -StdoutFile "login-attempt-${attempt}.stdout.txt" -StderrFile "login-attempt-${attempt}.stderr.txt"
        $result.loginExitCode = $lResp.ExitCode

        # Check if stderr/stdout says "Login successful" (the browser may report it)
        $combined = ""
        if ($lResp.StdoutFile -and (Test-Path $lResp.StdoutFile)) { $combined += Get-Content $lResp.StdoutFile -Raw -ErrorAction SilentlyContinue }
        if ($lResp.StderrFile -and (Test-Path $lResp.StderrFile)) { $combined += Get-Content $lResp.StderrFile -Raw -ErrorAction SilentlyContinue }
        if ($combined -match "Login successful|Successfully logged in|Logged in") {
            $result.loginCommandReportedSuccess = $true
            Write-Pass "Login command reports success."
        }

        # Check stderr for network errors
        $err = if ($lResp.StderrFile -and (Test-Path $lResp.StderrFile)) { Get-Content $lResp.StderrFile -Raw -ErrorAction SilentlyContinue } else { "" }
        if ($err -match "ECONNRESET|ETIMEDOUT") { $result.networkRetryCount = $attempt; Write-Warn "ECONNRESET on attempt $attempt" }
        if ($attempt -ge $maxRetries) { Write-Warn "Login retries exhausted" }
    }

    # ===== AUTH POSTCHECK (critical: verifies login actually worked) =====
    Write-Step "Auth Postcheck"
    $maxPostcheck = 10; $postcheckOk = $false
    for ($pc = 1; $pc -le $maxPostcheck; $pc++) {
        $result.authPostcheckAttemptCount = $pc
        if ($pc -eq 1) { Start-Sleep -Seconds 2 } else { Start-Sleep -Seconds 3 }
        $pResp = Invoke-SanityCommand -CommandName "projects-list-postcheck" -Arguments @("projects","list") `
            -StdoutFile "postcheck-attempt-${pc}.stdout.txt" -StderrFile "postcheck-attempt-${pc}.stderr.txt"
        $found = Test-ProjectIdInOutput -StdoutFile $pResp.StdoutFile -StderrFile $pResp.StderrFile
        if ($pResp.ExitCode -eq 0 -and $found) {
            $result.authPostcheckPassed = $true
            $result.authPostcheckProjectFound = $true
            $result.authPostcheckExitCode = $pResp.ExitCode
            $result.authSessionValid = $true
            $result.authenticatedProjectConfirmed = $true
            $postcheckOk = $true
            Write-Pass "Auth postcheck PASSED (attempt $pc). Project $projectId confirmed."
            break
        }
        if ($pResp.ExitCode -eq 0 -and -not $found) {
            Write-Warn "Postcheck attempt ${pc} - exit 0 but project $projectId not visible"
        }
    }
    if (-not $postcheckOk) {
        Write-Fail "Auth postcheck FAILED after $maxPostcheck attempts."
        $result.failureStage = "auth-postcheck"
        $result.failureMessage = "Login succeeded but projects list could not confirm project $projectId after $maxPostcheck attempts."
        Save-Result; exit 1
    }
}

# =================================================================
# VERIFY DATASET
# =================================================================
Write-Step "Verify Dataset"
$dsResp = Invoke-SanityCommand -CommandName "datasets-list" -Arguments @("datasets","list","--project-id",$projectId) `
    -StdoutFile "datasets-list.stdout.txt" -StderrFile "datasets-list.stderr.txt"
$dsFound = Test-ProjectIdInOutput -StdoutFile $dsResp.StdoutFile -StderrFile $dsResp.StderrFile
# Also check actual content for "production"
$dsContent = if ($dsResp.StdoutFile -and (Test-Path $dsResp.StdoutFile)) { Get-Content $dsResp.StdoutFile -Raw -ErrorAction SilentlyContinue } else { "" }
if ($dsResp.ExitCode -ne 0 -or $dsContent -notmatch 'production') {
    Write-Fail "Dataset 'production' not confirmed."
    $result.failureStage = "dataset-verify"; $result.failureMessage = "Dataset production not found."; Save-Result; exit 1
}
Write-Pass "Dataset: production"

# =================================================================
# BASELINE
# =================================================================
Write-Step "Dataset Baseline"
$baselines = @(
    @{Name="Total";  Query='count(*)'},
    @{Name="Drafts"; Query='count(*[_id in path("drafts.**")])'},
    @{Name="Assets"; Query='count(*[_type in ["sanity.imageAsset","sanity.fileAsset"]])'}
); $baselines | ForEach-Object {
    $r = Invoke-SanityCommand -CommandName "query-$($_.Name)" -Arguments @("documents","query",$_.Query,"--project-id",$projectId,"--dataset",$dataset) `
        -StdoutFile "baseline-$($_.Name.ToLower()).stdout.txt" -StderrFile "baseline-$($_.Name.ToLower()).stderr.txt"
    $val = if ($r.StdoutFile -and (Test-Path $r.StdoutFile)) { (Get-Content $r.StdoutFile -Raw).Trim() } else { "0" }
    $propName = "datasetBaseline$($_.Name)"
    try { $result | Add-Member -NotePropertyValue ([int]$val) -Name $propName -Force } catch { $result | Add-Member -NotePropertyValue $val -Name $propName -Force }
    Write-Host "  $($_.Name): $val"
}

# =================================================================
# BACKUP
# =================================================================
Write-Step "Dataset Backup"
New-Item -ItemType Directory -Force $backupDir | Out-Null
$backupFile = Join-Path $backupDir "sanity-production-before-c1-run-2026-07-17-03-15-18.tar.gz"
$result.datasetBackupPath = $backupFile
$eResp = Invoke-SanityCommand -CommandName "export" -Arguments @("datasets","export",$dataset,$backupFile,"--project-id",$projectId,"--overwrite") `
    -StdoutFile "dataset-export.stdout.txt" -StderrFile "dataset-export.stderr.txt"
$result.datasetExportExitCode = $eResp.ExitCode
if ($eResp.ExitCode -ne 0 -or -not (Test-Path $backupFile)) { Write-Fail "Backup failed."; $result.failureStage="backup"; Save-Result; exit 1 }
$bItem = Get-Item $backupFile
$result.datasetBackupSizeBytes = $bItem.Length; $result.datasetBackupSha256 = (Get-FileHash $backupFile -Algorithm SHA256).Hash.ToLower(); $result.datasetBackupTime = $bItem.LastWriteTime.ToString("o")
if ($bItem.Length -eq 0) { Write-Fail "Backup empty."; Save-Result; exit 1 }
if ($result.datasetBackupSha256 -notmatch '^[0-9a-f]{64}$') { Write-Fail "Backup SHA-256 invalid."; Save-Result; exit 1 }
$result.datasetBackupCompleted = $true
Write-Pass "Backup: $($bItem.Length) bytes SHA256:$($result.datasetBackupSha256)"

# =================================================================
# VALIDATION
# =================================================================
Write-Step "Schema Validation"
$help = & $sanityCmd documents validate --help 2>&1 | Out-String
$jsonOk = $help -match '--format'
$result.sanityValidationFormat = if ($jsonOk) { "json" } else { "text" }
$valFile = Join-Path $runDir "sanity-schema-validation.json"
$valErr  = Join-Path $runDir "sanity-schema-validation.stderr.txt"
$result.sanityValidationFile = $valFile; $result.sanityValidationStderrFile = $valErr
$args = @("documents","validate","--project-id",$projectId,"--dataset",$dataset,"--file",$runFile,"--level","info","--yes")
if ($jsonOk) { $args += @("--format","json") }
$vResp = Invoke-SanityCommand -CommandName "validate" -Arguments $args -StdoutFile "sanity-validate.stdout.txt" -StderrFile "sanity-validate.stderr.txt"
if ($vResp.StdoutFile) { Copy-Item $vResp.StdoutFile $valFile -Force }
$result.sanityValidationExitCode = $vResp.ExitCode
if (Test-Path $valFile -and (Get-Item $valFile).Length -gt 0) { $result.sanityValidationFileSha256 = (Get-FileHash $valFile -Algorithm SHA256).Hash.ToLower() }

# Parse
Write-Step "Parse Validation"
if ($jsonOk -and (Test-Path $valFile) -and (Get-Item $valFile).Length -gt 0) {
    try {
        $raw = Get-Content $valFile -Raw | ConvertFrom-Json
        $result.sanityDocumentsValidated = if ($null -ne $raw.documentsValidated) { $raw.documentsValidated } elseif ($null -ne $raw.validated) { $raw.validated } elseif ($null -ne $raw.total) { $raw.total } else { $null }
        $result.sanityValidationErrors   = if ($null -ne $raw.validationErrors)  { $raw.validationErrors }  elseif ($null -ne $raw.errors)  { $raw.errors }  else { $null }
        $result.sanityValidationWarnings = if ($null -ne $raw.validationWarnings) { $raw.validationWarnings } elseif ($null -ne $raw.warnings) { $raw.warnings } else { $null }
        if ($raw.failedDocuments) { $result.sanityFailedDocumentIds = @($raw.failedDocuments) }
        $result.validationResultParsingStatus = if ($null -ne $result.sanityDocumentsValidated) { "success" } else { "unknown-structure" }
    } catch { $result.validationResultParsingStatus = "json-parse-failed" }
} else { $result.validationResultParsingStatus = "text-requires-manual-review" }

Write-Host "  Validated: $($result.sanityDocumentsValidated)  Errors: $($result.sanityValidationErrors)  Warnings: $($result.sanityValidationWarnings)  Parse: $($result.validationResultParsingStatus)"

# =================================================================
# GATE DECISION
# =================================================================
Write-Step "Gate Decision"
$pass = $true
if (-not $result.ndjsonIntegrityMatch)                                { $pass=$false; Write-Fail "NDJSON SHA-256 mismatch" }
if (-not $result.authenticatedProjectConfirmed)                       { $pass=$false; Write-Fail "Project $projectId not confirmed" }
if ($result.ndjsonSizeBytes -le 0)                                    { $pass=$false; Write-Fail "NDJSON is empty" }
if (-not $result.datasetBackupCompleted)                              { $pass=$false; Write-Fail "Backup not completed" }
if ($result.sanityDocumentsValidated -ne 45)                          { $pass=$false; Write-Fail "docsValidated != 45 (got: $($result.sanityDocumentsValidated))" }
if ($null -ne $result.sanityValidationErrors -and $result.sanityValidationErrors -ne 0) { $pass=$false; Write-Fail "Validation errors: $($result.sanityValidationErrors)" }
$result.externalGatePassed = $pass
Write-Host "External Gate Passed: $pass"

$result.executedAt = (Get-Date).ToString("o")
Save-Result
exit $(if($pass){0}else{1})
