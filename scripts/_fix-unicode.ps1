$src = Get-Content "scripts/stage-c1-external-gate.ps1" -Raw
$fixed = $src -replace "`u{2014}", "--"
$fixed = $fixed -replace "`u{2018}", "'"
$fixed = $fixed -replace "`u{2019}", "'"
$fixed = $fixed -replace "`u{201C}", '"'
$fixed = $fixed -replace "`u{201D}", '"'
$fixed = $fixed -replace "`u{2026}", "..."
Set-Content "scripts/stage-c1-external-gate.ps1" -Value $fixed -Encoding UTF8
Write-Host "Fixed. New size: $((Get-Item 'scripts/stage-c1-external-gate.ps1').Length) bytes"
