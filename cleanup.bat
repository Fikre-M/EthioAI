@echo off
echo Removing duplicate frontend folder...
rmdir /s /q "frontend\frontend"
if %errorlevel% equ 0 (
    echo Success! Duplicate folder removed.
) else (
    echo Failed to remove folder. It may be locked by VS Code.
    echo Please close VS Code and run this script again.
)
pause
