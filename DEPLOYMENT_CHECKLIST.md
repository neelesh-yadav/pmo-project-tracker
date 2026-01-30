# ✅ Deployment Checklist

Use this checklist to track your progress!

## Before You Start

- [ ] Have 30 minutes available
- [ ] Have reliable internet connection
- [ ] Have email address ready
- [ ] Have Notepad/TextEdit open for saving passwords

---

## Part 1: MongoDB Setup (5 min)

- [ ] Go to mongodb.com/cloud/atlas/register
- [ ] Create account with email
- [ ] Verify email
- [ ] Click "Build a Database"
- [ ] Select M0 FREE tier
- [ ] Choose AWS provider
- [ ] Select region close to you
- [ ] Click "Create"
- [ ] Create database user:
  - [ ] Username: `pmoAdmin`
  - [ ] Password: (autogenerate and SAVE IT!)
- [ ] Add IP address: `0.0.0.0/0`
- [ ] Get connection string
- [ ] Replace `<password>` in connection string
- [ ] Save connection string in Notepad

**✨ MongoDB Complete!** Connection string saved? → Continue

---

## Part 2: GitHub Upload (5 min)

- [ ] Go to github.com
- [ ] Sign up / Login
- [ ] Click "New repository"
- [ ] Name: `pmo-project-tracker`
- [ ] Description: "PMO Project Management System"
- [ ] Select "Public"
- [ ] Check "Add README"
- [ ] Click "Create repository"
- [ ] Click "Add file" → "Upload files"
- [ ] Upload ALL files:
  - [ ] server.js
  - [ ] package.json
  - [ ] .gitignore
  - [ ] .env.example
  - [ ] public/index.html
  - [ ] README.md
  - [ ] SETUP_GUIDE.md
- [ ] Click "Commit changes"
- [ ] Copy repository URL

**✨ GitHub Complete!** All files uploaded? → Continue

---

## Part 3: Render Deployment (10 min)

- [ ] Go to render.com
- [ ] Click "Get Started for Free"
- [ ] Sign up with GitHub account
- [ ] Authorize Render to access GitHub
- [ ] Click "New +" button
- [ ] Select "Web Service"
- [ ] Find your `pmo-project-tracker` repository
- [ ] Click "Connect"
- [ ] Fill in settings:
  - [ ] Name: `pmo-tracker` (or your choice)
  - [ ] Region: (select closest)
  - [ ] Branch: `main`
  - [ ] Runtime: `Node`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Plan: `Free`

- [ ] Add Environment Variables:
  - [ ] Variable 1:
    - Key: `MONGODB_URI`
    - Value: (paste your MongoDB connection string)
  - [ ] Variable 2:
    - Key: `JWT_SECRET`
    - Value: (type any random text, like: `my-secret-key-12345`)
  - [ ] Variable 3:
    - Key: `NODE_ENV`
    - Value: `production`

- [ ] Click "Create Web Service"
- [ ] Wait for build (3-5 minutes)
- [ ] Look for "Live" status
- [ ] Copy your app URL (e.g., `https://pmo-tracker.onrender.com`)

**✨ Render Complete!** App is live? → Continue

---

## Part 4: Initialize Application (2 min)

- [ ] Open your Render URL in browser
- [ ] See login page?
- [ ] Click "Initialize Database" link
- [ ] Click "Run Setup" button
- [ ] Wait for success message
- [ ] Note the credentials shown:
  - Email: `admin@pmo.com`
  - Password: `admin123`
- [ ] Click "Back to Login"
- [ ] Enter email: `admin@pmo.com`
- [ ] Enter password: `admin123`
- [ ] Click "Login"
- [ ] See dashboard with sample data?

**✨ Initialization Complete!** Can you see the dashboard? → Continue

---

## Part 5: Test Features (5 min)

- [ ] Test Project Queue:
  - [ ] See list of projects
  - [ ] Click on a project
  - [ ] See project details
  - [ ] Close modal

- [ ] Test Adding PM:
  - [ ] Click "Project Managers" tab
  - [ ] Click "Add PM" button
  - [ ] Enter name, email, phone
  - [ ] Click "Add PM"
  - [ ] See new PM in list

- [ ] Test Adding Project:
  - [ ] Click "Project Queue" tab
  - [ ] Click "New Project" button
  - [ ] Fill in project name
  - [ ] Select a PM
  - [ ] Set priority, type, dates
  - [ ] Click "Add Project"
  - [ ] See new project in list

- [ ] Test Capacity Planning:
  - [ ] Click "Capacity Planning" tab
  - [ ] See resource list
  - [ ] See utilization percentages

- [ ] Test Filters:
  - [ ] Use search box
  - [ ] Try status filter
  - [ ] Try priority filter
  - [ ] Click "Clear"

**✨ Testing Complete!** Everything works? → Continue

---

## Part 6: Share & Document (3 min)

- [ ] Copy your app URL
- [ ] Save URL in safe place:
  - Your URL: `_____________________________`

- [ ] Document your credentials:
  - MongoDB URI: (saved in password manager)
  - JWT Secret: (saved in password manager)
  - Admin email: `admin@pmo.com`
  - Admin password: `admin123` (CHANGE THIS!)

- [ ] Share URL with team members

- [ ] Explain to team:
  - [ ] How to access (URL)
  - [ ] Default login (admin@pmo.com / admin123)
  - [ ] Their roles (PMO, PM, Team, Stakeholder)

**✨ Sharing Complete!** Team has access? → Continue

---

## Part 7: Security & Maintenance

- [ ] Change default admin password:
  - [ ] Create new PMO user with your email
  - [ ] Use strong password
  - [ ] Delete or change default admin

- [ ] Set up regular backups:
  - [ ] MongoDB auto-backups enabled (Atlas does this)
  - [ ] Know how to restore (check MongoDB docs)

- [ ] Monitor usage:
  - [ ] Check Render dashboard
  - [ ] Monitor MongoDB usage
  - [ ] Watch for errors in logs

- [ ] Plan for growth:
  - [ ] Know when to upgrade from free tier
  - [ ] Render free = sleeps after 15 min
  - [ ] Paid = $7/month always-on

**✨ Security Complete!** Production ready!

---

## 🎉 CONGRATULATIONS!

You've successfully deployed your PMO Project Tracker!

### Your Application Details:

**Live URL:** `____________________________`

**Admin Access:**
- Email: admin@pmo.com (change this!)
- Password: (your new password)

**Hosting:**
- Database: MongoDB Atlas (Free M0)
- Frontend: Render
- Backend: Render
- Code: GitHub

### What You Accomplished:

✅ Set up cloud database
✅ Deployed full-stack application
✅ Configured environment variables
✅ Initialized with sample data
✅ Tested all features
✅ Secured application
✅ Shared with team

### Next Steps:

1. Add real project managers
2. Create real projects
3. Assign resources
4. Track capacity
5. Monitor dependencies
6. Generate reports

### Need Help?

- Render issues → Check render.com/docs
- MongoDB issues → Check mongodb.com/docs
- Application issues → Check SETUP_GUIDE.md

### Upgrade Options:

When you need more:
- Render paid: $7/month (no sleep)
- MongoDB paid: $9/month (more storage)
- Custom domain: $10/year

---

**Remember to:**
- 🔐 Change default passwords
- 💾 Backup regularly
- 📊 Monitor usage
- 🚀 Train your team
- ⭐ Star the GitHub repo!

**You did it! 🎊**
