# 🚀 Supabase Setup Guide for TCF Simulator

## Step 1: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (the one you already created)
3. **Go to Settings → API** (in the left sidebar)
4. **Copy these two values**:
   - **Project URL** (looks like: `https://abcdefghijk.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

## Step 2: Update Your .env File

1. **Open the `.env` file** in your project root
2. **Replace the placeholder values** with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Step 3: Set Up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Create a new query**
3. **Copy and paste** the contents of `supabase/migrations/001_initial_schema.sql`
4. **Click "Run"** to create all tables
5. **Create another new query**
6. **Copy and paste** the contents of `supabase/migrations/002_sample_data.sql`
7. **Click "Run"** to add sample data

## Step 4: Enable Realtime

1. **Go to Database → Replication** in Supabase
2. **Enable realtime** for these tables:
   - `exam_sets`
   - `questions` 
   - `users`

## Step 5: Restart Your Application

1. **Stop the development server** (Ctrl+C)
2. **Run** `npm run dev` again
3. **Check the console** - you should see "✅ Supabase configured successfully"

## ✅ What You'll Have After Setup

- 🌐 **Multi-user access** - Students can access from any device
- 🔄 **Real-time updates** - When you create exams, all users see them instantly
- 💾 **Cloud database** - All data saved permanently
- 🔐 **User authentication** - Secure login system
- 📊 **Progress tracking** - Student progress saved across sessions

## 🎯 Test Your Setup

1. **Login as admin** with your credentials
2. **Go to Admin Panel**
3. **Create a new exam** - it should save to database
4. **Add questions** - they should appear immediately
5. **Open another browser/device** - changes should be visible everywhere

## 🆘 Need Help?

If you see any errors:
1. **Check your .env file** has the correct credentials
2. **Make sure you ran both SQL scripts** in the correct order
3. **Restart the development server** after updating .env
4. **Check the browser console** for specific error messages

Your TCF Simulator is now ready for multi-user, real-time operation! 🎉