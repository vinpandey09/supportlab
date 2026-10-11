@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if not errorlevel 1 goto systemnode
if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" goto codexnode
echo Please install Node.js 22 or later from https://nodejs.org and reopen this launcher.
pause
exit /b 1
:systemnode
node scripts\preview.mjs --open
goto finished
:codexnode
"%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" scripts\preview.mjs --open
:finished
pause
