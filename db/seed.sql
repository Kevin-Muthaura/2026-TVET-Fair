-- ============================================================
--  TEMBEA LAIKIPIA — SEED DATA
--  Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ── PROVIDERS ────────────────────────────────────────────────
insert into providers (id, name, phone, role, owner_type) values
  ('GUIDE_KEVIN',   'Muthaura Kevin',  '254714974036', 'guide', 'Community'),
  ('GUIDE_WAMAI',   'Wairimu Wamai',   '254792098960', 'guide', 'Youth'),
  ('GUIDE_JULIET',  'Gichuru Juliet',  '254717194081', 'guide', 'Women'),
  ('GUIDE_LAITH',   'Smychus Laith',   '254791388040', 'guide', 'Youth'),
  ('GUIDE_KEN',     'Ken Obuya',       '254799295884', 'guide', 'Community'),
  ('ACC_ENKAI',     'Enkai Eco Stay',  '254714974036', 'accommodation', 'Community'),
  ('ACC_MTKENYA',   'Mt Kenya View Bandas', '254792098960', 'accommodation', 'Youth'),
  ('ACC_SAMBURU',   'Samburu Hills Camp', '254799295884', 'accommodation', 'Community'),
  ('ACC_WIYUMI',    'Wiyumiririe Farm Stay', '254717194081', 'accommodation', 'Women'),
  ('TRN_SAFARIVAN', 'Laikipia Safari Vans', '254706308361', 'transport', 'Youth'),
  ('TRN_BODA',      'Boda Boda Laikipia Riders', '254726636552', 'transport', 'Youth'),
  ('TRN_SHUTTLE',   'Ngare Ndare Shuttle', '254791388040', 'transport', 'Community'),
  ('TRN_OLPEJETA',  'Ol Pejeta Transfers', '254799041089', 'transport', 'Local Business'),
  ('FOD_MAMANAS',   'Mama Naserian Kitchen', '254759647988', 'food', 'Women'),
  ('FOD_KARIBU',    'Karibu Laikipia Grill', '254714974036', 'food', 'Youth'),
  ('FOD_WANJIKU',   'Wanjiku''s Farm Cafe', '254717194081', 'food', 'Women'),
  ('FOD_SAMBURU',   'Samburu Boma Meals', '254798208272', 'food', 'Community'),
  ('PLATFORM',      'Tembea Laikipia Platform', '254714974036', 'platform', 'Platform'),
  ('COMMUNITY_FUND','Laikipia Community Conservation Fund', '254714974036', 'fund', 'Community')
on conflict (id) do nothing;

-- ── EXPERIENCES ──────────────────────────────────────────────
insert into experiences (id, name, category, location, price, description, group_booking, provider_id, base_rating, emoji, tags, duration, carbon) values
  (1, 'Chimpanzee Trekking', 'Wildlife / Conservation', 'Sweetwaters Chimpanzee Sanctuary, Ol Pejeta', 13000,
   'The only place in Kenya to see rescued chimpanzees in a natural forest habitat — an extraordinary and rare encounter.',
   true, 'GUIDE_KEVIN', 4.5, '🦍', array['Wildlife','Conservation'], '3 hours', 2.1),

  (2, 'Rhino Tracking', 'Wildlife / Adventure', 'Ol Pejeta Conservancy, Laikipia', 10000,
   'Walking or vehicle-based safari to see the world''s last Northern White Rhinos — critically endangered and awe-inspiring.',
   true, 'GUIDE_WAMAI', 4.7, '🦏', array['Wildlife','Adventure'], '4 hours', 1.8),

  (3, 'Night Game Drives', 'Adventure / Wildlife', 'Loisaba Conservancy, Laikipia', 10000,
   'Experience the African bush after dark. Spot nocturnal predators like lions, leopards, and genets under a canopy of stars.',
   false, 'GUIDE_JULIET', 4.6, '🌙', array['Wildlife','Adventure'], '3 hours', 1.5),

  (4, 'Canopy Walk', 'Nature / Adventure', 'Ngare Ndare Forest, Laikipia', 3000,
   'A breathtaking 450-metre bridge suspended 10 metres high through an ancient indigenous forest canopy — pure magic.',
   true, 'GUIDE_LAITH', 4.8, '🌿', array['Nature','Adventure'], '2 hours', 0.3),

  (5, 'Horseback Safaris', 'Adventure / Sports', 'Borana Lodge & Conservancy, Laikipia', 100,
   'Ride silently alongside giraffes and zebras for a unique, intimate safari experience that no vehicle can replicate.',
   true, 'GUIDE_KEN', 4.8, '🐎', array['Adventure'], '2 hours', 0.1)
on conflict (id) do nothing;

