<#
.SYNOPSIS
  POXIOL Stage C1 -- External Pre-Import Gate
  Uses project-local sanity.cmd. Auth precheck. NDJSON SHA-256 gate.
  NO dataset imports. NO document mutations. NO asset uploads.
#>

$ErrorActionPreference = "Stop"

# -- Locked constants --
$projectId             = "oqpv1xbc"
$dataset               = "production"
$runId                 = "run-2026-07-17-03-15-18"
$approvedNdjsonSha256  = "075e9fdcb8a5db8aaa96dfb3644381862f7efa7ed936a0d959e4840e50a03acf"

# -- Self-locating paths --
$scriptDir   = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$projectRoot = Resolve-Path (Join-Path $scriptDir "..")
$studioDir   = Join-Path $projectRoot "studio"
$sanityCmd   = Join-Path $studioDir "node_modules\.bin\sanity.cmd"

if (-not (Test-Path $sanityCmd)) {
    Write-Error "[FATAL] sanity.cmd not found: $sanityCmd"
    exit 1
}

$runDir      = Join-Path $projectRoot "migration-output\$runId"
$runFile     = Join-Path $runDir "content-drafts.ndjson"
$backupDir   = Join-Path $projectRoot "backups"
$gateFile    = Join-Path $runDir "external-gate-result.json"
$logDir      = Join-Path $runDir "external-gate-logs"

# -- Result tracking --
$result = [PSCustomObject]@{
    runId                        = $runId
    projectId                    = $projectId
    projectName                  = $null
    dataset                      = $dataset
    executedAt                   = $null
    sanityCliVersion             = $null
    nodeVersion                  = (node --version) -replace 'v',''
    npmVersion                   = (npm --version)
    powershellVersion            = $PSVersionTable.PSVersion.ToString()
    authPrecheckExitCode         = $null
    authSessionValid             = $false
    existingAuthEnvironment      = $false
    loginAttempted               = $false
    loginProvider                = $null
    loginAttempts                = 0
    loginExitCode                = $null
    networkRetryCount            = 0
    currentNdjsonSha256          = $null
    approvedNdjsonSha256         = $approvedNdjsonSha256
    ndjsonIntegrityMatch         = $false
    ndjsonSizeBytes              = 0
    ndjsonLastWriteTime          = $null
    datasetBaselineDocuments     = $null
    datasetBaselineDrafts        = $null
    datasetBaselineAssets        = $null
    datasetBackupCompleted       = $false
    datasetBackupPath            = $null
    datasetBackupSizeBytes       = 0
    datasetBackupSha256          = $null
    datasetBackupTime            = $null
    datasetExportExitCode        = $null
    sanityValidationFormat       = $null
    sanityValidationFile         = $null
    sanityValidationFileSha256   = $null
    sanityValidationStderrFile   = $null
    sanityValidationExitCode     = $null
    sanityDocumentsValidated     = $null
    sanityValidationErrors       = $null
    sanityValidationWarnings     = $null
    sanityFailedDocumentIds      = @()
    sanityFailedFieldPaths       = @()
    validationResultParsingStatus = $null
    blockingWarnings             = @()
    webhookDisabled              = $true
    cloudflareDeployHookDisabled = $true
    externalGatePassed           = $false
    failReasons                  = @()
}

function Write-Step { param([string]$N) Write-Host "`n==== [$N] ====" -ForegroundColor Cyan }
function Write-Pass { param([string]$M) Write-Host "  [PASS] $M" -ForegroundColor Green }
function Write-Fail { param([string]$M) Write-Host "  [FAIL] $M" -ForegroundColor Red; $result.failReasons += $M }
function Write-Warn { param([string]$M) Write-Host "  [WARN] $M" -ForegroundColor Yellow }

# -- Helper: Invoke-SanityCommand --
function Invoke-SanityCommand {
    param(
        [string]$CommandName,
        [string[]]$Arguments,
        [string]$StdoutFile,
        [string]$StderrFile
    )
    $started = Get-Date
    $prevEA   = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        New-Item -ItemType Directory -Force $logDir | Out-Null
        $so = if ($StdoutFile) { Join-Path $logDir $StdoutFile } else { $null }
        $se = if ($StderrFile) { Join-Path $logDir $StderrFile } else { $null }

        if ($so) {
            & $sanityCmd @Arguments 1> $so 2> (if ($se) { $se } else { $null })
        } else {
            $output = & $sanityCmd @Arguments 2>&1
        }

        $ec = $LASTEXITCODE
        $completed = Get-Date
        return @{
            CommandName  = $CommandName
            Arguments    = [string]$Arguments
            StartedAt    = $started.ToString("o")
            CompletedAt  = $completed.ToString("o")
            ExitCode     = $ec
            StdoutFile   = $so
            StderrFile   = $se
        }
    } finally {
        $ErrorActionPreference = $prevEA
    }
}

