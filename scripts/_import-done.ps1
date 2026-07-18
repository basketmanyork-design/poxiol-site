$ErrorActionPreference = "Stop"
Write-Host "POXIOL Stage C1 - Import 45 Draft Documents" -ForegroundColor Cyan

$secure = Read-Host "Paste Sanity token" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$token = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr).Trim()
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
if (!$token) { Write-Host "No token. Exiting."; exit 1 }

$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }
$baseUrl = "https://oqpv1xbc.api.sanity.io/v2024-01-01"

# Step 1: Verify token
Write-Host "`n[1] Verifying token..." -ForegroundColor Cyan
try {
    $query = "count(*)"
    $qr = Invoke-RestMethod -Uri "$baseUrl/data/query/production?query=$([uri]::EscapeDataString($query))" -Headers $headers -TimeoutSec 15
    Write-Host "  Documents in dataset: $qr" -ForegroundColor Green
} catch {
    Write-Host "  Token verification FAILED: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Import
Write-Host "`n[2] Importing 45 drafts..." -ForegroundColor Cyan
$ndjsonPath = "C:\Users\Administrator\.accio\accounts\1750218270\agents\DID-F456DA-2B0D4C\project\poxiol-static-deploy\poxiol-cloudflare-static\migration-output\run-2026-07-17-03-15-18\content-drafts.ndjson"
$lines = Get-Content $ndjsonPath | Where-Object { $_.Trim() }

$ok = 0; $fail = 0
foreach ($line in $lines) {
    $doc = $line.Trim(); if (!$doc) { continue }
    $body = '{ "mutations": [{ "createOrReplace": ' + $doc + ' }] }'
    try {
        Invoke-RestMethod -Uri "$baseUrl/data/mutate/production" -Method Post -Headers $headers -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 20 | Out-Null
        $ok++
        if ($ok % 10 -eq 0) { Write-Host "  $ok / $($lines.Count)" }
    } catch {
        $fail++
        $msg = if ($_.Exception.Message.Length -gt 150) { $_.Exception.Message.Substring(0, 150) } else { $_.Exception.Message }
        Write-Host "  FAIL #$($ok+1): $msg" -ForegroundColor Red
        if ($fail -ge 3) { break }
    }
}

Write-Host "`nDONE: $ok imported, $fail failed of $($lines.Count)" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Red" })

# Clear token
$token = $null; $secure = $null
Remove-Item Env:SANITY_AUTH_TOKEN -ErrorAction SilentlyContinue
