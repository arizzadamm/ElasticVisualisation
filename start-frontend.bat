@echo off
title Norse Attack Map - Frontend Only
color 0C

echo.
echo  ========================================
echo  🌍 Norse Attack Map - Frontend Only
echo  ========================================
echo.
echo  Starting frontend only...
echo.
echo  Frontend: http://localhost:3000
echo.
echo  Make sure backend is running on port 3001
echo  Press Ctrl+C to stop
echo  ========================================
echo.

cd frontend
npm start

pause
