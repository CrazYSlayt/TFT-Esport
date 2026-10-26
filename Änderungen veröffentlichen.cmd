@echo off
rem TFTEsport – alle Änderungen (z. B. aus "Turniere bearbeiten.html") zu GitHub hochladen. Vercel stellt sie danach automatisch live.
chcp 65001 >nul
cd /d "%~dp0"
set "GIT=%LOCALAPPDATA%\PortableGit\cmd\git.exe"
if not exist "%GIT%" (
  echo Git wurde nicht gefunden: %GIT%
  pause
  exit /b 1
)
"%GIT%" add -A
"%GIT%" diff --cached --quiet && (
  echo Keine Änderungen – alles ist schon online.
  pause
  exit /b 0
)
for /f %%d in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH:mm"') do set "STAMP=%%d"
"%GIT%" commit -q -m "Update %STAMP%"
"%GIT%" push -q
if errorlevel 1 (
  echo.
  echo Hochladen hat nicht geklappt. Bitte Meldung oben an Claude weitergeben.
) else (
  echo.
  echo Fertig. In 1-2 Minuten ist die Seite aktualisiert.
)
pause
