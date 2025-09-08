@echo off
title Norse Attack Map - Normal Mode
color 0B

echo.
echo  ========================================
echo  🌍 Norse Attack Map - Normal Mode
echo  ========================================
echo.
echo  Starting application with Elasticsearch...
echo.
echo  Backend:  http://localhost:3001
echo  Frontend: http://localhost:3000
echo.
echo  Make sure Elasticsearch is running!
echo  Press Ctrl+C to stop
echo  ========================================
echo.

REM Start the application
npm run dev:full

pause
