# ⚡ Quick Start Guide

## 3 Simple Steps to Deploy

### 1️⃣ Setup Database (5 minutes)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for FREE account
3. Create a FREE cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/pmo-tracker`
5. Allow all IP addresses (0.0.0.0/0)

### 2️⃣ Upload to GitHub (2 minutes)
1. Create GitHub account: https://github.com
2. Create new repository: `pmo-project-tracker`
3. Upload all files EXCEPT `.env`

### 3️⃣ Deploy on Render (5 minutes)
1. Go to https://render.com
2. Sign up with GitHub
3. Create "New Web Service"
4. Connect your repository
5. Add these environment variables:
   - `MONGODB_URI` = your connection string
   - `JWT_SECRET` = any random 32+ character string
   - `ADMIN_EMAIL` = admin@yourcompany.com
   - `ADMIN_PASSWORD` = YourPassword123!
   - `PORT` = 3001
   - `NODE_ENV` = production
   - `FRONTEND_URL` = *
6. Click "Create Web Service"
7. Wait 5-10 minutes

### 🎉 Done!
Go to your Render URL and login with:
- Email: admin@yourcompany.com
- Password: YourPassword123!

---

## 🆘 Need Help?
Read the full README.md for detailed instructions.

## 🔗 Important Links
- MongoDB: https://cloud.mongodb.com
- GitHub: https://github.com
- Render: https://render.com
