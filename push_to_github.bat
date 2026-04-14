@echo off
echo =======================================================
echo     Uploading updates to your GitHub Repository...
echo =======================================================
echo.

:: Add all changed files
git add .

:: Commit the files
git commit -m "Automated update: Added Premium Passes, Razorpay dynamic links, and Footer Policies"

:: Set up the link just in case it is disconnected
git remote add origin https://github.com/durgamsaishankargoud0702-debug/resume-builder.git 2>nul || git remote set-url origin https://github.com/durgamsaishankargoud0702-debug/resume-builder.git

:: Push the changes to the main branch
echo Pushing code to https://github.com/durgamsaishankargoud0702-debug/resume-builder ...
git push -u origin main || git push -u origin master

echo.
echo =======================================================
echo   Done! Your GitHub repo should now be updated!
echo   Vercel will detect this and deploy automatically.
echo =======================================================
pause
