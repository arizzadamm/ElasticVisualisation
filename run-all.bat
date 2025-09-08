@echo off
title Norse Attack Map - All Options
color 0F

echo.
echo  ========================================
echo  🌍 Norse Attack Map - All Options
echo  ========================================
echo.
echo  Choose what to run:
echo.
echo  1. Full Application (Demo Mode)
echo  2. Full Application (Normal Mode)
echo  3. Backend Only (Demo Mode)
echo  4. Backend Only (Normal Mode)
echo  5. Frontend Only
echo  6. Test WebSocket
echo  7. Exit
echo.
echo  ========================================
echo.

set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" (
    echo.
    echo Starting Full Application in Demo Mode...
    call run-demo.bat
) else if "%choice%"=="2" (
    echo.
    echo Starting Full Application in Normal Mode...
    call run-normal.bat
) else if "%choice%"=="3" (
    echo.
    echo Starting Backend Only in Demo Mode...
    call start-backend-demo.bat
) else if "%choice%"=="4" (
    echo.
    echo Starting Backend Only in Normal Mode...
    call start-backend.bat
) else if "%choice%"=="5" (
    echo.
    echo Starting Frontend Only...
    call start-frontend.bat
) else if "%choice%"=="6" (
    echo.
    echo Opening WebSocket Test...
    start test-websocket-demo.html
    echo.
    echo WebSocket test opened in browser
    echo Make sure backend is running first!
    pause
) else if "%choice%"=="7" (
    echo.
    echo Goodbye!
    exit
) else (
    echo.
    echo Invalid choice. Please run again.
    pause
)
