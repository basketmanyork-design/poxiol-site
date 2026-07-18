$f = "C:\Users\Administrator\.accio\accounts\1750218270\agents\DID-F456DA-2B0D4C\project\poxiol-static-deploy\poxiol-cloudflare-static\scripts\stage-c1-external-gate.ps1"
$t = $null; $e = $null
[System.Management.Automation.Language.Parser]::ParseFile($f, [ref]$t, [ref]$e) | Out-Null
Write-Host "Parser errors: $($e.Count)"
if ($e.Count -gt 0) { $e | ForEach-Object { Write-Host "L$($_.Extent.StartLineNumber): $($_.Message)" } }

$c = Get-Content $f -Raw
$npxCount = ([regex]::Matches($c, 'npx')).Count
Write-Host "npx matches: $npxCount"

$banned = @('sanity datasets import','sanity dataset import','sanity documents create','sanity documents patch','sanity documents delete','sanity assets upload','webhook enable','cloudflare deploy','wrangler pages deploy','git merge main','git push origin main')
$hits = 0
foreach ($b in $banned) {
    if ($c -match [regex]::Escape($b)) {
        Write-Host "  BANNED: $b"
        $hits++
    }
}
Write-Host "Banned matches: $hits"
Write-Host "SHA256: $((Get-FileHash $f -Algorithm SHA256).Hash.ToLower())"
Write-Host "Size: $((Get-Item $f).Length) bytes"
Write-Host ""
Write-Host "=== sanity.cmd references ==="
Select-String -Path $f -Pattern 'sanity\.cmd' | ForEach-Object { Write-Host "  L$($_.LineNumber): $($_.Line.Trim())" }
