@echo off
setlocal
cd /d "%~dp0studio"

echo ================================================
echo   POXIOL CMS - MVP Seed
echo ================================================
echo.

if not exist "package.json" (
    echo [ERROR] studio/package.json not found.
    pause
    exit /b 1
)

if not exist "node_modules\.bin\sanity.cmd" (
    echo [ERROR] sanity.cmd not found. Run npm install in studio/ first.
    pause
    exit /b 1
)

if not exist "scripts\seed-mvp.ts" (
    echo [ERROR] Seed script not found: scripts\seed-mvp.ts
    pause
    exit /b 1
)

echo Using project-local Sanity CLI...
echo Seed script: scripts\seed-mvp.ts
echo Target: Project oqpv1xbc / Dataset production
echo.
echo If a browser window opens, complete the Sanity login.
echo The seed will run automatically after authentication.
echo ================================================
echo.

call node_modules\.bin\sanity.cmd exec scripts\seed-mvp.ts --with-user-token

set "EXIT_CODE=%ERRORLEVEL%"

echo.
echo ================================================
echo   Seed Exit Code: %EXIT_CODE%
echo   Result: ..\migration-output\mvp-seed-result.json
echo ================================================

pause
exit /b %EXIT_CODE%
