# Tembea Laikipia — Smart Community Tourism Platform

A Next.js web application connecting tourists with local Laikipia guides, accommodation, food, transport, and artisans — with automatic payment splitting and an AI-powered trip planner.

---

## 🆕 What's New in This Version

This version implements three major upgrades requested in `CHANGE SUGGESTIONS.docx`:

### 1. Database Integration (Supabase + Vercel)
- All experiences, accommodation/transport/food listings, marketplace items, reviews, bookings, and payment splits are stored in a real Postgres database (Supabase)
- The site works even **without** a database connected — it falls back to built-in demo data
- See `DEPLOYMENT_GUIDE.md` for a complete, non-technical, step-by-step setup guide

### 2. "Click for More Info"
- Every experience card, accommodation/transport/food listing, and marketplace item is now clickable
- Opens a detail popup with: full description, what's included, meeting point, best time to visit, amenities, services, reviews, and contact/booking actions

### 3. Automatic Payment Splitting (No Central Wallet)
- When a tourist books an experience, pays for a marketplace item, or generates a full AI itinerary, the system **automatically calculates** how the total payment should be divided:
  - **Single experience booking**: 85% to the guide, 10% platform fee, 5% community conservation fund
  - **Full AI itinerary**: 100% of accommodation cost → accommodation provider; 100% of food cost → food provider; 100% of transport cost → transport provider; each activity split 85/10/5 as above
  - **Marketplace order**: 92% to the artisan/vendor, 8% platform fee
- This is currently a **realistic simulation** — the math is real and shown to tourists and providers, but actual M-Pesa money movement requires Safaricom Daraja B2C API approval (see Part 6 of the deployment guide)
- The splitting logic lives in `lib/paymentSplit.js` and can be adjusted by changing the percentages in `SPLIT_RULES`

---

## 📁 Project Structure

```
tembea-laikipia/
├── pages/
│   ├── index.js              ← Main homepage
│   ├── _app.js               ← App wrapper (loads global CSS, registers service worker)
│   └── api/
│       ├── experiences.js    ← GET all experiences
│       ├── resources.js      ← GET tourism directory (accommodation/transport/food)
│       ├── marketplace.js     ← GET marketplace items
│       ├── reviews.js         ← GET/POST reviews
│       ├── bookings.js        ← POST booking + auto payment split
│       ├── itinerary-split.js ← POST itinerary line items + auto payment split
│       └── marketplace-order.js ← POST marketplace order + auto payment split
├── components/               ← All React UI components
├── lib/
│   ├── supabaseClient.js     ← Database connection
│   ├── dataAccess.js         ← Data fetching (DB or fallback to static data)
│   ├── paymentSplit.js        ← ⭐ Automatic payment splitting logic
│   └── utils.js               ← Shared helper functions
├── data/
│   └── staticData.js          ← Built-in demo data (used if DB not connected)
├── db/
│   ├── schema.sql              ← Database table definitions
│   └── seed.sql                 ← Starting data for the database
├── public/                     ← Icons, manifest, service worker
├── styles/globals.css          ← All styling
└── DEPLOYMENT_GUIDE.md         ← ⭐ START HERE for non-technical deployment
```

---

## 🚀 Quick Start (For Developers)

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The site works immediately with demo data — no database setup required for local testing.

To connect a real database, copy `.env.local.example` to `.env.local` and fill in your Supabase credentials (see `DEPLOYMENT_GUIDE.md` Part 1).

---

## 🌍 Core Features (All Versions)

- AI Trip Planner (budget, interests, group size, ownership preference → full itinerary)
- Carbon footprint tracking with tree-planting recommendations
- Community Impact Dashboard with live ownership statistics
- Tourism Resources Directory (accommodation, transport, food) filterable by category and ownership type
- Local Marketplace with WhatsApp ordering
- Star ratings & reviews delivered directly to guides via WhatsApp
- M-Pesa payment simulation with STK push flow
- TVET skills showcase section
- Progressive Web App (installable on Android/iOS home screens)

---

## 📞 Support

For deployment help, see `DEPLOYMENT_GUIDE.md`. For feature changes or bug fixes, describe the issue in plain language and provide the error message or screenshot if available.
