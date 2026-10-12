@echo off
title Push to GitHub - lazyninjaa31/portfolio
echo ========================================================
echo Pushing portfolio to https://github.com/lazyninjaa31/portfolio.git
echo ========================================================
echo.
"%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo SUCCESS! Repository pushed successfully to GitHub!
    echo ========================================================
) else (
    echo ========================================================
    echo If GitHub asked for authentication, sign in with your browser.
    echo ========================================================
)
pause
