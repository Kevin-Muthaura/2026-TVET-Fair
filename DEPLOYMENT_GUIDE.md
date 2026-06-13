# Tembea Laikipia — Complete Deployment Guide
### For non-technical users — follow each step in order

This guide takes you from "I have a folder of code" to "my website is live on the internet with its own database and automatic payment splitting."

You do NOT need to know how to code. You will mostly be clicking buttons on websites and copying/pasting short pieces of text.

---

## 📦 What You're Deploying

Your platform now has three big upgrades:

1. **A real database** (via Supabase) — stores experiences, accommodation/transport/food listings, marketplace items, reviews, bookings, and payment splits
2. **"Click for more info"** — every experience, hotel, transport option, eatery, and marketplace item can be clicked to see full details
3. **Automatic payment splitting** — when a tourist pays, the system automatically calculates how much each provider (guide, lodge, restaurant, driver, artisan, platform, and community fund) should receive — no single "wallet" holds the money

This is now a **Next.js** project (a more powerful type of website than plain HTML), so it deploys through **Vercel** instead of Netlify.

---

## PART 1 — Set Up the Database (Supabase)

Supabase gives you a free database with a simple visual dashboard — think of it like an online spreadsheet that your website can read and write to.

### Step 1 — Create a Supabase account

1. Go to **[supabase.com](https://supabase.com)**
2. Click **"Start your project"**
3. Sign up with GitHub or Google (GitHub is recommended since you'll need it for Vercel too)

### Step 2 — Create a new project

1. Click **"New Project"**
2. Fill in:
   - **Name**: `tembea-laikipia`
   - **Database Password**: create a strong password and **save it somewhere safe** (you likely won't need it again, but keep it just in case)
   - **Region**: choose the one closest to Kenya — `Europe (London)` or `Africa` if available, otherwise the closest option
3. Click **"Create new project"**
4. Wait 1–2 minutes while Supabase sets things up

### Step 3 — Create the database tables

1. On the left sidebar, click **"SQL Editor"**
2. Click **"New query"**
3. Open the file `db/schema.sql` (included in your project folder)
4. Copy **ALL** the text from that file
5. Paste it into the Supabase SQL editor
6. Click **"Run"** (bottom right, or press Ctrl+Enter)
7. You should see "Success. No rows returned" — this means all your tables were created ✅

### Step 4 — Add your starting data

1. Still in the SQL Editor, click **"New query"** again
2. Open the file `db/seed.sql` from your project folder
3. Copy **ALL** the text from that file
4. Paste it into the new query box
5. Click **"Run"**
6. You should again see "Success" — your experiences, providers, accommodation, transport, food, and marketplace items are now in the database ✅

### Step 5 — Get your API keys

1. On the left sidebar, click the **gear icon (⚙️ Project Settings)**
2. Click **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public** key — a long string of letters and numbers
4. Copy both of these somewhere safe (e.g. a Notes app) — you'll need them in Part 3

✅ **Your database is ready.** Even before connecting it, your website will work using built-in demo data — but connecting it means all bookings, reviews, and itineraries get saved permanently and shared across all visitors.

---

## PART 2 — Push Your Code to GitHub

Vercel deploys directly from GitHub, so your code needs to live there first.

### Step 1 — Create a GitHub account

If you don't have one: go to **[github.com](https://github.com)** and sign up (free).

### Step 2 — Create a new repository

1. Click the **"+"** icon (top right) → **"New repository"**
2. Name it: `tembea-laikipia`
3. Keep it **Private** (recommended) or Public — either works
4. Do NOT check "Add a README" (your project already has files)
5. Click **"Create repository"**

### Step 3 — Upload your project folder

GitHub gives you a few options. The easiest for non-technical users:

1. On the new repository page, click **"uploading an existing file"** (a link in the Quick Setup section)
2. Open your `tembea-laikipia` project folder on your computer
3. Select **all files and folders** inside it (but NOT the `node_modules` folder if present — it's huge and not needed)
4. Drag them into the GitHub upload area
5. Wait for the upload to finish (this can take a few minutes for many files)
6. Scroll down, write a message like "Initial upload", and click **"Commit changes"**

> 💡 **Tip**: If the upload fails because there are too many files, try uploading folder-by-folder (e.g. `pages/`, `components/`, `lib/`, `data/`, `db/`, `public/`, `styles/`, then the root files like `package.json`).

---

## PART 3 — Deploy to Vercel

### Step 1 — Create a Vercel account

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** — this links your accounts automatically

### Step 2 — Import your project

1. On your Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find `tembea-laikipia` and click **"Import"**

### Step 3 — Add your database connection (Environment Variables)

Before clicking deploy, you need to tell Vercel about your Supabase database:

1. On the import screen, find the section called **"Environment Variables"**
2. Add these two entries (using the values you copied in Part 1, Step 5):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | (your Supabase Project URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (your Supabase anon public key) |

3. Click **"Add"** after typing each one

### Step 4 — Deploy

1. Click the big **"Deploy"** button
2. Wait 1–3 minutes while Vercel builds your site
3. When it's done, you'll see "Congratulations!" with a screenshot of your live site
4. Click **"Continue to Dashboard"**, then click **"Visit"** to see your live website

🎉 **Your site is now live!** It will have a URL like `tembea-laikipia.vercel.app`

---

## PART 4 — Get a Clean Custom URL

### Rename your Vercel project (free)

1. In Vercel, go to your project → **Settings** → **General**
2. Find **"Project Name"** and change it to `tembea-laikipia`
3. Your link becomes: `https://tembea-laikipia.vercel.app` ✅

### Optional — Connect a custom domain (e.g. tembealaikpia.co.ke)

1. Register a `.co.ke` domain at **[kenic.or.ke](https://www.kenic.or.ke)** (~KES 1,200–1,500/year)
2. In Vercel: project → **Settings** → **Domains** → **Add**
3. Type your domain name
4. Vercel shows you DNS records to add — copy these into your domain registrar's DNS settings
5. Wait 24–48 hours for it to activate (Vercel adds free HTTPS automatically)

---

## PART 5 — Verify Everything Works

Visit your live site and check:

✅ **Bottom-left corner** shows a small badge: "Database connected" (green dot) — if it shows "Demo mode" (orange dot), double-check your environment variables in Vercel Settings → Environment Variables, then redeploy (Settings → Deployments → click "..." on latest → Redeploy)

✅ **Click an experience card** — a detail popup should open with full description, what's included, meeting point, etc.

✅ **Click "Book Now"** on an experience → fill the form → simulate M-Pesa payment → you should see a **payment split breakdown** showing exactly how much goes to the guide, platform fee, and community fund

✅ **Click "Plan My Trip"** → generate an itinerary → click "Show Automatic Payment Split" → see the full breakdown across accommodation, food, transport, and each guide

✅ **Click a marketplace item** → "Preview Payment Split" → see artisan vs platform fee breakdown

✅ **Submit a review** on an experience → it should appear instantly and also open WhatsApp to the guide

---

## PART 6 — Making Real Payment Splitting Live (Future Step)

Right now, the payment split is calculated and shown to everyone (tourists, you, and providers can all see exactly how money *would* be divided), but the actual M-Pesa payment is simulated.

To make payouts **automatically and instantly real** (money actually moves to each provider's M-Pesa account), you'll eventually need:

1. **A registered business** (sole proprietorship or company) — required by Safaricom
2. **Safaricom Daraja API access** with **B2C (Business to Customer)** approval — this lets your system send M-Pesa payments programmatically to multiple phone numbers
3. **A small backend service** that, after receiving a customer's payment via STK Push (C2B), immediately triggers B2C payments to each provider based on the split percentages already calculated by this system

This typically takes Safaricom 2–6 weeks to approve for B2C. When you're ready for this step, the calculation logic (`lib/paymentSplit.js`) is already built and tested — it just needs to be connected to real Safaricom API calls instead of being simulated. Come back and ask for help with this step when you're ready, and bring your Daraja API credentials.

---

## PART 7 — Making Day-to-Day Updates

### To update experiences, accommodation, transport, food, or marketplace items:

The easiest way is directly in Supabase:

1. Go to your Supabase project → **"Table Editor"** (left sidebar)
2. Choose the table you want to edit (e.g. `experiences`, `resources`, `marketplace_items`)
3. Click any cell to edit it directly, like an Excel spreadsheet
4. Click the **"+"** button to add a new row (new experience, new lodge, new product, etc.)
5. Changes appear on your live site within seconds — no redeployment needed!

### To change the website's design, text, or features:

This requires editing code files and re-uploading to GitHub (Vercel automatically redeploys). Come back here and ask for help with specific changes — describe what you want changed in plain language.

---

## Troubleshooting

**"Demo mode" badge won't go away after adding environment variables**
→ Go to Vercel → your project → Deployments tab → click the three dots on the latest deployment → "Redeploy"

**Build fails on Vercel**
→ Click on the failed deployment to see the error log, then share that error message when asking for help

**Reviews/bookings aren't showing on other devices**
→ This means the database isn't connected yet — double check Part 3, Step 3 (environment variables) and that Part 1 (schema.sql + seed.sql) ran successfully

**WhatsApp links open but show no message**
→ This is a browser permissions issue, not a site issue — try on a phone with WhatsApp installed, or use WhatsApp Web on desktop

---

## Quick Reference — Your Important Links

| What | Where |
|---|---|
| Live website | `https://tembea-laikipia.vercel.app` |
| Database dashboard | `https://supabase.com/dashboard` |
| Code repository | `https://github.com/YOUR-USERNAME/tembea-laikipia` |
| Deployment dashboard | `https://vercel.com/dashboard` |

Keep this guide — you'll refer back to it whenever you make updates.
