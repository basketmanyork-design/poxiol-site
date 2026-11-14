# Deploy the POXIOL CMS studio to Sanity hosting.
#
# The first deployment must assign a studio hostname to the project, which needs
# the `sanity.project/update` grant. Content API tokens do not carry it, so this
# step runs under an interactive `sanity login` session instead.
#
#   powershell -ExecutionPolicy Bypass -File .\deploy.ps1
#
# When the CLI asks for a Studio hostname, type: poxiol-cms

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

$wanted = 'poxiol-cms'

Write-Host 'Building studio...' -ForegroundColor Cyan
npx sanity build
if ($LASTEXITCODE -ne 0) { throw 'sanity build failed' }

Write-Host ''
Write-Host "Deploying. If prompted for a Studio hostname, enter: $wanted" -ForegroundColor Yellow
Write-Host ''

npx sanity deploy --no-build
if ($LASTEXITCODE -ne 0) { throw 'sanity deploy failed' }

Write-Host ''
Write-Host "Verify: https://$wanted.sanity.studio/" -ForegroundColor Green

