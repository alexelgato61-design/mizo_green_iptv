@echo off
echo ========================================
echo   Starting IPTV Backend API
echo ========================================
echo.

cd "%~dp0backend"

echo Installing dependencies if needed...
call npm install

echo.
echo Starting Express server...
echo.
call npm run dev

pause