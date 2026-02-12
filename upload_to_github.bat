@echo off
echo Initialization git repository...
git init

echo Cleaning cache to ensure .gitignore is respected...
git rm -r --cached .

echo Adding files...
git add .

echo Committing...
git commit -m "Upload project files"

echo Renaming branch to main...
git branch -M main

echo Adding remote...
git remote add origin https://github.com/liwenjinghug/tanhui_shool-PRO.git
REM If remote already exists, set url just in case
git remote set-url origin https://github.com/liwenjinghug/tanhui_shool-PRO.git

echo Pushing to GitHub...
git push -u origin main

echo Done.
pause

