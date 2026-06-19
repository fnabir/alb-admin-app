@echo off
REM Build script for ALB Admin mobile app (Android release APK)
REM This script sets the required environment variable and builds the APK

setlocal enabledelayedexpansion

REM Set the environment variable needed for Expo workspace root handling
set EXPO_NO_METRO_WORKSPACE_ROOT=1

REM Extract version from package.json
for /f "tokens=2 delims=:, " %%A in (
	'findstr /r "version" "%~dp0..\..\package.json" ^| findstr /v "packages"'
) do (
	set "version=%%A"
	REM Remove quotes if present
	set "version=!version:"=!"
	goto :versionFound
)

:versionFound
echo Version from package.json: !version!
echo.

REM Ask user for optional prefix
set "prefix="
set /p prefix="Enter version prefix (e.g., Alpha 1, Beta 2) or press Enter for none: "

REM Build the version string
if not "!prefix!"=="" (
	set "finalVersion=!version!-!prefix!"
) else (
	set "finalVersion=!version!"
)

REM Navigate to the Android directory
cd /d "%~dp0android"

REM Run the gradle build
call gradlew.bat assembleRelease %*

REM Capture the exit code
set exitCode=!ERRORLEVEL!

REM Show the APK location if successful
if !exitCode! equ 0 (
    echo.
    echo ============================================
    echo BUILD SUCCESSFUL
    echo ============================================
    
    REM Set source and destination APK paths
    set "sourceAPK=%~dp0android\app\build\outputs\apk\release\app-release.apk"
    set "destAPK=%~dp0ALBAdmin-!finalVersion!.apk"
    
    REM Rename the APK
    if exist "!sourceAPK!" (
        ren "!sourceAPK!" "ALBAdmin-!finalVersion!.apk"
        if !ERRORLEVEL! equ 0 (
            echo APK renamed and saved as: !destAPK!
        ) else (
            echo Failed to rename APK
            echo Original APK location: !sourceAPK!
        )
    ) else (
        echo APK not found at: !sourceAPK!
    )
    echo.
) else (
    echo.
    echo BUILD FAILED (exit code: !exitCode!)
    echo.
)

echo.
pause

REM Exit with the captured exit code
exit /b !exitCode!
