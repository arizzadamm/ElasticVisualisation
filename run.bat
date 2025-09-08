@echo off
title Norse Attack Map
color 0F

echo.
echo  ========================================
echo  🌍 Norse Attack Map
echo  ========================================
echo.
echo  Choose mode:
echo.
echo  1. Demo Mode (Simulated Data)
echo  2. Normal Mode (Elasticsearch)
echo  3. Exit
echo.
echo  ========================================
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Starting Demo Mode...
    call run-demo.bat
) else if "%choice%"=="2" (
    echo.
    echo Starting Normal Mode...
    call run-normal.bat
) else if "%choice%"=="3" (
    echo.
    echo Goodbye!
    exit
) else (
    echo.
    echo Invalid choice. Please run again.
    pause
)