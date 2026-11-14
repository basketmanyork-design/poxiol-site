@echo off
chcp 65001 >nul
title POXIOL CMS 一键部署

cd /d "%~dp0"

echo ============================================================
echo   POXIOL CMS 管理后台 一键部署
echo ============================================================
echo.
echo   整个过程分 3 步，大约 2 分钟。
echo   第 2 步会弹出浏览器窗口，请点「Authorize / 授权」。
echo.
echo ------------------------------------------------------------
echo   第 1 步 / 共 3 步：登录 Sanity 账号
echo ------------------------------------------------------------
echo   浏览器如果弹出登录页，请用你自己的 Sanity 账号登录。
echo   如果已经登录过，这一步会自动跳过。
echo.
pause
call npx sanity login
if errorlevel 1 goto fail

echo.
echo ------------------------------------------------------------
echo   第 2 步 / 共 3 步：打包管理后台（约 15 秒）
echo ------------------------------------------------------------
call npx sanity build
if errorlevel 1 goto fail

echo.
echo ------------------------------------------------------------
echo   第 3 步 / 共 3 步：发布到线上（约 30 秒）
echo ------------------------------------------------------------
echo   如果终端问你 Studio hostname，直接按回车即可，
echo   本脚本已自动填入 poxiol-cms-admin。
echo.
echo poxiol-cms-admin| call npx sanity deploy --no-build
if errorlevel 1 goto fail

echo.
echo ============================================================
echo   部署成功！
echo   管理后台地址：https://poxiol-cms-admin.sanity.studio
echo ============================================================
echo.
echo 请把这个窗口截图发给助手，助手会做最后的线上验证。
pause
exit /b 0

:fail
echo.
echo ============================================================
echo   出错了。请把上面这段红字之前的全部内容截图发给助手。
echo ============================================================
pause
exit /b 1
