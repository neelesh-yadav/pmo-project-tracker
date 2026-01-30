# PMO Project Tracker - Complete Setup Guide

## 📋 What You'll Need

1. A computer with internet connection
2. A GitHub account (free)
3. A Render account (free)
4. A MongoDB Atlas account (free)
5. About 30 minutes of your time

---

## 🚀 Step-by-Step Setup Guide

### PART 1: Setting Up MongoDB Database (5 minutes)

**What is MongoDB?** It's like an Excel spreadsheet that stores all your project data online.

1. **Create MongoDB Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Click "Sign up" button
   - Use your email to create account
   - Verify your email

2. **Create a Database**
   - After login, click "Build a Database"
   - Choose "M0 Free" option (it's completely free!)
   - Select "AWS" as cloud provider
   - Choose a region closest to you (e.g., Mumbai for India)
   - Click "Create"

3. **Set Up Database Access**
   - You'll see "Security Quickstart"
   - **Username**: Type `pmoAdmin` (remember this!)
   - **Password**: Click "Autogenerate Secure Password" button
   - **IMPORTANT**: Copy this password and save it in Notepad! You'll need it later
   - Click "Create User"

4. **Set Up Network Access**
   - Click "Add My Current IP Address"
   - Also click "Add a Different IP Address"
   - Type: `0.0.0.0/0` (this allows access from anywhere)
   - Click "Add Entry"
   - Click "Finish and Close"

5. **Get Your Connection String**
   - Click "Connect" button
   - Click "Drivers"
   - You'll see a long string starting with `mongodb+srv://...`
   - Click "Copy" button
   - Open Notepad and paste it
   - Replace `<password>` with your password from step 3
   - It should look like: `mongodb+srv://pmoAdmin:YourPassword123@cluster0.xxxxx.mongodb.net/pmo-tracker?retryWrites=true&w=majority`
   - Save this! You'll use it on Render

---

### PART 2: Uploading Code to GitHub (10 minutes)

**What is GitHub?** It's like Google Drive for code. It stores your project safely online.

1. **Create GitHub Account** (if you don't have one)
   - Go to: https://github.com/signup
   - Follow the signup process
   - Verify your email

2. **Create New Repository**
   - Click the "+" button in top right corner
   - Click "New repository"
   - **Repository name**: `pmo-project-tracker`
   - **Description**: "Enterprise PMO Project Management System"
   - Select "Public"
   - Check "Add a README file"
   - Click "Create repository"

3. **Upload Your Files**
   - You'll see a button "Add file"
   - Click "Upload files"
   - Drag and drop ALL these files from the downloaded folder:
     * `server.js`
     * `package.json`
     * `.gitignore`
     * `.env.example`
     * `public` folder (with index.html inside)
   
   OR you can upload files one by one:
   - Click "Add file" → "Create new file"
   - For `server.js`: Copy content from server.js file and paste
   - Click "Commit new file"
   - Repeat for each file

4. **Your Code is Now Online!**
   - You should see all files listed in your repository
   - Copy the URL from your browser (like: `https://github.com/yourusername/pmo-project-tracker`)

---

### PART 3: Deploying to Render (10 minutes)

**What is Render?** It's like a web hosting service that runs your application 24/7 on the internet.

1. **Create Render Account**
   - Go to: https://render.com/
   - Click "Get Started for Free"
   - Sign up with your GitHub account (easier!)
   - This connects Render to your GitHub

2. **Create New Web Service**
   - Click "New +" button in top right
   - Select "Web Service"
   - You'll see your GitHub repositories
   - Find and click "Connect" next to `pmo-project-tracker`

3. **Configure Your Service**
   Fill in these details:
   
   - **Name**: `pmo-tracker` (or any name you like)
   - **Region**: Choose closest to you
   - **Branch**: `main` (should be automatic)
   - **Runtime**: Select "Node"
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select "Free" (completely free!)

4. **Add Environment Variables** (VERY IMPORTANT!)
   
   Scroll down to "Environment Variables" section:
   
   Click "Add Environment Variable" and add these ONE BY ONE:
   
   **Variable 1:**
   - Key: `MONGODB_URI`
   - Value: Paste your MongoDB connection string from Part 1 (the one you saved in Notepad)
   
   **Variable 2:**
   - Key: `JWT_SECRET`
   - Value: Type any random text like `my-super-secret-key-12345-change-this`
   
   **Variable 3:**
   - Key: `NODE_ENV`
   - Value: `production`

5. **Deploy!**
   - Click "Create Web Service" button at bottom
   - Wait 3-5 minutes while Render builds your app
   - You'll see logs scrolling (this is normal!)
   - When you see "Server running on port..." - it's done!

6. **Get Your Website URL**
   - At the top, you'll see a URL like: `https://pmo-tracker.onrender.com`
   - Click on it to open your application!

---

### PART 4: First Time Setup (5 minutes)

1. **Open Your Application**
   - Go to your Render URL (e.g., `https://pmo-tracker.onrender.com`)
   - You'll see a login page

2. **Initialize Database**
   - Click "Initialize Database" button
   - This creates sample data and admin user
   - Wait for confirmation message

3. **Login**
   - **Email**: `admin@pmo.com`
   - **Password**: `admin123`
   - Click "Login"

4. **You're In!**
   - You'll see the PMO Dashboard
   - Sample projects and project managers are already loaded

---

## 🎯 How to Use the Application

### For PMO (Super Admin):

1. **Add Project Managers**
   - Click "Project Managers" tab
   - Click "Add PM" button
   - Fill in name, email, phone
   - Click "Add PM"

2. **Add Projects**
   - Click "Project Queue" tab
   - Click "New Project" button
   - Fill in project details
   - Select a Project Manager
   - Click "Add Project"

3. **View Capacity**
   - Click "Capacity Planning" tab
   - See which resources are overloaded
   - See available capacity

### For Project Managers:

- Can add their own projects
- Can view only their assigned projects
- Same login page, but different email

---

## 🔧 How to Update Your Application

If you make changes to the code:

1. **Update on GitHub**
   - Go to your GitHub repository
   - Click on the file you want to edit
   - Click pencil icon (Edit)
   - Make your changes
   - Click "Commit changes"

2. **Render Auto-Deploys**
   - Render automatically detects changes
   - Rebuilds your app automatically
   - Wait 2-3 minutes
   - Refresh your browser to see changes

---

## 🔒 Security Tips

1. **Change Admin Password**
   - After first login, create your own admin user
   - Use a strong password

2. **Keep Secrets Safe**
   - NEVER share your MongoDB password
   - NEVER share your Render environment variables
   - NEVER commit .env file to GitHub

3. **Use Strong Passwords**
   - For MongoDB: Use autogenerated passwords
   - For JWT_SECRET: Use random string of 30+ characters

---

## 🆘 Troubleshooting

### Problem: "Can't connect to database"
**Solution**: 
- Check your MONGODB_URI in Render environment variables
- Make sure you replaced `<password>` with actual password
- Check MongoDB Atlas allows connections from `0.0.0.0/0`

### Problem: "Application not loading"
**Solution**:
- Check Render logs (click "Logs" tab)
- Make sure all environment variables are set
- Try restarting the service (click "Manual Deploy" → "Deploy latest commit")

### Problem: "Login not working"
**Solution**:
- Make sure you ran "Initialize Database" first
- Check if using correct email: `admin@pmo.com` and password: `admin123`
- Check browser console for errors (press F12)

### Problem: "Changes not showing"
**Solution**:
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check GitHub that your changes were committed
- Check Render logs to ensure rebuild completed

---

## 📱 Sharing Your Application

To share with your team:

1. Give them your Render URL: `https://your-app-name.onrender.com`
2. Create login accounts for them (or they can register)
3. Assign appropriate roles (PMO, PM, Team, Stakeholder)

---

## 💡 Important Notes

1. **Free Tier Limitations**:
   - Render free tier sleeps after 15 minutes of inactivity
   - First load might take 30 seconds to "wake up"
   - Upgrade to paid plan ($7/month) for always-on service

2. **Data Backup**:
   - MongoDB Atlas automatically backs up your data
   - Can restore from any point in last 7 days (paid feature)

3. **Custom Domain** (Optional):
   - Can add your own domain (like pmo.yourcompany.com)
   - Configure in Render settings under "Custom Domains"

---

## 📞 Need Help?

1. Check Render Logs for error messages
2. Check MongoDB Atlas for connection issues
3. Check browser console (F12) for frontend errors

---

## ✅ Checklist

Before going live:

- [ ] MongoDB database created and connection string obtained
- [ ] GitHub repository created with all files
- [ ] Render web service created and deployed
- [ ] All environment variables added to Render
- [ ] Database initialized with sample data
- [ ] Admin login tested successfully
- [ ] Can add new project managers
- [ ] Can add new projects
- [ ] Can view capacity planning
- [ ] Shared URL with team members

---

**Congratulations! Your PMO Project Tracker is now live! 🎉**

Your application URL: `https://your-app-name.onrender.com`

Save this URL and share with your team!
