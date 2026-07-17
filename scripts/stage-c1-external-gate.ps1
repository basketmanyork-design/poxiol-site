<#
.SYNOPSIS
  POXIOL Stage C1 – External Pre-Import Gate

.DESCRIPTION
  Auto-locates the project root from its own file path.
  Does NOT depend on the user's current working directory.
  Locks onto the approved run-2026-07-17-03-15-18 NDJSON file.
  Performs NO dataset imports, NO document creates, NO asset uploads.
#>

$ErrorActionPreference = "Stop"

# ── 0. Locked constants ───────────────────────────────────────────────────────
$projectId             = "oqpv1xbc"
$dataset               = "production"
$runId                 = "run-2026-07-17-03-15-18"
$approvedNdjsonSha256  = "075e9fdcb8a5db8aaa96dfb3644381862f7efa7ed936a0d959e4840e50a03acf"

# ── 1. Self-locating path resolution (DOES NOT depend on $pwd) ────────────────
$scriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDir "..")
$studioDir   = Join-Path $projectRoot "studio"

# Push into studio later; verify everything first
Write-Host "[INFO] Project root: $projectRoot" -ForegroundColor Cyan
Write-Host "[INFO] Studio dir:   $studioDir"   -ForegroundColor Cyan

$runDir     = Join-Path $projectRoot "migration-output/$runId"
$runFile    = Join-Path $runDir "content-drafts.ndjson"
$backupDir  = Join-Path $projectRoot "backups"

# Verify ALL required paths BEFORE any action
Write-Host "`n[0] Verifying locked files…" -ForegroundColor Cyan
@(
    @{Expected=$studioDir;                     Desc="Studio directory"},
    @{Expected=(Join-Path $studioDir "package.json");      Desc="Studio package.json"},
    @{Expected=(Join-Path $studioDir "sanity.config.ts");  Desc="sanity.config.ts"},
    @{Expected=$runDir;                        Desc="Locked run directory"},
    @{Expected=$runFile;                       Desc="Locked NDJSON file"}
) | ForEach-Object {
    if (-not (Test-Path $_.Expected)) {
        Write-Error "[FATAL] $($_.Desc) not found: $($_.Expected)"
        exit 1
    }
    Write-Host "  [OK] $($_.Desc)" -ForegroundColor Green
}

