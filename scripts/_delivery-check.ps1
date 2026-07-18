$base = "C:\Users\Administrator\.accio\accounts\1750218270\agents\DID-F456DA-2B0D4C\project\poxiol-static-deploy\poxiol-cloudflare-static"
Set-Location $base

$banned = @('sanity datasets import','sanity dataset import','sanity documents create',
    'sanity documents patch','sanity documents delete','sanity assets upload',
    'webhook enable','cloudflare deploy','wrangler pages deploy')

Write-Host "=== 1. Parser ==="
$t=$null; $e=$null
[System.Management.Automation.Language.Parser]::ParseFile((Resolve-Path "scripts\stage-c1-external-gate.ps1").Path,[ref]$t,[ref]$e)|Out-Null
Write-Host "Parser errors: $($e.Count)"

Write-Host ""
Write-Host "=== 2. PS1 SHA-256 ==="
$ps1 = (Get-FileHash "scripts\stage-c1-external-gate.ps1" -Algorithm SHA256).Hash.ToLower()
Write-Host $ps1

Write-Host ""
Write-Host "=== 3. CMD SHA-256 ==="
$cmd = (Get-FileHash "RUN_STAGE_C1_EXTERNAL_GATE.cmd" -Algorithm SHA256).Hash.ToLower()
Write-Host $cmd

Write-Host ""
Write-Host "=== 4. NDJSON SHA-256 ==="
$ndj = (Get-FileHash "migration-output\run-2026-07-17-03-15-18\content-drafts.ndjson" -Algorithm SHA256).Hash.ToLower()
Write-Host $ndj

Write-Host ""
Write-Host "=== 5. Banned commands in PS1 ==="
$c1 = Get-Content "scripts\stage-c1-external-gate.ps1" -Raw
$h1 = 0; $banned | %{ if ($c1 -match [regex]::Escape($_)) { Write-Host "  BANNED in PS1: $_"; $h1++ } }
Write-Host "PS1 banned: $h1"
Write-Host "PS1 npx: $(([regex]::Matches($c1,'npx')).Count)"

Write-Host ""
Write-Host "=== 6. Banned commands in CMD ==="
$c2 = Get-Content "RUN_STAGE_C1_EXTERNAL_GATE.cmd" -Raw
$h2 = 0; $banned | %{ if ($c2 -match [regex]::Escape($_)) { Write-Host "  BANNED in CMD: $_"; $h2++ } }
Write-Host "CMD banned: $h2"

Write-Host ""
Write-Host "=== 7. Banned commands in README ==="
$c3 = Get-Content "STAGE_C1_EXTERNAL_GATE_README.txt" -Raw
$h3 = 0; $banned | %{ if ($c3 -match [regex]::Escape($_)) { Write-Host "  BANNED in README: $_"; $h3++ } }
Write-Host "README banned: $h3"

Write-Host ""
Write-Host "=== 8. PII/Secret scan in README ==="
$pii = @('bearer','api.key','token','password','secret','SANITY_AUTH')
$p = 0; $pii | %{ if ($c3 -match $_) { Write-Host "  SECRET match in README: $_"; $p++ } }
Write-Host "README secret hits: $p"

Write-Host ""
Write-Host "=== 9. File existence ==="
@("RUN_STAGE_C1_EXTERNAL_GATE.cmd","STAGE_C1_EXTERNAL_GATE_README.txt","scripts\stage-c1-external-gate.ps1","migration-output\run-2026-07-17-03-15-18\content-drafts.ndjson") | %{
    if (Test-Path $_) { Write-Host "  OK: $_" } else { Write-Host "  MISSING: $_" }
}

Write-Host ""
Write-Host "=== 10. NDJSON modified? ==="
Write-Host "Approved:  075e9fdcb8a5db8aaa96dfb3644381862f7efa7ed936a0d959e4840e50a03acf"
Write-Host "Current:   $ndj"
Write-Host "Match:     $(if($ndj -eq '075e9fdcb8a5db8aaa96dfb3644381862f7efa7ed936a0d959e4840e50a03acf'){'YES'}else{'NO - DO NOT MODIFY NDJSON'})"

Write-Host ""
Write-Host "=== SUMMARY ==="
$totalBanned = $h1 + $h2 + $h3
Write-Host "Parser errors:    $($e.Count)"
Write-Host "Total banned:     $totalBanned"
Write-Host "npx (PS1):        $(([regex]::Matches($c1,'npx')).Count)"
Write-Host "NDJSON modified:  $(if($ndj -eq '075e9fdcb8a5db8aaa96dfb3644381862f7efa7ed936a0d959e4840e50a03acf'){'NO'}else{'YES - STOP'})"
Write-Host "CMD exists:       $(Test-Path 'RUN_STAGE_C1_EXTERNAL_GATE.cmd')"
Write-Host "README exists:    $(Test-Path 'STAGE_C1_EXTERNAL_GATE_README.txt')"
