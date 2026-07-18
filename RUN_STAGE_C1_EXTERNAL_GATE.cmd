@echo off
setlocal
cd /d "%~dp0"

echo ================================================
echo   POXIOL Stage C1 - External Pre-Import Gate
echo ================================================
echo.

:: Verify required files exist (Section V)
if not exist "scripts\stage-c1-external-gate.ps1" (
    echo [ERROR] External Gate script not found.
    echo Path: %~dp0scripts\stage-c1-external-gate.ps1
    pause
    exit /b 1
)

if not exist "migration-output\run-2026-07-17-03-15-18\content-drafts.ndjson" (
    echo [ERROR] Locked NDJSON file not found.
    echo Path: %~dp0migration-output\run-2026-07-17-03-15-18\content-drafts.ndjson
    pause
    exit /b 1
)

echo [OK] All required files present.
echo.
echo This script will:
echo   1. Verify NDJSON integrity (SHA-256 gate)
echo   2. Check existing Sanity login session
echo   3. If needed, open browser for OAuth login
echo   4. Query pre-import dataset baseline
echo   5. Create a full dataset backup
echo   6. Run official Sanity Schema Validation
echo   7. Generate external-gate-result.json
echo.
echo NO dataset imports will be performed.
echo NO documents will be created or modified.
echo ================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stage-c1-external-gate.ps1"

set "EXIT_CODE=%ERRORLEVEL%"

echo.
echo ================================================
echo   External Gate Exit Code: %EXIT_CODE%
echo   Result file:
echo   %~dp0migration-output\run-2026-07-17-03-15-18\external-gate-result.json
echo ================================================

pause
exit /b %EXIT_CODE%