# -- Check SANITY_AUTH_TOKEN (never print value) --
if ($env:SANITY_AUTH_TOKEN) {
    $result.existingAuthEnvironment = $true
    Write-Pass "SANITY_AUTH_TOKEN detected (value hidden)"
}

# -- NDJSON integrity (gate #1) --
Write-Step "NDJSON Integrity"
if (-not (Test-Path $runFile)) {
    Write-Fail "NDJSON not found: $runFile"; Save-Result; exit 1
}
$ndjsonItem  = Get-Item $runFile
$result.currentNdjsonSha256 = (Get-FileHash $runFile -Algorithm SHA256).Hash.ToLower()
$result.ndjsonSizeBytes     = $ndjsonItem.Length
$result.ndjsonLastWriteTime = $ndjsonItem.LastWriteTime.ToString("o")

Write-Host "  Approved: $($result.approvedNdjsonSha256)"
Write-Host "  Current:  $($result.currentNdjsonSha256)"
Write-Host "  Size:     $($result.ndjsonSizeBytes) bytes"

if ($result.currentNdjsonSha256 -ne $result.approvedNdjsonSha256) {
    Write-Fail "NDJSON SHA-256 MISMATCH -- gate stopped."
    Save-Result; exit 1
}
$result.ndjsonIntegrityMatch = $true
Write-Pass "NDJSON integrity verified"

# -- Sanity CLI version --
Write-Step "Sanity CLI Version"
$ver = & $sanityCmd --version 2>&1 | Where-Object { $_ -match '\d+\.\d+\.\d+' } | Select-Object -Last 1
$result.sanityCliVersion = if ($ver) { ($ver -split '\s+')[-1] } else { "unknown" }
Write-Host "  Sanity CLI: $($result.sanityCliVersion)"

