@echo off
title Norse Attack Map - Demo Mode
color 0A

echo.
echo  ========================================
echo  🌍 Norse Attack Map - Demo Mode
echo  ========================================
echo.
echo  Starting application with simulated data...
echo.
echo  Backend:  http://localhost:3001
echo  Frontend: http://localhost:3000
echo.
echo  Press Ctrl+C to stop
echo  ========================================
echo.

REM Start the application
npm run dev:demo:full

pause
