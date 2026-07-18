$base = "C:\Users\Administrator\.accio\accounts\1750218270\agents\DID-F456DA-2B0D4C\project\poxiol-static-deploy\poxiol-cloudflare-static"
Set-Location $base

Write-Host "=== 1. Script SHA-256 ==="
$scriptHash = (Get-FileHash "scripts\stage-c1-external-gate.ps1" -Algorithm SHA256).Hash.ToLower()
Write-Host $scriptHash
if ($scriptHash -ne "2d7f3c0ed2fa8d3750802fd50b4116c1baf43ed1e5d007d3e95cae99c345313c") {
    Write-Host "  MISMATCH: Expected 2d7f3c0ed2fa8d3750802fd50b4116c1baf43ed1e5d007d3e95cae99c345313c"
}

Write-Host ""
Write-Host "=== 2. NDJSON SHA-256 ==="
$ndjsonHash = (Get-FileHash "migration-output\run-2026-07-17-03-15-18\content-drafts.ndjson" -Algorithm SHA256).Hash.ToLower()
Write-Host $ndjsonHash
if ($ndjsonHash -ne "075e9fdcb8a5db8aaa96dfb3644381862f7efa7ed936a0d959e4840e50a03acf") {
    Write-Host "  MISMATCH: Expected 075e9fdcb8a5db8aaa96dfb3644381862f7efa7ed936a0d959e4840e50a03acf"
}

Write-Host ""
Write-Host "=== 3. Parser Check ==="
$tokens = $null
$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile(
    (Resolve-Path "scripts\stage-c1-external-gate.ps1").Path,
    [ref]$tokens,
    [ref]$parseErrors
) | Out-Null
Write-Host "Parser Errors: $($parseErrors.Count)"
if ($parseErrors.Count -gt 0) {
    $parseErrors | ForEach-Object {
        Write-Host "  L$($_.Extent.StartLineNumber): $($_.Message)"
    }
}

Write-Host ""
Write-Host "=== 4. npx Scan ==="
$content = Get-Content "scripts\stage-c1-external-gate.ps1" -Raw
$npxCount = ([regex]::Matches($content, 'npx')).Count
Write-Host "npx matches: $npxCount"

Write-Host ""
Write-Host "=== 5. Banned Commands ==="
$banned = @('sanity datasets import','sanity dataset import','sanity documents create',
    'sanity documents patch','sanity documents delete','sanity assets upload',
    'webhook enable','cloudflare deploy','wrangler pages deploy',
    'git merge main','git push origin main')
$hits = 0
foreach ($b in $banned) {
    if ($content -match [regex]::Escape($b)) {
        Write-Host "  BANNED: $b"
        $hits++
    }
}
Write-Host "Banned matches: $hits"

Write-Host ""
Write-Host "=== 6. Git Status ==="
Write-Host "Branch: $(git branch --show-current)"
Write-Host "Local HEAD: $(git rev-parse HEAD)"

Write-Host ""
Write-Host "=== 7. File Sizes ==="
$s = Get-Item "scripts\stage-c1-external-gate.ps1"
$n = Get-Item "migration-output\run-2026-07-17-03-15-18\content-drafts.ndjson"
Write-Host "Script: $($s.Length) bytes"
Write-Host "NDJSON: $($n.Length) bytes"