# -- Auth precheck --
Write-Step "Authentication Precheck"
$precheck = Invoke-SanityCommand -CommandName "projects-list" -Arguments @("projects","list") `
    -StdoutFile "sanity-projects-list.stdout.txt" -StderrFile "sanity-projects-list.stderr.txt"
$result.authPrecheckExitCode = $precheck.ExitCode

$stdoutContent = if ($precheck.StdoutFile) { Get-Content $precheck.StdoutFile -Raw } else { "" }

if ($precheck.ExitCode -eq 0 -and $stdoutContent -match $projectId) {
    $result.authSessionValid = $true
    $result.loginAttempted   = $false
    Write-Pass "Already authenticated (projects list OK, contains $projectId)"
} else {
    Write-Warn "Not authenticated or cannot reach projects list (exit code $($precheck.ExitCode))"

    # -- Login --
    Write-Step "Sanity Login"

    # Check login --help
    $loginHelp = & $sanityCmd login --help 2>&1 | Out-String
    $providers = @()
    if ($loginHelp -match 'google')   { $providers += "google" }
    if ($loginHelp -match 'github')   { $providers += "github" }

    $result.loginAttempted = $true
    $maxRetries = 3
    $waitSecs   = @(5, 15, 30)

    for ($attempt = 1; $attempt -le $maxRetries; $attempt++) {
        $result.loginAttempts = $attempt
        $provider = $providers[$attempt % $providers.Count]
        $result.loginProvider = $provider

        Write-Host "  Attempt $attempt/$maxRetries with provider: $provider"
        Write-Host "  Waiting $($waitSecs[$attempt-1])s before attempt..."

        if ($waitSecs[$attempt-1] -gt 0) { Start-Sleep -Seconds $waitSecs[$attempt-1] }

        # Minor network diagnostic (read-only)
        try {
            $dns = Resolve-DnsName "api.sanity.io" -ErrorAction SilentlyContinue
            Write-Host "  DNS api.sanity.io: $(if($dns){ 'OK' }else{ 'FAIL' })"
        } catch { Write-Host "  DNS api.sanity.io: FAILED" }

        $loginOut = Join-Path $logDir "sanity-login-attempt${attempt}.stdout.txt"
        $loginErr = Join-Path $logDir "sanity-login-attempt${attempt}.stderr.txt"
        Write-Host "  Running: sanity login --provider $provider"
        Write-Host "  NOTE: A browser window should open for OAuth."
        Write-Host "  If browser does not open, look for a login URL in: $loginOut"

        $loginResult = Invoke-SanityCommand -CommandName "login" `
            -Arguments @("login","--provider",$provider) `
            -StdoutFile "sanity-login-attempt${attempt}.stdout.txt" `
            -StderrFile "sanity-login-attempt${attempt}.stderr.txt"

        $result.loginExitCode = $loginResult.ExitCode

        if ($loginResult.ExitCode -eq 0) {
            Write-Pass "Login successful (attempt $attempt)"
            break
        }

        $err = Get-Content $loginResult.StderrFile -Raw -ErrorAction SilentlyContinue
        if ($err -match "ECONNRESET" -or $err -match "ETIMEDOUT") {
            Write-Warn "Network error on attempt $attempt (ECONNRESET/ETIMEDOUT)"
            $result.networkRetryCount = $attempt
            if ($attempt -ge $maxRetries) {
                Write-Fail "Login failed after $maxRetries network retries."
                Write-Host "`n=== MANUAL STEP REQUIRED ===" -ForegroundColor Yellow
                Write-Host "  Please run in your terminal:" -ForegroundColor Yellow
                Write-Host "  cd studio" -ForegroundColor Cyan
                Write-Host "  Re-run this script after authenticating manually." -ForegroundColor Cyan
                Write-Host "  Then reply: login-complete" -ForegroundColor Yellow
            }
        } elseif ($loginResult.ExitCode -ne 0) {
            Write-Warn "Login attempt $attempt returned exit code $($loginResult.ExitCode)"
        }
    }

    # Recheck after login
    $postCheck = Invoke-SanityCommand -CommandName "projects-list-post" -Arguments @("projects","list") `
        -StdoutFile "sanity-projects-list-post.stdout.txt" -StderrFile "sanity-projects-list-post.stderr.txt"
    $postStdout = if ($postCheck.StdoutFile) { Get-Content $postCheck.StdoutFile -Raw } else { "" }
    if ($postCheck.ExitCode -eq 0 -and $postStdout -match $projectId) {
        $result.authSessionValid = $true
        Write-Pass "Authenticated (post-login check passed)"
    }
}

if (-not $result.authSessionValid) {
    Write-Fail "Cannot proceed without authentication."
    Save-Result; exit 1
}

# -- Verify project and dataset --
Write-Step "Project & Dataset Verification"
$projOut = Get-Content (Join-Path $logDir "sanity-projects-list.stdout.txt") -Raw
if ($projOut -match 'poxiol') {
    $result.projectName = "poxiol-cms"
    Write-Pass "Project: $($result.projectName) ($projectId)"
} else {
    Write-Pass "Project ID: $projectId"
}

$dsCheck = Invoke-SanityCommand -CommandName "datasets-list" -Arguments @("datasets","list","--project-id",$projectId) `
    -StdoutFile "sanity-datasets-list.stdout.txt" -StderrFile "sanity-datasets-list.stderr.txt"
$dsStdout = if ($dsCheck.StdoutFile) { Get-Content $dsCheck.StdoutFile -Raw } else { "" }
if ($dsCheck.ExitCode -ne 0 -or $dsStdout -notmatch 'production') {
    Write-Fail "Dataset 'production' not found or inaccessible."
    Save-Result; exit 1
}
Write-Pass "Dataset: production"

# -- Pre-import baseline --
Write-Step "Dataset Baseline"
$baselines = @(
    @{Name="TotalDocs";  Query='count(*)';                                                     Key="datasetBaselineDocuments"},
    @{Name="Drafts";     Query='count(*[_id in path("drafts.**")])';                            Key="datasetBaselineDrafts"},
    @{Name="Assets";     Query='count(*[_type in ["sanity.imageAsset","sanity.fileAsset"]])';   Key="datasetBaselineAssets"}
)

