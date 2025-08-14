@echo off
REM Telnyx Phone Number Filler Extension - Release Preparation Script
REM This script helps prepare a release ZIP file for GitHub

echo ========================================
echo  Telnyx Phone Number Filler Release Prep
echo ========================================
echo.

REM Get version from user
set /p VERSION="Enter version (e.g., 1.0): "
if "%VERSION%"=="" (
    echo Error: Version is required
    pause
    exit /b 1
)

set FILENAME=telnyx-phone-number-filler-v%VERSION%.zip

echo Preparing release: %FILENAME%
echo.

REM Check if required files exist
if not exist "manifest.json" (
    echo Error: manifest.json not found
    echo Make sure you're in the extension directory
    pause
    exit /b 1
)

if not exist "popup.html" (
    echo Error: popup.html not found
    pause
    exit /b 1
)

if not exist "popup.js" (
    echo Error: popup.js not found
    pause
    exit /b 1
)

if not exist "content.js" (
    echo Error: content.js not found
    pause
    exit /b 1
)

echo Checking files...
echo [✓] manifest.json
echo [✓] popup.html  
echo [✓] popup.js
echo [✓] content.js

if exist "background.js" (
    echo [✓] background.js
) else (
    echo [!] background.js not found - will be excluded
)

if exist "README.md" (
    echo [✓] README.md
) else (
    echo [!] README.md not found - will be excluded
)

echo.

REM Create release folder
if exist "release-temp" rmdir /s /q "release-temp"
mkdir "release-temp"

echo Copying files to release folder...
copy "manifest.json" "release-temp\" > nul
copy "popup.html" "release-temp\" > nul
copy "popup.js" "release-temp\" > nul
copy "content.js" "release-temp\" > nul

if exist "background.js" (
    copy "background.js" "release-temp\" > nul
)

if exist "README.md" (
    copy "README.md" "release-temp\" > nul
)

echo Creating ZIP file...

REM Check if PowerShell is available for ZIP creation
powershell -command "& {Compress-Archive -Path 'release-temp\*' -DestinationPath '%FILENAME%' -Force}" 2>nul

if errorlevel 1 (
    echo.
    echo PowerShell ZIP creation failed. 
    echo Please manually create a ZIP file with the contents of the release-temp folder.
    echo Name it: %FILENAME%
    pause
) else (
    echo.
    echo ========================================
    echo  Release ZIP created successfully!
    echo ========================================
    echo.
    echo File: %FILENAME%
    echo Location: %CD%
    echo.
    echo Contents:
    echo - manifest.json ^(Extension configuration^)
    echo - popup.html ^(User interface^)
    echo - popup.js ^(Popup functionality^)
    echo - content.js ^(Website interaction^)
    if exist "release-temp\background.js" echo - background.js ^(Background processing^)
    if exist "release-temp\README.md" echo - README.md ^(Documentation^)
    echo.
    echo Next steps:
    echo 1. Go to your GitHub repository
    echo 2. Click on "Releases" 
    echo 3. Click "Create a new release"
    echo 4. Use tag: v%VERSION%
    echo 5. Upload this ZIP file as an asset
    echo 6. Fill in release notes describing new features
    echo.
)

REM Clean up
rmdir /s /q "release-temp"

echo Press any key to exit...
pause > nul