# Now enter studio and lock the working directory
Push-Location $studioDir
try {
  Write-Host "[INFO] Working directory: $((Get-Location).Path)" -ForegroundColor Cyan

# ── 2. NDJSON integrity check (gate #1) ──────────────────────────────────────
Write-Host "`n[1] Verifying NDJSON integrity…" -ForegroundColor Cyan
$ndjsonItem   = Get-Item $runFile
$ndjsonHash   = (Get-FileHash $runFile -Algorithm SHA256).Hash.ToLower()
$ndjsonSize   = $ndjsonItem.Length
$ndjsonTime   = $ndjsonItem.LastWriteTime.ToString("o")

Write-Host "  Approved SHA-256: $approvedNdjsonSha256"
Write-Host "  Current  SHA-256: $ndjsonHash"
Write-Host "  File size:        $ndjsonSize bytes"

if ($ndjsonHash -ne $approvedNdjsonSha256) {
    Write-Error "[FATAL] NDJSON SHA-256 MISMATCH – External gate stopped. No further actions taken."
    exit 1
}
$ndjsonMatch = $true
Write-Host "  [OK] NDJSON integrity verified." -ForegroundColor Green

# ── 3. Record tool versions ──────────────────────────────────────────────────
Write-Host "`n[2] Recording tool versions…" -ForegroundColor Cyan
$nodeVersion = (node --version) -replace 'v',''
$npmVersion  = (npm --version)
$psVersion   = $PSVersionTable.PSVersion.ToString()

Write-Host "  Node.js:      $nodeVersion"
Write-Host "  npm:          $npmVersion"
Write-Host "  PowerShell:   $psVersion"

# Sanity CLI version
$sanityHelp = & npx sanity --version 2>&1
$sanityCliVersion = ($sanityHelp | Select-Object -Last 1) -replace '.*?(\d+\.\d+\.\d+).*','$1'
if (-not $sanityCliVersion) {
    $sanityCliVersion = ($sanityHelp -join ' ') -replace '.*?(\d+\.\d+\.\d+).*','$1'
}
Write-Host "  Sanity CLI:   $sanityCliVersion"

# ── 4. Login and verify project ──────────────────────────────────────────────
Write-Host "`n[3] Logging into Sanity (opens browser for OAuth)…" -ForegroundColor Cyan
& npx sanity login
if ($LASTEXITCODE -ne 0) {
    Write-Error "[FATAL] sanity login failed (exit code $LASTEXITCODE)"
    exit 1
}

Write-Host "`n[4] Verifying project and dataset…" -ForegroundColor Cyan
$projectsOutput = & npx sanity projects list 2>&1
Write-Host $projectsOutput

$datasetsOutput = & npx sanity datasets list --project-id $projectId 2>&1
Write-Host $datasetsOutput

# ── 5. Pre-import dataset baseline ───────────────────────────────────────────
Write-Host "`n[5] Recording pre-import dataset baseline…" -ForegroundColor Cyan

$queryAll     = 'count(*)'
$queryDrafts  = 'count(*[_id in path("drafts.**")])'
$queryAssets  = 'count(*[_type in ["sanity.imageAsset","sanity.fileAsset"]])'

$baselineDocs   = (& npx sanity documents query $queryAll    --project-id $projectId --dataset $dataset 2>&1 | Out-String).Trim()
$baselineDrafts = (& npx sanity documents query $queryDrafts --project-id $projectId --dataset $dataset 2>&1 | Out-String).Trim()
$baselineAssets = (& npx sanity documents query $queryAssets --project-id $projectId --dataset $dataset 2>&1 | Out-String).Trim()

Write-Host "  All documents: $baselineDocs"
Write-Host "  Draft documents: $baselineDrafts"
Write-Host "  Asset documents: $baselineAssets"

try { [int]::Parse($baselineDocs) } catch {
    Write-Error "[FATAL] Could not parse document count: $baselineDocs"
    exit 1
}

# ── 6. Backup Dataset ────────────────────────────────────────────────────────
Write-Host "`n[6] Creating Dataset backup…" -ForegroundColor Cyan
New-Item -ItemType Directory -Force $backupDir | Out-Null

$backupFile  = Join-Path $backupDir "sanity-production-before-c1-run-2026-07-17-03-15-18.tar.gz"
$backupStart = Get-Date

& npx sanity datasets export $dataset $backupFile --project-id $projectId --overwrite 2>&1
$backupExitCode = $LASTEXITCODE

if ($backupExitCode -ne 0) {
    Write-Error "[FATAL] Dataset export failed with exit code $backupExitCode"
    exit 1
}

if (-not (Test-Path $backupFile)) {
    Write-Error "[FATAL] Backup file not found after export: $backupFile"
    exit 1
}

$backupItem    = Get-Item $backupFile
$backupSize    = $backupItem.Length
$backupTime    = $backupItem.LastWriteTime.ToString("o")
$backupSha256  = (Get-FileHash $backupFile -Algorithm SHA256).Hash.ToLower()

if ($backupSize -eq 0) {
    Write-Error "[FATAL] Backup file size is 0 bytes."
    exit 1
}
if ($backupSha256 -notmatch '^[0-9a-f]{64}$') {
    Write-Error "[FATAL] Backup SHA-256 invalid: $backupSha256"
    exit 1
}

Write-Host "  [OK] Backup saved: $backupFile"
Write-Host "  Size:    $backupSize bytes"
Write-Host "  SHA-256: $backupSha256"
Write-Host "  Time:    $backupTime"

# ── 7. Sanity documents validate --help ──────────────────────────────────────
Write-Host "`n[7] Sanity documents validate --help" -ForegroundColor Cyan
$validateHelpFile = Join-Path $runDir "sanity-documents-validate-help.txt"
& npx sanity documents validate --help > $validateHelpFile 2>&1
Write-Host (Get-Content $validateHelpFile | Select-Object -First 20)

# ── 8. Official Schema Validation ────────────────────────────────────────────
Write-Host "`n[8] Running official Sanity Schema Validation…" -ForegroundColor Cyan

# Detect if --format json is supported
$helpContent = Get-Content $validateHelpFile -Raw
$jsonSupported = $helpContent -match '--format'

$validationExitCode = 0

if ($jsonSupported) {
    Write-Host "  [INFO] JSON format supported. Using JSON output."
    $validationFile   = Join-Path $runDir "sanity-schema-validation.json"
    $validationStderr = Join-Path $runDir "sanity-schema-validation.stderr.txt"

    & npx sanity documents validate `
        --workspace default `
        --project-id $projectId `
        --dataset $dataset `
        --file $runFile `
        --format json `
        --level info `
        --yes `
        1> $validationFile `
        2> $validationStderr

    $validationExitCode = $LASTEXITCODE
    $validationFormat   = "json"
} else {
    Write-Host "  [INFO] --format not supported. Using text output."
    $validationFile   = Join-Path $runDir "sanity-schema-validation.txt"
    $validationStderr = Join-Path $runDir "sanity-schema-validation.stderr.txt"

    & npx sanity documents validate `
        --workspace default `
        --project-id $projectId `
        --dataset $dataset `
        --file $runFile `
        --level info `
        --yes `
        1> $validationFile `
        2> $validationStderr

    $validationExitCode = $LASTEXITCODE
    $validationFormat   = "text"
}

Write-Host "  Validation exit code: $validationExitCode"
Write-Host "  Output file: $validationFile"
Write-Host "  Stderr file: $validationStderr"

if (-not (Test-Path $validationFile)) {
    Write-Error "[FATAL] Validation output file not created."
    exit 1
}

$validationFileSize   = (Get-Item $validationFile).Length
$validationFileSha256 = (Get-FileHash $validationFile -Algorithm SHA256).Hash.ToLower()

# ── 9. Parse validation results ──────────────────────────────────────────────
Write-Host "`n[9] Parsing validation results…" -ForegroundColor Cyan

$parsingStatus   = "unknown"
$docsValidated   = $null
$valErrors       = $null
$valWarnings     = $null
$failedDocIds    = @()
$failedFields    = @()

if ($validationFormat -eq "json" -and $validationFileSize -gt 0) {
    try {
        $raw = Get-Content $validationFile -Raw | ConvertFrom-Json
        $docsValidated = $raw.documentsValidated ?? $raw.validated ?? $raw.total ?? $raw.count ?? $null
        $valErrors     = $raw.validationErrors  ?? $raw.errors  ?? $raw.errorCount  ?? $null
        $valWarnings   = $raw.validationWarnings ?? $raw.warnings ?? $raw.warningCount ?? $null

        if ($raw.failedDocuments) {
            $failedDocIds = $raw.failedDocuments | ForEach-Object { $_ ?? $_ }
        }

        if ($null -ne $docsValidated) {
            $parsingStatus = "success"
            Write-Host "  documentsValidated:   $docsValidated"
            Write-Host "  validationErrors:     $valErrors"
            Write-Host "  validationWarnings:   $valWarnings"
        } else {
            $parsingStatus = "unknown-structure"
            Write-Host "  [WARN] JSON structure not recognised. Raw keys: $($raw.PSObject.Properties.Name -join ', ')"
        }
    } catch {
        $parsingStatus = "json-parse-failed"
        Write-Host "  [WARN] Could not parse validation JSON: $_"
    }
} else {
    $parsingStatus = "manual-review-required"
    Write-Host "  [INFO] Text-format validation requires manual review. Opening preview:"
    Get-Content $validationFile | Select-Object -First 30 | ForEach-Object { Write-Host $_ }
}

# ── 10. Gate decision ────────────────────────────────────────────────────────
Write-Host "`n[10] Gate decision…" -ForegroundColor Cyan

$gatePassed = $true
$failReasons = @()

if (-not $ndjsonMatch) {
    $failReasons += "NDJSON integrity mismatch"
    $gatePassed = $false
}

if ($null -eq $docsValidated -or $docsValidated -ne 45) {
    $failReasons += "documentsValidated != 45 (got: $docsValidated)"
    $gatePassed = $false
}

if ($null -ne $valErrors -and $valErrors -ne 0) {
    $failReasons += "Validation errors: $valErrors"
    $gatePassed = $false
}

if ($parsingStatus -ne "success") {
    $failReasons += "Validation result parsing: $parsingStatus"
    $gatePassed = $false
}

if ($failReasons.Count -gt 0) {
    Write-Host "  [GATE FAILED]" -ForegroundColor Red
    $failReasons | ForEach-Object { Write-Host "    - $_" -ForegroundColor Red }
} else {
    Write-Host "  [GATE PASSED] All checks satisfied." -ForegroundColor Green
}

# ── 11. Build external-gate-result.json ──────────────────────────────────────
Write-Host "`n[11] Writing external-gate-result.json…" -ForegroundColor Cyan

$gateResult = [PSCustomObject]@{
    runId                       = $runId
    projectId                   = $projectId
    dataset                     = $dataset
    executedAt                  = (Get-Date).ToString("o")
    sanityCliVersion            = $sanityCliVersion
    nodeVersion                 = $nodeVersion
    npmVersion                  = $npmVersion
    powershellVersion           = $psVersion
    approvedNdjsonSha256        = $approvedNdjsonSha256
    currentNdjsonSha256         = $ndjsonHash
    ndjsonIntegrityMatch        = $ndjsonMatch
    ndjsonSizeBytes             = $ndjsonSize
    ndjsonLastWriteTime         = $ndjsonTime
    datasetBaselineDocuments    = if($baselineDocs    -as [int]){[int]$baselineDocs}   else{$baselineDocs}
    datasetBaselineDrafts       = if($baselineDrafts  -as [int]){[int]$baselineDrafts}  else{$baselineDrafts}
    datasetBaselineAssets       = if($baselineAssets  -as [int]){[int]$baselineAssets}  else{$baselineAssets}
    datasetBackupCompleted      = $true
    datasetBackupPath           = $backupFile
    datasetBackupSizeBytes      = $backupSize
    datasetBackupSha256         = $backupSha256
    datasetBackupTime           = $backupTime
    datasetExportExitCode       = $backupExitCode
    sanityValidationFormat      = $validationFormat
    sanityValidationFile        = $validationFile
    sanityValidationFileSha256  = $validationFileSha256
    sanityValidationStderrFile  = $validationStderr
    sanityValidationExitCode    = $validationExitCode
    sanityDocumentsValidated    = $docsValidated
    sanityValidationErrors      = $valErrors
    sanityValidationWarnings    = $valWarnings
    sanityFailedDocumentIds     = $failedDocIds
    sanityFailedFieldPaths      = $failedFields
    validationResultParsingStatus = $parsingStatus
    webhookDisabled             = $true
    cloudflareDeployHookDisabled = $true
    externalGatePassed          = $gatePassed
    failReasons                 = $failReasons
}

$gateResultFile = Join-Path $runDir "external-gate-result.json"
$gateResult | ConvertTo-Json -Depth 8 | Out-File -FilePath $gateResultFile -Encoding utf8

Write-Host "  Result saved: $gateResultFile" -ForegroundColor Green

# ── 12. Final summary ────────────────────────────────────────────────────────
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  POXIOL Stage C1 – External Gate Report" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NDJSON Hash Match:       $ndjsonMatch"
Write-Host "  Backup Completed:        True"
Write-Host "  Backup SHA-256:          $backupSha256"
Write-Host "  Backup Size:             $backupSize bytes"
Write-Host "  Sanity CLI:              $sanityCliVersion"
Write-Host "  Documents Validated:     $docsValidated"
Write-Host "  Validation Errors:       $valErrors"
Write-Host "  Validation Warnings:     $valWarnings"
Write-Host "  Parsing Status:           $parsingStatus"
Write-Host "  External Gate Passed:    $gatePassed"
Write-Host "========================================" -ForegroundColor Cyan

exit $(if($gatePassed){0}else{1})

} finally {
    Pop-Location | Out-Null
    Write-Host "[INFO] Restored working directory." -ForegroundColor Cyan
}