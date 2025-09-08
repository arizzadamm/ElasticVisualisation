@echo off
title Norse Attack Map - Backend Demo
color 0E

echo.
echo  ========================================
echo  🌍 Norse Attack Map - Backend Demo
echo  ========================================
echo.
echo  Starting backend in DEMO MODE...
echo.
echo  Backend: http://localhost:3001
echo  Health: http://localhost:3001/health
echo.
echo  Using simulated attack data
echo  Press Ctrl+C to stop
echo  ========================================
echo.

npm run dev:demo

pause
