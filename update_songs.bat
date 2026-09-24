@echo off
echo ===================================================
echo   Spotify Clone - Automatic Music Folder Indexer
echo ===================================================
echo Scanning 'Songs' directory and generating songs.json...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update_songs.ps1"
echo.
echo Done! Refresh your browser to see your updated music.
pause
