$token = $env:SANITY_AUTH_TOKEN.Trim()
if (-not $token) { Write-Host "NO TOKEN"; exit 1 }

$ndjson = "C:\Users\Administrator\.accio\accounts\1750218270\agents\DID-F456DA-2B0D4C\project\poxiol-static-deploy\poxiol-cloudflare-static\migration-output\run-2026-07-17-03-15-18\content-drafts.ndjson"
$lines = Get-Content $ndjson | Where-Object { $_.Trim() }
$total = $lines.Count
$ok = 0
$fail = 0

Write-Host "Importing $total documents..."
$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

foreach ($line in $lines) {
    $doc = $line.Trim()
    if ([string]::IsNullOrEmpty($doc)) { continue }
    try {
        $body = [System.Text.Encoding]::UTF8.GetBytes($doc)
        $resp = Invoke-WebRequest -Uri "https://oqpv1xbc.api.sanity.io/v2024-01-01/data/mutate/production" -Method Post -Headers $headers -Body $body -TimeoutSec 20 -ErrorAction Stop | Out-Null
        $ok++
        if ($ok % 10 -eq 0) { Write-Host "  $ok / $total OK" }
    } catch {
        $fail++
        $errMsg = $_.Exception.Message
        if ($errMsg.Length -gt 120) { $errMsg = $errMsg.Substring(0, 120) + "..." }
        Write-Host "  FAIL #$ok: $errMsg"
        break
    }
}

Write-Host "DONE: $ok OK, $fail FAIL of $total"