-- ── RESOURCES DIRECTORY ──────────────────────────────────────
insert into resources (id, name, category, subcategory, location, owner_type, provider_id, price_range, capacity, rating, description, services, payment_methods, emoji, tags) values

  ('ACC001','Enkai Eco Stay','Accommodation','Eco-Lodge','Nanyuki','Community','ACC_ENKAI','KES 3,500–6,000',12,4.6,
   'Traditional Maasai eco-lodge built with local materials. Meals, guided tours and cultural visits included.',
   array['Meals','Guided Tours','Cultural Visits'], array['Mpesa','Cash'], '🏡', array['Budget-Friendly','Cultural']),

  ('ACC002','Mt Kenya View Bandas','Accommodation','Budget Stay','Timau','Youth Group','ACC_MTKENYA','KES 1,500–3,000',8,4.2,
   'Affordable bandas for backpackers and students with stunning Mt Kenya views.',
   array['Hiking','Camping','Bonfire'], array['Mpesa','Cash'], '⛺', array['Budget-Friendly','Youth']),

  ('ACC003','Samburu Hills Camp','Accommodation','Tented Camp','Laikipia North','Community','ACC_SAMBURU','KES 5,000–9,000',10,4.7,
   'Semi-luxury tented camp with panoramic wildlife views in Laikipia North.',
   array['Game Drives','Meals','Guiding'], array['Mpesa','Card'], '🏕️', array['Wildlife','Premium']),

  ('ACC004','Wiyumiririe Farm Stay','Accommodation','Farm Stay','Rumuruti','Women Group','ACC_WIYUMI','KES 2,000–4,000',6,4.3,
   'Agro-tourism homestay with authentic farm experience in rural Laikipia.',
   array['Farm Tours','Meals','Cycling'], array['Mpesa','Cash'], '🌾', array['Cultural','Women-owned']),

  ('TRN001','Laikipia Safari Vans','Transport','Van Hire','Nanyuki','Youth Owned','TRN_SAFARIVAN','KES 8,000–15,000',7,4.5,
   'Tour vans for park and conservancy visits across Laikipia. Driver, fuel and guide included.',
   array['Driver','Fuel','Guide'], array['Mpesa','Cash'], '🚐', array['Wildlife','Youth']),

  ('TRN002','Boda Boda Laikipia Riders','Transport','Boda Boda','Nanyuki Town','Youth Group','TRN_BODA','KES 200–800',2,4.1,
   'Affordable short-distance rides around Nanyuki Town — quick, easy and community-supported.',
   array['Town Rides','Delivery'], array['Cash','Mpesa'], '🏍️', array['Budget-Friendly','Youth']),

  ('TRN003','Ngare Ndare Shuttle','Transport','Shuttle Service','Nanyuki–Ngare Ndare','Community','TRN_SHUTTLE','KES 500–1,500',14,4.4,
   'Daily shuttle connecting Nanyuki to conservancies and the Ngare Ndare forest site.',
   array['Transfers','Group Travel'], array['Mpesa','Cash'], '🚌', array['Nature','Budget-Friendly']),

  ('TRN004','Ol Pejeta Transfers','Transport','Private Car','Nanyuki','Local Business','TRN_OLPEJETA','KES 3,000–7,000',4,4.6,
   'Private car hire for conservancy visits with a knowledgeable local driver.',
   array['Driver','Custom Trips'], array['Mpesa','Cash'], '🚗', array['Wildlife','Premium']),

  ('FOD001','Mama Naserian Kitchen','Eating Facility','Local Restaurant','Nanyuki Market','Women Owned','FOD_MAMANAS','KES 300–800',20,4.5,
   'Authentic Maasai and Swahili dishes prepared fresh daily. A true taste of Laikipia.',
   array['Takeaway','Dine-in'], array['Cash','Mpesa'], '🍲', array['Cultural','Women-owned']),

  ('FOD002','Karibu Laikipia Grill','Eating Facility','Grill & BBQ','Nanyuki Town','Youth Owned','FOD_KARIBU','KES 500–1,200',25,4.3,
   'Local nyama choma and grilled meals in a lively open-air setting.',
   array['Dine-in','Takeaway'], array['Mpesa','Cash'], '🔥', array['Youth','Budget-Friendly']),

  ('FOD003','Wanjiku''s Farm Cafe','Eating Facility','Organic Cafe','Timau','Women Group','FOD_WANJIKU','KES 400–1,000',15,4.6,
   'Organic farm-to-table meals sourced directly from the surrounding Timau farms.',
   array['Vegetarian','Breakfast'], array['Mpesa','Cash'], '🥗', array['Women-owned','Organic']),

  ('FOD004','Samburu Boma Meals','Eating Facility','Cultural Dining','Laikipia North','Community','FOD_SAMBURU','KES 600–1,500',30,4.7,
   'Traditional meals served in a cultural boma setting — a complete community dining experience.',
   array['Cultural Experience','Group Dining'], array['Mpesa','Cash'], '🫕', array['Cultural','Community'])
on conflict (id) do nothing;

-- ── MARKETPLACE ITEMS ────────────────────────────────────────
insert into marketplace_items (id, name, price, artisan, provider_id, emoji, category, description) values
  (1,'Maasai Beaded Bracelet',850,'Kevin Muthaura','GUIDE_KEVIN','📿','Crafts',
   'Handcrafted using traditional Maasai beading techniques. Each piece is unique and made with genuine seed beads.'),
  (2,'Hand-woven Kikoi Wrap',1500,'Wamai Wairimu','GUIDE_WAMAI','🧣','Textiles',
   'Vibrant, locally woven kikoi fabric from Laikipia. Perfect as a beach wrap, scarf or wall hanging.'),
  (3,'Organic Laikipia Honey (500g)',600,'Juliet Gichuru','GUIDE_JULIET','🍯','Food',
   'Pure raw honey harvested from wild beehives in Laikipia''s indigenous forests. Unprocessed and naturally sweet.'),
  (4,'Hand-carved Soapstone Bowl',1200,'Laith Smychus','GUIDE_LAITH','🪨','Art',
   'Intricately carved soapstone bowl made by Laikipia craftsmen. A beautiful and functional piece of African art.'),
  (5,'Samburu Leather Sandals',2000,'Ken Obuya','GUIDE_KEN','👡','Fashion',
   'Handstitched leather sandals in the traditional Samburu style. Durable, comfortable and authentically Kenyan.'),
  (6,'Baobab Body Oil (100ml)',750,'Kevin Muthaura','GUIDE_KEVIN','🌿','Wellness',
   'Cold-pressed baobab seed oil sourced from Laikipia''s ancient baobab trees. Nourishing for skin and hair.')
on conflict (id) do nothing;
