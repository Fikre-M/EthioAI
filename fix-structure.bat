@echo off
echo Fixing folder structure...
echo.

REM Remove duplicate .ai folder inside frontend
if exist "frontend\.ai" (
    echo Removing duplicate frontend\.ai folder...
    rmdir /s /q "frontend\.ai"
    echo Done!
) else (
    echo No duplicate .ai folder found.
)

REM Remove duplicate .git folder inside frontend
if exist "frontend\.git" (
    echo Removing duplicate frontend\.git folder...
    rmdir /s /q "frontend\.git"
    echo Done!
) else (
    echo No duplicate .git folder found.
)

echo.
echo Structure fixed! Now run: cd .. then git status
pause
