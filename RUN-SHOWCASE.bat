@echo off
cls
echo.
echo ========================================
echo   HALO Test Automation
echo ========================================
echo.
echo Running comprehensive application tests...
echo.

call npx playwright test tests/features/complete-application-tests.feature --headed --workers=1

echo.
echo ========================================
echo   Tests Complete!
echo ========================================
echo.
echo Opening test report...
timeout /t 2 /nobreak >nul

if exist "playwright-report\index.html" (
    start playwright-report\index.html
)

echo.
pause


