@echo off
title Spotify Clone Web Server (Port 3002)
echo Starting Spotify Clone Web Server on http://localhost:3002 ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1" -Port 3002
pause