$baselines | ForEach-Object {
    $r = Invoke-SanityCommand -CommandName "query-$($_.Name)" `
        -Arguments @("documents","query",$_.Query,"--project-id",$projectId,"--dataset",$dataset) `
        -StdoutFile "baseline-$($_.Name.ToLower()).stdout.txt" -StderrFile "baseline-$($_.Name.ToLower()).stderr.txt"
    $val = if ($r.StdoutFile -and (Test-Path $r.StdoutFile)) { (Get-Content $r.StdoutFile -Raw).Trim() } else { "0" }
    try { $result.$($_.Key) = [int]$val } catch { $result.$($_.Key) = $val }
    Write-Host "  $($_.Name): $($result.$($_.Key))"
    if ($r.ExitCode -ne 0 -and $result.$($_.Key) -eq 0 -and $_.Name -ne "Assets") {
        Write-Warn "$($_.Name) query had non-zero exit code"
    }
}

# -- Dataset backup --
Write-Step "Dataset Backup"
New-Item -ItemType Directory -Force $backupDir | Out-Null
$backupFile = Join-Path $backupDir "sanity-production-before-c1-run-2026-07-17-03-15-18.tar.gz"
$result.datasetBackupPath = $backupFile

$exportR = Invoke-SanityCommand -CommandName "export" `
    -Arguments @("datasets","export",$dataset,$backupFile,"--project-id",$projectId,"--overwrite") `
    -StdoutFile "dataset-export.stdout.txt" -StderrFile "dataset-export.stderr.txt"

$result.datasetExportExitCode = $exportR.ExitCode

if ($exportR.ExitCode -ne 0) {
    Write-Fail "Dataset export failed (exit $($exportR.ExitCode))"
    Save-Result; exit 1
}

if (-not (Test-Path $backupFile)) {
    Write-Fail "Backup file not created"
    Save-Result; exit 1
}

$bItem = Get-Item $backupFile
$result.datasetBackupSizeBytes = $bItem.Length
$result.datasetBackupSha256   = (Get-FileHash $backupFile -Algorithm SHA256).Hash.ToLower()
$result.datasetBackupTime     = $bItem.LastWriteTime.ToString("o")

if ($result.datasetBackupSizeBytes -eq 0) {
    Write-Fail "Backup file is 0 bytes"
    Save-Result; exit 1
}
if ($result.datasetBackupSha256 -notmatch '^[0-9a-f]{64}$') {
    Write-Fail "Backup SHA-256 invalid: $($result.datasetBackupSha256)"
    Save-Result; exit 1
}

$result.datasetBackupCompleted = $true
Write-Pass "Backup: $($result.datasetBackupSizeBytes) bytes"
Write-Host "  SHA-256: $($result.datasetBackupSha256)"

# -- Schema Validation --
Write-Step "Schema Validation"
$validateHelp = & $sanityCmd documents validate --help 2>&1 | Out-String
$jsonSupported = $validateHelp -match '--format'
$helpFile = Join-Path $logDir "sanity-documents-validate-help.txt"
$validateHelp | Out-File $helpFile -Encoding utf8

if ($jsonSupported) {
    $result.sanityValidationFormat = "json"
    $valFile   = Join-Path $runDir "sanity-schema-validation.json"
    $valStderr = Join-Path $runDir "sanity-schema-validation.stderr.txt"
    $result.sanityValidationFile = $valFile
    $result.sanityValidationStderrFile = $valStderr

    $valR = Invoke-SanityCommand -CommandName "validate" `
        -Arguments @("documents","validate","--workspace","default","--project-id",$projectId,"--dataset",$dataset,"--file",$runFile,"--format","json","--level","info","--yes") `
        -StdoutFile "sanity-schema-validation.stdout.json" -StderrFile "sanity-schema-validation.stderr.txt"
} else {
    $result.sanityValidationFormat = "text"
    $valFile   = Join-Path $runDir "sanity-schema-validation.txt"
    $valStderr = Join-Path $runDir "sanity-schema-validation.stderr.txt"
    $result.sanityValidationFile = $valFile
    $result.sanityValidationStderrFile = $valStderr

    $valR = Invoke-SanityCommand -CommandName "validate" `
        -Arguments @("documents","validate","--workspace","default","--project-id",$projectId,"--dataset",$dataset,"--file",$runFile,"--level","info","--yes") `
        -StdoutFile "sanity-schema-validation.stdout.txt" -StderrFile "sanity-schema-validation.stderr.txt"
}

