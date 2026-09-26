@echo off
rem ============================================================
rem  MOMENTLY - run the site + admin panel on this computer.
rem  Double-click this file, choose a password, and the admin
rem  opens at http://localhost:4321/admin
rem  Data is saved in the .local-blob folder (local only).
rem  Close this window to stop the server.
rem ============================================================
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download it from https://nodejs.org and try again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies, one moment...
  call npm install --no-audit --no-fund
)

:askpassword
if "%ADMIN_PASSWORD%"=="" set /p ADMIN_PASSWORD=Choose an admin password (at least 8 characters):
if "%ADMIN_PASSWORD%"=="" goto askpassword

echo.
echo  Site:  http://localhost:4321
echo  Admin: http://localhost:4321/admin   (password: %ADMIN_PASSWORD%)
echo  Keep this window open while you work. Close it to stop.
echo.
start "" cmd /c "timeout /t 2 >nul & start http://localhost:4321/admin"
node scripts\dev-server.js
pause
