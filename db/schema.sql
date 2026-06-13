-- ============================================================
--  TEMBEA LAIKIPIA — DATABASE SCHEMA
--  Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ── PROVIDERS TABLE ─────────────────────────────────────────
-- Every person/business that can receive a payout: guides, lodges,
-- transport operators, restaurants, artisans.
create table providers (
  id text primary key,                -- e.g. 'GUIDE_KEVIN', 'ACC001'
  name text not null,
  phone text not null,                -- WhatsApp / M-Pesa number
  role text not null,                 -- 'guide', 'accommodation', 'transport', 'food', 'artisan'
  owner_type text,                    -- 'Women', 'Youth', 'Community', 'Local Business'
  mpesa_till text,                    -- optional till/paybill number for real payouts later
  created_at timestamp with time zone default now()
);

-- ── EXPERIENCES TABLE ───────────────────────────────────────
create table experiences (
  id serial primary key,
  name text not null,
  category text not null,
  location text not null,
  price numeric not null,
  description text not null,
  group_booking boolean default true,
  provider_id text references providers(id),
  base_rating numeric default 4.5,
  emoji text,
  tags text[],                        -- array e.g. {Wildlife,Adventure}
  duration text,
  carbon numeric default 0,
  images text[],                      -- array of image URLs
  created_at timestamp with time zone default now()
);

-- ── RESOURCES DIRECTORY TABLE (Accommodation/Transport/Food) ──
create table resources (
  id text primary key,                -- e.g. 'ACC001'
  name text not null,
  category text not null,             -- 'Accommodation' | 'Transport' | 'Eating Facility'
  subcategory text,
  location text not null,
  owner_type text,
  provider_id text references providers(id),
  price_range text,
  capacity int,
  rating numeric default 4.5,
  description text,
  services text[],
  payment_methods text[],
  emoji text,
  tags text[],
  images text[],
  created_at timestamp with time zone default now()
);

-- ── MARKETPLACE ITEMS TABLE ─────────────────────────────────
create table marketplace_items (
  id serial primary key,
  name text not null,
  price numeric not null,
  artisan text not null,
  provider_id text references providers(id),
  emoji text,
  category text,
  description text,
  images text[],
  created_at timestamp with time zone default now()
);

-- ── REVIEWS TABLE ───────────────────────────────────────────
create table reviews (
  id serial primary key,
  experience_id int references experiences(id),
  resource_id text references resources(id),
  reviewer_name text not null,
  stars int not null check (stars between 1 and 5),
  review_text text,
  created_at timestamp with time zone default now()
);

-- ── BOOKINGS TABLE ───────────────────────────────────────────
create table bookings (
  id uuid primary key default gen_random_uuid(),
  experience_id int references experiences(id),
  tourist_name text not null,
  tourist_phone text not null,
  booking_date date not null,
  num_people int not null default 1,
  total_amount numeric not null,
  payment_status text default 'pending',  -- pending | completed | failed
  mpesa_receipt text,
  created_at timestamp with time zone default now()
);

-- ── PAYMENT SPLITS TABLE ─────────────────────────────────────
-- Records how each booking's payment is divided among providers
create table payment_splits (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  provider_id text references providers(id),
  role text not null,                 -- 'guide', 'platform_fee', 'community_fund', etc.
  percentage numeric not null,        -- e.g. 70.00
  amount numeric not null,            -- computed KES amount
  payout_status text default 'pending', -- pending | paid | failed
  payout_reference text,
  created_at timestamp with time zone default now()
);

-- ── ITINERARIES TABLE (AI Trip Planner saved plans) ─────────
create table itineraries (
  id uuid primary key default gen_random_uuid(),
  tourist_name text,
  tourist_phone text,
  days int not null,
  group_size int not null,
  budget_per_day numeric,
  interests text[],
  owner_pref text,
  total_cost numeric,
  total_carbon numeric,
  itinerary_json jsonb,               -- full generated itinerary detail
  created_at timestamp with time zone default now()
);

-- ── ROW LEVEL SECURITY (RLS) ─────────────────────────────────
-- Allow public read access to listings, restrict writes
alter table providers enable row level security;
alter table experiences enable row level security;
alter table resources enable row level security;
alter table marketplace_items enable row level security;
alter table reviews enable row level security;
alter table bookings enable row level security;
alter table payment_splits enable row level security;
alter table itineraries enable row level security;

-- Public can READ providers, experiences, resources, marketplace, reviews
create policy "Public read providers" on providers for select using (true);
create policy "Public read experiences" on experiences for select using (true);
create policy "Public read resources" on resources for select using (true);
create policy "Public read marketplace" on marketplace_items for select using (true);
create policy "Public read reviews" on reviews for select using (true);

-- Public can INSERT reviews, bookings, splits, itineraries (via API)
create policy "Public insert reviews" on reviews for insert with check (true);
create policy "Public insert bookings" on bookings for insert with check (true);
create policy "Public insert splits" on payment_splits for insert with check (true);
create policy "Public insert itineraries" on itineraries for insert with check (true);

-- Public can read their own bookings/splits (kept open for demo simplicity)
create policy "Public read bookings" on bookings for select using (true);
create policy "Public read splits" on payment_splits for select using (true);
create policy "Public read itineraries" on itineraries for select using (true);
