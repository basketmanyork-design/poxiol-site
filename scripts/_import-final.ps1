$ErrorActionPreference = "Stop"
$tokenInput = Read-Host "Paste Sanity token" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($tokenInput)
$token = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
if ([string]::IsNullOrWhiteSpace($token)) { Write-Host "No token."; exit 1 }

$ndjson = "C:\Users\Administrator\.accio\accounts\1750218270\agents\DID-F456DA-2B0D4C\project\poxiol-static-deploy\poxiol-cloudflare-static\migration-output\run-2026-07-17-03-15-18\content-drafts.ndjson"
$lines = Get-Content $ndjson | Where-Object { $_.Trim() }
$total = $lines.Count
Write-Host "Importing $total docs..."

$ok = 0; $fail = 0
$token = $token.Trim()

foreach ($line in $lines) {
    $doc = $line.Trim(); if ($doc -eq '') { continue }
    $body = [System.Text.Encoding]::UTF8.GetBytes('{"mutations":[{"createOrReplace":' + $doc + '}]}')
    try {
        $r = Invoke-RestMethod -Uri "https://oqpv1xbc.api.sanity.io/v2024-01-01/data/mutate/production" -Method Post -Headers @{Authorization="Bearer $token";"Content-Type"="application/json"} -Body $body -TimeoutSec 20
        $ok++
        if ($ok % 10 -eq 0) { Write-Host "  $ok / $total" }
    } catch {
        $fail++
        $msg = $_.Exception.Message
        if ($msg.Length -gt 150) { $msg = $msg.Substring(0, 150) }
        Write-Host "  FAIL #$($ok+1): $msg"
        if ($fail -ge 3) { break }
    }
}

Write-Host "Imported: $ok OK / $fail FAIL of $total"
# Clear token immediately
$env:SANITY_AUTH_TOKEN = $null
$token = $null
