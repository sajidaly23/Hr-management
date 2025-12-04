# MongoDB Setup Guide

## Quick Setup with MongoDB Atlas (Recommended - 2 minutes)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** for a free account (no credit card required)
3. **Create a free cluster** (M0 - Free tier)
4. **Create a database user**:
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Username: `hr_admin` (or any username)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Atlas admin" or "Read and write to any database"
   - Click "Add User"
5. **Whitelist your IP**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your IP
   - Click "Confirm"
6. **Get your connection string**:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/...`)
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `hr_management` or add `?retryWrites=true&w=majority` at the end
7. **Update `.env.local`**:
   - Open `front end/.env.local`
   - Replace the `MONGODB_URI` value with your connection string
   - Example: `MONGODB_URI=mongodb+srv://hr_admin:yourpassword@cluster0.xxxxx.mongodb.net/hr_management?retryWrites=true&w=majority`

8. **Restart your dev server**:
   ```bash
   cd "front end"
   npm run dev
   ```

## Alternative: Local MongoDB Installation

If you prefer to run MongoDB locally:

1. **Download MongoDB Community Server**: https://www.mongodb.com/try/download/community
2. **Install MongoDB** (follow the installer)
3. **Start MongoDB Service**:
   - Open Services (Win + R → `services.msc`)
   - Find "MongoDB" service
   - Right-click → "Start"
   - OR in PowerShell (as Admin): `net start MongoDB`
4. **Update `.env.local`**:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/hr_management
   ```
5. **Restart your dev server**

## Verify Connection

After setting up, try logging in at `/auth/loginpage`. If you see "Invalid email or password" instead of "Internal server error", MongoDB is connected! (You'll need to register a user first at `/auth/registerpage`)