$result.sanityValidationExitCode = $valR.ExitCode

# Copy stdout from logDir to runDir
if ($valR.StdoutFile -and (Test-Path $valR.StdoutFile)) {
    Copy-Item $valR.StdoutFile $valFile -Force
}

if (Test-Path $valFile) {
    $result.sanityValidationFileSha256 = (Get-FileHash $valFile -Algorithm SHA256).Hash.ToLower()
}

# Parse validation results
Write-Step "Parse Validation"
if ($result.sanityValidationFormat -eq "json" -and $valFile -and (Test-Path $valFile) -and (Get-Item $valFile).Length -gt 0) {
    try {
        $raw = Get-Content $valFile -Raw | ConvertFrom-Json
        $result.sanityDocumentsValidated = if ($null -ne $raw.documentsValidated) { $raw.documentsValidated } elseif ($null -ne $raw.validated) { $raw.validated } elseif ($null -ne $raw.total) { $raw.total } elseif ($null -ne $raw.count) { $raw.count } else { $null }
        $result.sanityValidationErrors   = if ($null -ne $raw.validationErrors)  { $raw.validationErrors }  elseif ($null -ne $raw.errors)  { $raw.errors }  elseif ($null -ne $raw.errorCount)  { $raw.errorCount }  else { $null }
        $result.sanityValidationWarnings = if ($null -ne $raw.validationWarnings) { $raw.validationWarnings } elseif ($null -ne $raw.warnings) { $raw.warnings } elseif ($null -ne $raw.warningCount) { $raw.warningCount } else { $null }

        if ($raw.failedDocuments) { $result.sanityFailedDocumentIds = @($raw.failedDocuments) }

        if ($null -ne $result.sanityDocumentsValidated) {
            $result.validationResultParsingStatus = "success"
        } else {
            $result.validationResultParsingStatus = "unknown-structure"
            Write-Warn "JSON structure not recognised. Raw keys: $($raw.PSObject.Properties.Name)"
        }
    } catch {
        $result.validationResultParsingStatus = "json-parse-failed"
        Write-Warn "JSON parse failed: $_"
    }
} else {
    $result.validationResultParsingStatus = "text-output-requires-manual-review"
}

Write-Host "  Documents Validated: $($result.sanityDocumentsValidated)"
Write-Host "  Errors:   $($result.sanityValidationErrors)"
Write-Host "  Warnings: $($result.sanityValidationWarnings)"
Write-Host "  Parsing:  $($result.validationResultParsingStatus)"

# -- Gate decision --
Write-Step "Gate Decision"
$gate = $true

if (-not $result.ndjsonIntegrityMatch)                         { $gate = $false; Write-Fail "NDJSON integrity" }
if (-not $result.authSessionValid)                              { $gate = $false; Write-Fail "Auth session" }
if ($result.ndjsonSizeBytes -le 0)                              { $gate = $false; Write-Fail "NDJSON empty" }
if (-not $result.datasetBackupCompleted)                         { $gate = $false; Write-Fail "Backup not completed" }
if ($result.datasetBackupSizeBytes -le 0)                       { $gate = $false; Write-Fail "Backup empty" }

if ($result.sanityDocumentsValidated -ne 45)                    { $gate = $false; Write-Fail "Docs validated != 45 (got: $($result.sanityDocumentsValidated))" }
if ($result.sanityValidationErrors -ne 0 -and $null -ne $result.sanityValidationErrors) {
    $gate = $false; Write-Fail "Validation errors: $($result.sanityValidationErrors)"
}
if ($result.validationResultParsingStatus -ne "success" -and $result.validationResultParsingStatus -ne $null) {
    $gate = $false; Write-Fail "Validation parsing: $($result.validationResultParsingStatus)"
}

$result.externalGatePassed = $gate
Write-Host "  External Gate Passed: $gate" $(if($gate){'-ForegroundColor Green'}else{'-ForegroundColor Red'})

$result.executedAt = (Get-Date).ToString("o")
Save-Result

exit $(if($gate){0}else{1})

<#
.SYNOPSIS
  Writes external-gate-result.json from $result.
#>
function Save-Result {
    $result | ConvertTo-Json -Depth 8 | Out-File -FilePath $gateFile -Encoding utf8
    Write-Host "`nResult saved: $gateFile" -ForegroundColor Cyan
}
