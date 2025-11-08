@echo off
echo ============================================
echo  Pushing to GitHub: iptv_complated_work
echo ============================================
echo.
echo Step 1: Create the repository on GitHub first!
echo Go to: https://github.com/new
echo Repository name: iptv_complated_work
echo Owner: alexelgato61-design
echo.
pause
echo.
echo Step 2: Pushing to the new repository...
echo.
git remote remove completed 2>nul
git remote add completed https://github.com/alexelgato61-design/iptv_complated_work.git
git push completed master
echo.
echo ============================================
echo  Done! Check: https://github.com/alexelgato61-design/iptv_complated_work
echo ============================================
pause
