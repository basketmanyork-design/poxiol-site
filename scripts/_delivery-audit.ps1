$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Resolve-Path (Join-Path $base "..")
Set-Location $root

Write-Host "Dir: $(Get-Location)"
Write-Host "Branch: $(git branch --show-current)"
Write-Host ""

# SHA-256
$scriptPath = "scripts/stage-c1-external-gate.ps1"
if (-not (Test-Path $scriptPath)) {
    Write-Error "Script not found: $scriptPath"
    exit 1
}
$sha = (Get-FileHash $scriptPath -Algorithm SHA256).Hash.ToLower()
$size = (Get-Item $scriptPath).Length
Write-Host "=== SHA-256 ==="
Write-Host $sha
Write-Host "Size: $size bytes"
Write-Host ""

# Encoding check
$bytes = Get-Content $scriptPath -Encoding Byte -TotalCount 4
$bomStr = ($bytes | ForEach-Object { '{0:X2}' -f $_ }) -join ' '
Write-Host "=== Encoding ==="
Write-Host "First 4 bytes: $bomStr"
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "UTF-8 with BOM"
} elseif ($bomStr -eq 'FF FE') {
    Write-Host "UTF-16 LE"
} else {
    Write-Host "UTF-8 (no BOM) or ASCII"
}
Write-Host ""

# Parser check
$tokens = $null
$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile(
    (Resolve-Path $scriptPath).Path,
    [ref]$tokens,
    [ref]$parseErrors
) | Out-Null

Write-Host "=== Parser ==="
Write-Host "ParseErrors: $($parseErrors.Count)"
if ($parseErrors.Count -gt 0) {
    $parseErrors | Select-Object Message,
        @{Name="Line";Expression={$_.Extent.StartLineNumber}},
        @{Name="Col";Expression={$_.Extent.StartColumnNumber}},
        @{Name="Text";Expression={$_.Extent.Text}} |
        Format-List
} else {
    Write-Host "PASS: No parser errors"
}
Write-Host ""

# Line 73
Write-Host "=== Line 73 ==="
$lines = Get-Content $scriptPath
Write-Host $lines[72]
Write-Host ""
Write-Host "=== Lines 65-80 ==="
65..80 | ForEach-Object { Write-Host "$_`: $($lines[$_-1])" }
Write-Host ""

# Banned commands
Write-Host "=== Banned Commands ==="
$content = Get-Content $scriptPath -Raw
$banned = @(
    'sanity datasets import','sanity dataset import','sanity documents create',
    'sanity documents patch','sanity documents delete','sanity assets upload',
    'webhook enable','cloudflare deploy','wrangler pages deploy',
    'git merge main','git push origin main'
)
$hits = 0
foreach ($b in $banned) {
    if ($content -match [regex]::Escape($b)) {
        Write-Host "  BANNED: $b"
        $hits++
    }
}
Write-Host "Banned matches: $hits"
Write-Host ""

# NDJSON status
Write-Host "=== NDJSON ==="
$ndjson = "migration-output/run-2026-07-17-03-15-18/content-drafts.ndjson"
$tracked = (git ls-files --error-unmatch $ndjson 2>&1 | Out-String) -notmatch 'error'
Write-Host "Git tracked: $(-not $tracked)"
Write-Host "Exists: $(Test-Path $ndjson)"
if (Test-Path $ndjson) {
    $item = Get-Item $ndjson
    Write-Host "Size: $($item.Length) bytes"
    Write-Host "SHA-256: $((Get-FileHash $ndjson -Algorithm SHA256).Hash.ToLower())"
}
Write-Host ""

# GitIgnore
Write-Host "=== GitIgnore ==="
Select-String 'migration-output' .gitignore
