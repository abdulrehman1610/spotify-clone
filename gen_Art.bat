@echo off
title Spotify Clone - Generate Album Art (gen_Art)
echo Running gen_Art.py to extract album covers...
py "%~dp0gen_Art.py" 2>nul || python "%~dp0gen_Art.py"
pause
