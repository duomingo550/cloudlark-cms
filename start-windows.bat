@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   Cloud Lark CMS
echo ========================================
echo.

where pnpm >nul 2>&1
if errorlevel 1 (
  echo pnpm was not found. Install Node.js 22 and pnpm first.
  pause
  exit /b 1
)

powershell -NoProfile -Command "try { $v = [version]((node -v).TrimStart('v')); if ($v -lt [version]'22.23.4') { exit 1 } } catch { exit 1 }"
if errorlevel 1 (
  echo Node.js 22.23.4 or newer is required.
  echo Upgrade Node.js and run this file again.
  pause
  exit /b 1
)

powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:3000/' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if not errorlevel 1 (
  echo The server is already running. Opening the admin panel...
  start "" "http://localhost:3000/admin"
  exit /b 0
)

if not exist "node_modules" (
  echo Installing dependencies...
  call pnpm install
  if errorlevel 1 goto :error
)

if not exist ".env" (
  echo Creating .env from .env.example...
  copy ".env.example" ".env" >nul
  powershell -NoProfile -Command "$secret = [Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).ToLower(); (Get-Content '.env') -replace '^PAYLOAD_SECRET=.*$', ('PAYLOAD_SECRET=' + $secret) | Set-Content '.env'"
)

if not exist "cloudlark.db" (
  echo Creating the database and loading demo content...
  call pnpm seed
  if errorlevel 1 goto :error
)

echo Starting the development server...
start "Cloud Lark CMS" /D "%~dp0" cmd /k pnpm dev

timeout /t 6 /nobreak >nul
start "" "http://localhost:3000/admin"
exit /b 0

:error
echo.
echo Startup failed. Review the error output above.
pause
exit /b 1
