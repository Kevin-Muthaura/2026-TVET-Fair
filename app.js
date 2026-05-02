// ============================================================
//  TEMBEA LAIKIPIA — Smart Community Tourism System v3
//  app.js · Full AI Planner + Directory + Impact + Marketplace
// ============================================================

// ── EXPERIENCES DATA ─────────────────────────────────────────
const experiences = [
  {
    id: 1, name: "Chimpanzee Trekking", category: "Wildlife / Conservation",
    location: "Sweetwaters Chimpanzee Sanctuary, Ol Pejeta", price: 13000,
    description: "The only place in Kenya to see rescued chimpanzees in a natural forest habitat — an extraordinary and rare encounter.",
    groupBooking: true, guide: { name: "Muthaura Kevin", phone: "254714974036" },
    baseRating: 4.5, emoji: "🦍", tags: ["Wildlife", "Conservation"], duration: "3 hours", carbon: 2.1,
  },
  {
    id: 2, name: "Rhino Tracking", category: "Wildlife / Adventure",
    location: "Ol Pejeta Conservancy, Laikipia", price: 10000,
    description: "Walking or vehicle-based safari to see the world's last Northern White Rhinos — critically endangered and awe-inspiring.",
    groupBooking: true, guide: { name: "Wairimu Wamai", phone: "254792098960" },
    baseRating: 4.7, emoji: "🦏", tags: ["Wildlife", "Adventure"], duration: "4 hours", carbon: 1.8,
  },
  {
    id: 3, name: "Night Game Drives", category: "Adventure / Wildlife",
    location: "Loisaba Conservancy, Laikipia", price: 10000,
    description: "Experience the African bush after dark. Spot nocturnal predators like lions, leopards, and genets under a canopy of stars.",
    groupBooking: false, guide: { name: "Gichuru Juliet", phone: "254717194081" },
    baseRating: 4.6, emoji: "🌙", tags: ["Wildlife", "Adventure"], duration: "3 hours", carbon: 1.5,
  },
  {
    id: 4, name: "Canopy Walk", category: "Nature / Adventure",
    location: "Ngare Ndare Forest, Laikipia", price: 3000,
    description: "A breathtaking 450-metre bridge suspended 10 metres high through an ancient indigenous forest canopy — pure magic.",
    groupBooking: true, guide: { name: "Smychus Laith", phone: "254791388040" },
    baseRating: 4.8, emoji: "🌿", tags: ["Nature", "Adventure"], duration: "2 hours", carbon: 0.3,
  },
  {
    id: 5, name: "Horseback Safaris", category: "Adventure / Sports",
    location: "Borana Lodge & Conservancy, Laikipia", price: 100,
    description: "Ride silently alongside giraffes and zebras for a unique, intimate safari experience that no vehicle can replicate.",
    groupBooking: true, guide: { name: "Ken Obuya", phone: "254799295884" },
    baseRating: 4.8, emoji: "🐎", tags: ["Adventure"], duration: "2 hours", carbon: 0.1,
  },
];

// ── TOURISM RESOURCES DIRECTORY (from Excel) ─────────────────
const resourcesDirectory = [
  // ACCOMMODATION
  {
    id: "ACC001", name: "Enkai Eco Stay", category: "Accommodation", subcategory: "Eco-Lodge",
    location: "Nanyuki", ownerType: "Community", contact: "Muthaura Kevin", phone: "254714974036",
    priceRange: "KES 3,500–6,000", capacity: 12, rating: 4.6,
    description: "Traditional Maasai eco-lodge built with local materials. Meals, guided tours and cultural visits included.",
    services: ["Meals", "Guided Tours", "Cultural Visits"], payment: ["Mpesa", "Cash"],
    emoji: "🏡", tags: ["Budget-Friendly", "Cultural"],
  },
  {
    id: "ACC002", name: "Mt Kenya View Bandas", category: "Accommodation", subcategory: "Budget Stay",
    location: "Timau", ownerType: "Youth Group", contact: "Wairimu Wamai", phone: "254792098960",
    priceRange: "KES 1,500–3,000", capacity: 8, rating: 4.2,
    description: "Affordable bandas for backpackers and students with stunning Mt Kenya views.",
    services: ["Hiking", "Camping", "Bonfire"], payment: ["Mpesa", "Cash"],
    emoji: "⛺", tags: ["Budget-Friendly", "Youth"],
  },
  {
    id: "ACC003", name: "Samburu Hills Camp", category: "Accommodation", subcategory: "Tented Camp",
    location: "Laikipia North", ownerType: "Community", contact: "Ken Obuya", phone: "254799295884",
    priceRange: "KES 5,000–9,000", capacity: 10, rating: 4.7,
    description: "Semi-luxury tented camp with panoramic wildlife views in Laikipia North.",
    services: ["Game Drives", "Meals", "Guiding"], payment: ["Mpesa", "Card"],
    emoji: "🏕️", tags: ["Wildlife", "Premium"],
  },
  {
    id: "ACC004", name: "Wiyumiririe Farm Stay", category: "Accommodation", subcategory: "Farm Stay",
    location: "Rumuruti", ownerType: "Women Group", contact: "Juliet Gichuru", phone: "254717194081",
    priceRange: "KES 2,000–4,000", capacity: 6, rating: 4.3,
    description: "Agro-tourism homestay with authentic farm experience in rural Laikipia.",
    services: ["Farm Tours", "Meals", "Cycling"], payment: ["Mpesa", "Cash"],
    emoji: "🌾", tags: ["Cultural", "Women-owned"],
  },
  // TRANSPORT
  {
    id: "TRN001", name: "Laikipia Safari Vans", category: "Transport", subcategory: "Van Hire",
    location: "Nanyuki", ownerType: "Youth Owned", contact: "Timothy Muthamia", phone: "254706308361",
    priceRange: "KES 8,000–15,000", capacity: 7, rating: 4.5,
    description: "Tour vans for park and conservancy visits across Laikipia. Driver, fuel and guide included.",
    services: ["Driver", "Fuel", "Guide"], payment: ["Mpesa", "Cash"],
    emoji: "🚐", tags: ["Wildlife", "Youth"],
  },
  {
    id: "TRN002", name: "Boda Boda Laikipia Riders", category: "Transport", subcategory: "Boda Boda",
    location: "Nanyuki Town", ownerType: "Youth Group", contact: "Dan Mwika", phone: "254726636552",
    priceRange: "KES 200–800", capacity: 2, rating: 4.1,
    description: "Affordable short-distance rides around Nanyuki Town — quick, easy and community-supported.",
    services: ["Town Rides", "Delivery"], payment: ["Cash", "Mpesa"],
    emoji: "🏍️", tags: ["Budget-Friendly", "Youth"],
  },
  {
    id: "TRN003", name: "Ngare Ndare Shuttle", category: "Transport", subcategory: "Shuttle Service",
    location: "Nanyuki–Ngare Ndare", ownerType: "Community", contact: "Symchus Laith", phone: "254791388040",
    priceRange: "KES 500–1,500", capacity: 14, rating: 4.4,
    description: "Daily shuttle connecting Nanyuki to conservancies and the Ngare Ndare forest site.",
    services: ["Transfers", "Group Travel"], payment: ["Mpesa", "Cash"],
    emoji: "🚌", tags: ["Nature", "Budget-Friendly"],
  },
  {
    id: "TRN004", name: "Ol Pejeta Transfers", category: "Transport", subcategory: "Private Car",
    location: "Nanyuki", ownerType: "Local Business", contact: "Dan Ndegwa", phone: "254799041089",
    priceRange: "KES 3,000–7,000", capacity: 4, rating: 4.6,
    description: "Private car hire for conservancy visits with a knowledgeable local driver.",
    services: ["Driver", "Custom Trips"], payment: ["Mpesa", "Cash"],
    emoji: "🚗", tags: ["Wildlife", "Premium"],
  },
  // EATING FACILITIES
  {
    id: "FOD001", name: "Mama Naserian Kitchen", category: "Eating Facility", subcategory: "Local Restaurant",
    location: "Nanyuki Market", ownerType: "Women Owned", contact: "Anastacia Lesantanguny", phone: "254759647988",
    priceRange: "KES 300–800", capacity: 20, rating: 4.5,
    description: "Authentic Maasai and Swahili dishes prepared fresh daily. A true taste of Laikipia.",
    services: ["Takeaway", "Dine-in"], payment: ["Cash", "Mpesa"],
    emoji: "🍲", tags: ["Cultural", "Women-owned"],
  },
  {
    id: "FOD002", name: "Karibu Laikipia Grill", category: "Eating Facility", subcategory: "Grill & BBQ",
    location: "Nanyuki Town", ownerType: "Youth Owned", contact: "Muthaura Kevin", phone: "254714974036",
    priceRange: "KES 500–1,200", capacity: 25, rating: 4.3,
    description: "Local nyama choma and grilled meals in a lively open-air setting.",
    services: ["Dine-in", "Takeaway"], payment: ["Mpesa", "Cash"],
    emoji: "🔥", tags: ["Youth", "Budget-Friendly"],
  },
  {
    id: "FOD003", name: "Wanjiku's Farm Cafe", category: "Eating Facility", subcategory: "Organic Cafe",
    location: "Timau", ownerType: "Women Group", contact: "Juliet Gichuru", phone: "254717194081",
    priceRange: "KES 400–1,000", capacity: 15, rating: 4.6,
    description: "Organic farm-to-table meals sourced directly from the surrounding Timau farms.",
    services: ["Vegetarian", "Breakfast"], payment: ["Mpesa", "Cash"],
    emoji: "🥗", tags: ["Women-owned", "Organic"],
  },
  {
    id: "FOD004", name: "Samburu Boma Meals", category: "Eating Facility", subcategory: "Cultural Dining",
    location: "Laikipia North", ownerType: "Community", contact: "Kevin Kibui", phone: "254798208272",
    priceRange: "KES 600–1,500", capacity: 30, rating: 4.7,
    description: "Traditional meals served in a cultural boma setting — a complete community dining experience.",
    services: ["Cultural Experience", "Group Dining"], payment: ["Mpesa", "Cash"],
    emoji: "🫕", tags: ["Cultural", "Community"],
  },
];

// ── MARKETPLACE DATA ──────────────────────────────────────────
const marketplaceItems = [
  {
    id: 1, name: "Maasai Beaded Bracelet", price: 850, artisan: "Kevin Muthaura",
    phone: "254714974036", emoji: "📿", category: "Crafts",
    description: "Handcrafted using traditional Maasai beading techniques. Each piece is unique and made with genuine seed beads.",
  },
  {
    id: 2, name: "Hand-woven Kikoi Wrap", price: 1500, artisan: "Wamai Wairimu",
    phone: "254792098960", emoji: "🧣", category: "Textiles",
    description: "Vibrant, locally woven kikoi fabric from Laikipia. Perfect as a beach wrap, scarf or wall hanging.",
  },
  {
    id: 3, name: "Organic Laikipia Honey (500g)", price: 600, artisan: "Juliet Gichuru",
    phone: "254717194081", emoji: "🍯", category: "Food",
    description: "Pure raw honey harvested from wild beehives in Laikipia's indigenous forests. Unprocessed and naturally sweet.",
  },
  {
    id: 4, name: "Hand-carved Soapstone Bowl", price: 1200, artisan: "Laith Smychus",
    phone: "254791388040", emoji: "🪨", category: "Art",
    description: "Intricately carved soapstone bowl made by Laikipia craftsmen. A beautiful and functional piece of African art.",
  },
  {
    id: 5, name: "Samburu Leather Sandals", price: 2000, artisan: "Ken Obuya",
    phone: "254799295884", emoji: "👡", category: "Fashion",
    description: "Handstitched leather sandals in the traditional Samburu style. Durable, comfortable and authentically Kenyan.",
  },
  {
    id: 6, name: "Baobab Body Oil (100ml)", price: 750, artisan: "Kevin Muthaura",
    phone: "254714974036", emoji: "🌿", category: "Wellness",
    description: "Cold-pressed baobab seed oil sourced from Laikipia's ancient baobab trees. Nourishing for skin and hair.",
  },
];

// ── COMPUTED IMPACT STATS FROM REAL DATA ─────────────────────
function computeImpactStats() {
  const total = resourcesDirectory.length;
  const ownerTypes = resourcesDirectory.map(r => r.ownerType.toLowerCase());
  const womenCount = ownerTypes.filter(o => o.includes("women")).length;
  const youthCount = ownerTypes.filter(o => o.includes("youth")).length;
  const communityCount = ownerTypes.filter(o => o.includes("community")).length;
  const womenPct = Math.round((womenCount / total) * 100);
  const youthPct = Math.round((youthCount / total) * 100);
  const communityPct = Math.round((communityCount / total) * 100);
  return { total, womenCount, youthCount, communityCount, womenPct, youthPct, communityPct };
}

// ── STORAGE ───────────────────────────────────────────────────
function getReviews(expId) {
  try { return JSON.parse(localStorage.getItem(`reviews_${expId}`)) || []; }
  catch { return []; }
}
function saveReview(expId, review) {
  const reviews = getReviews(expId);
  reviews.unshift(review);
  localStorage.setItem(`reviews_${expId}`, JSON.stringify(reviews));
}
function getAverageRating(exp) {
  const reviews = getReviews(exp.id);
  if (!reviews.length) return exp.baseRating;
  const total = reviews.reduce((s, r) => s + r.stars, 0);
  return Math.round(((exp.baseRating * 10 + total) / (10 + reviews.length)) * 10) / 10;
}
function getTotalReviewCount(exp) { return getReviews(exp.id).length; }

// ── HELPERS ───────────────────────────────────────────────────
function buildWhatsAppLink(phone, experienceName, location) {
  const msg = `Hello, I'm interested in the ${experienceName} at ${location}. Please send me more details.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}
function buildReviewWhatsAppLink(guide, exp, stars, name, text) {
  const starEmojis = "★".repeat(stars) + "☆".repeat(5 - stars);
  const lines = [
    `🌍 *New Review — Tembea Laikipia*`, ``,
    `*Experience:* ${exp.name}`, `*Location:* ${exp.location}`,
    `*Rating:* ${starEmojis} (${stars}/5)`, `*Reviewer:* ${name}`,
    text ? `*Review:* "${text}"` : null, ``,
    `_Sent via Tembea Laikipia Platform_`,
  ].filter(l => l !== null).join("\n");
  return `https://wa.me/${guide.phone}?text=${encodeURIComponent(lines)}`;
}
function getInitials(name) { return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase(); }
function formatPhone(phone) {
  const s = phone.toString(), rest = s.substring(3);
  return `+${s.substring(0, 3)} ${rest.substring(0, 3)} ${rest.substring(3, 6)} ${rest.substring(6)}`;
}
function starsHTML(rating) {
  const full = Math.floor(rating), half = rating % 1 >= 0.5;
  return [1,2,3,4,5].map(i => {
    if (i <= full) return `<span class="star filled">★</span>`;
    if (i === full + 1 && half) return `<span class="star half">★</span>`;
    return `<span class="star empty">☆</span>`;
  }).join("");
}
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days < 7 ? `${days}d ago` : new Date(dateStr).toLocaleDateString("en-KE", { day:"numeric", month:"short", year:"numeric" });
}
function showToast(msg) {
  const t = document.getElementById("successToast");
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3500);
}
function ownerBadgeClass(ownerType) {
  const o = ownerType.toLowerCase();
  if (o.includes("women")) return "badge-women";
  if (o.includes("youth")) return "badge-youth";
  if (o.includes("community")) return "badge-community";
  return "badge-local";
}
function ownerBadgeLabel(ownerType) {
  const o = ownerType.toLowerCase();
  if (o.includes("women")) return "👩 Women-owned";
  if (o.includes("youth")) return "🧑 Youth-owned";
  if (o.includes("community")) return "🤝 Community";
  return "🏪 Local Business";
}

// ── EXPERIENCE CARDS ──────────────────────────────────────────
function renderReviewsPreview(expId) {
  const reviews = getReviews(expId).slice(0, 2);
  if (!reviews.length) return `<p class="no-reviews-msg">Be the first to share your experience!</p>`;
  return reviews.map(r => `
    <div class="review-item">
      <div class="review-item-header">
        <div class="review-avatar">${r.name ? r.name[0].toUpperCase() : "?"}</div>
        <div><div class="review-author">${r.name || "Anonymous"}</div><div class="review-stars-small">${starsHTML(r.stars)}</div></div>
        <span class="review-time">${timeAgo(r.date)}</span>
      </div>
      ${r.text ? `<p class="review-text">"${r.text}"</p>` : ""}
    </div>
  `).join("");
}

function renderCard(exp) {
  const waLink = buildWhatsAppLink(exp.guide.phone, exp.name, exp.location);
  const initials = getInitials(exp.guide.name);
  const displayPhone = formatPhone(exp.guide.phone);
  const priceDisplay = exp.price >= 1000 ? `KES ${exp.price.toLocaleString()}` : `KES ${exp.price}`;
  const avgRating = getAverageRating(exp);
  const reviewCount = getTotalReviewCount(exp);
  return `
    <article class="card" data-tags="${exp.tags.join(",")}" data-id="${exp.id}" style="animation-delay:${(exp.id-1)*0.08}s">
      <div class="card-img-wrap">
        <div class="card-img-placeholder">${exp.emoji}</div>
        <div class="card-category">${exp.category}</div>
        <div class="card-rating-badge">⭐ ${avgRating}</div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${exp.name}</h3>
        <div class="card-meta-row"><span class="card-location">📍 ${exp.location}</span><span class="card-duration">⏱ ${exp.duration}</span></div>
        <p class="card-desc">${exp.description}</p>
        <div class="card-price">${priceDisplay} <span>/ person</span></div>
        <div class="card-meta-pills">
          <span class="card-group-tag">${exp.groupBooking ? "✅ Group bookings" : "👤 Private only"}</span>
          <span class="carbon-tag">🌱 ${exp.carbon} kg CO₂</span>
        </div>
        <div class="review-summary-row">
          <div class="review-stars-display">${starsHTML(avgRating)}</div>
          <span class="review-count-label">${reviewCount > 0 ? `${reviewCount} review${reviewCount > 1 ? "s" : ""}` : "No reviews yet"}</span>
          <button class="write-review-btn" onclick="openReviewModal(${exp.id})">✍️ Review</button>
        </div>
        <div class="reviews-preview" id="preview-${exp.id}">${renderReviewsPreview(exp.id)}</div>
        <div class="card-actions">
          <button class="book-btn" onclick="openBookingModal(${exp.id})">📅 Book Now</button>
          <a class="whatsapp-btn" href="${waLink}" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
        </div>
        <div class="guide-section">
          <div class="guide-label">Your Local Guide</div>
          <div class="guide-info">
            <div class="guide-avatar">${initials}</div>
            <div class="guide-details"><div class="guide-name">${exp.guide.name}</div><div class="guide-phone">${displayPhone}</div></div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderCards(filter) {
  const grid = document.getElementById("cardsGrid");
  const filtered = filter === "all" ? experiences
    : experiences.filter(e => e.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));
  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state"><span>🌿</span><p>No experiences found. Try another filter!</p></div>`;
    return;
  }
  grid.innerHTML = filtered.map(renderCard).join("");
}

// ── TOURISM RESOURCES DIRECTORY ───────────────────────────────
let activeDirCat = "all";
let activeDirOwn = "all";

function renderDirectory() {
  const grid = document.getElementById("dirGrid");
  let filtered = resourcesDirectory;
  if (activeDirCat !== "all") filtered = filtered.filter(r => r.category === activeDirCat);
  if (activeDirOwn !== "all") filtered = filtered.filter(r => r.ownerType.toLowerCase().includes(activeDirOwn.toLowerCase()));
  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><span>🔍</span><p>No providers match this filter. Try another combination.</p></div>`;
    return;
  }
  grid.innerHTML = filtered.map(r => {
    const msg = `Hello, I found *${r.name}* on the Tembea Laikipia platform. I'm interested in ${r.subcategory} — ${r.priceRange}. Please send me more details.`;
    const waLink = `https://wa.me/${r.phone}?text=${encodeURIComponent(msg)}`;
    const servicesHtml = r.services.map(s => `<span class="service-tag">${s}</span>`).join("");
    const paymentHtml = r.payment.map(p => `<span class="payment-tag">${p}</span>`).join("");
    return `
      <div class="dir-card">
        <div class="dir-card-header">
          <div class="dir-emoji">${r.emoji}</div>
          <div class="dir-header-info">
            <div class="dir-subcategory">${r.subcategory}</div>
            <h4 class="dir-name">${r.name}</h4>
            <div class="dir-location">📍 ${r.location}</div>
          </div>
          <div class="dir-rating">⭐ ${r.rating}</div>
        </div>
        <p class="dir-desc">${r.description}</p>
        <div class="dir-services">${servicesHtml}</div>
        <div class="dir-footer">
          <div>
            <div class="dir-price">${r.priceRange}</div>
            <div class="dir-payment">${paymentHtml}</div>
          </div>
          <div class="dir-badges">
            <span class="owner-badge ${ownerBadgeClass(r.ownerType)}">${ownerBadgeLabel(r.ownerType)}</span>
          </div>
        </div>
        <div class="dir-contact">
          <div class="dir-contact-info">
            <div class="guide-avatar" style="width:30px;height:30px;font-size:12px">${getInitials(r.contact)}</div>
            <div><div class="guide-name" style="font-size:13px">${r.contact}</div><div class="guide-phone">${formatPhone(r.phone)}</div></div>
          </div>
          <a class="whatsapp-btn" href="${waLink}" target="_blank" rel="noopener noreferrer" style="font-size:11px;padding:8px 12px">
            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Contact
          </a>
        </div>
      </div>
    `;
  }).join("");
}

// ── IMPACT DASHBOARD ──────────────────────────────────────────
function renderImpact() {
  const stats = computeImpactStats();
  const impactData = [
    { icon: "🏘️", num: stats.total, label: "Tourism Providers in Directory", bar: 78, prefix: "", format: "" },
    { icon: "👩", num: stats.womenCount, label: `Women-owned Businesses (${stats.womenPct}%)`, bar: stats.womenPct, prefix: "", format: "" },
    { icon: "🧑", num: stats.youthCount, label: `Youth-owned Businesses (${stats.youthPct}%)`, bar: stats.youthPct, prefix: "", format: "" },
    { icon: "🤝", num: stats.communityCount, label: `Community-owned Enterprises (${stats.communityPct}%)`, bar: stats.communityPct, prefix: "", format: "" },
    { icon: "💰", num: 2100000, label: "Estimated Income Generated (KES)", bar: 55, prefix: "KES ", format: "money" },
    { icon: "🎓", num: 127, label: "TVET Students Placed", bar: 60, prefix: "", format: "" },
  ];
  document.getElementById("impactGrid").innerHTML = impactData.map(d => `
    <div class="impact-card">
      <div class="impact-icon">${d.icon}</div>
      <div class="impact-num" data-target="${d.num}" data-prefix="${d.prefix}" data-format="${d.format}">0</div>
      <div class="impact-label">${d.label}</div>
      <div class="impact-bar"><div class="impact-bar-fill" style="width:${d.bar}%"></div></div>
    </div>
  `).join("");

  // Ownership breakdown chart
  document.getElementById("ownershipBreakdown").innerHTML = `
    <div class="ownership-chart">
      <h4>Provider Ownership Breakdown</h4>
      <div class="ownership-bars">
        <div class="own-bar-row">
          <span class="own-bar-label">👩 Women-owned</span>
          <div class="own-bar-track"><div class="own-bar-fill own-women" style="width:${stats.womenPct}%"></div></div>
          <span class="own-bar-pct">${stats.womenPct}% (${stats.womenCount})</span>
        </div>
        <div class="own-bar-row">
          <span class="own-bar-label">🧑 Youth-owned</span>
          <div class="own-bar-track"><div class="own-bar-fill own-youth" style="width:${stats.youthPct}%"></div></div>
          <span class="own-bar-pct">${stats.youthPct}% (${stats.youthCount})</span>
        </div>
        <div class="own-bar-row">
          <span class="own-bar-label">🤝 Community</span>
          <div class="own-bar-track"><div class="own-bar-fill own-community" style="width:${stats.communityPct}%"></div></div>
          <span class="own-bar-pct">${stats.communityPct}% (${stats.communityCount})</span>
        </div>
      </div>
      <p class="ownership-note">💡 ${stats.womenPct + stats.youthPct + stats.communityPct}% of all providers are youth, women or community-owned — our system prioritises inclusive economic growth.</p>
    </div>
  `;
}

function animateCounters() {
  document.querySelectorAll(".impact-num[data-target]").forEach(el => {
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || "";
    const isMoney = el.dataset.format === "money";
    let current = 0;
    const increment = target / 80;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      if (isMoney) {
        el.textContent = prefix + (current >= 1000000 ? (current / 1000000).toFixed(1) + "M" : Math.floor(current).toLocaleString());
      } else {
        el.textContent = prefix + Math.floor(current).toLocaleString();
      }
      if (current >= target) clearInterval(timer);
    }, 20);
  });
}

function observeImpact() {
  const section = document.querySelector(".impact-section");
  if (!section) return;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); observer.disconnect(); }
  }, { threshold: 0.2 });
  observer.observe(section);
}

// ── MARKETPLACE ───────────────────────────────────────────────
let activeMktCat = "all";

function renderMarketplace() {
  const grid = document.getElementById("marketGrid");
  const filtered = activeMktCat === "all" ? marketplaceItems
    : marketplaceItems.filter(i => i.category === activeMktCat);
  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><span>🛒</span><p>No items in this category yet.</p></div>`;
    return;
  }
  grid.innerHTML = filtered.map(item => {
    const msg = `Hello! I saw *${item.name}* (KES ${item.price.toLocaleString()}) on the Tembea Laikipia Marketplace and I'd like to order. Please send me more details.`;
    const waLink = `https://wa.me/${item.phone}?text=${encodeURIComponent(msg)}`;
    return `
      <div class="market-card">
        <div class="market-emoji">${item.emoji}</div>
        <div class="market-body">
          <div class="market-category">${item.category}</div>
          <h4 class="market-name">${item.name}</h4>
          <p class="market-desc">${item.description}</p>
          <div class="market-artisan">🧑‍🎨 ${item.artisan} · Laikipia</div>
          <div class="market-price">KES ${item.price.toLocaleString()}</div>
          <a class="market-btn" href="${waLink}" target="_blank" rel="noopener noreferrer">🛒 Order via WhatsApp</a>
        </div>
      </div>
    `;
  }).join("");
}

// ── AI TRIP PLANNER (FULL: Stay + Food + Transport + Experiences) ──
function openPlannerModal() { openModal("plannerModal"); }

function generateItinerary() {
  const budget = parseInt(document.getElementById("planBudget").value);
  const days = parseInt(document.getElementById("planDays").value);
  const groupSize = parseInt(document.getElementById("planGroupSize").value) || 1;
  const ownerPref = document.getElementById("planOwnerPref").value;
  const interests = [...document.querySelectorAll(".interest-chips input:checked")].map(c => c.value);

  // ── Filter resources by budget and owner preference ──
  function filterResources(category, maxPrice) {
    return resourcesDirectory.filter(r => {
      const inCat = r.category === category;
      const priceMin = parseInt(r.priceRange.replace("KES ", "").split("–")[0].replace(/,/g, ""));
      const withinBudget = priceMin <= maxPrice;
      const ownerMatch = ownerPref === "any" || r.ownerType.toLowerCase().includes(ownerPref.toLowerCase());
      return inCat && withinBudget && ownerMatch;
    });
  }

  // Budget split: 40% accommodation, 30% food, 20% transport, 10% experiences
  const accBudget = budget * 0.4;
  const foodBudget = budget * 0.3;
  const trnBudget = budget * 0.2;
  const expBudget = budget * 0.1 * 10; // scale up for experience prices

  const accOptions = filterResources("Accommodation", accBudget);
  const foodOptions = filterResources("Eating Facility", foodBudget);
  const trnOptions = filterResources("Transport", trnBudget);

  // Filter experiences by budget and interest
  const expOptions = experiences.filter(exp => {
    const withinBudget = exp.price <= expBudget;
    const matchesInterest = interests.length === 0 || exp.tags.some(t => interests.includes(t));
    return withinBudget && matchesInterest;
  });

  // Pick best options (highest rated first)
  const sortByRating = arr => [...arr].sort((a, b) => b.rating - a.rating);
  const sortExpByRating = arr => [...arr].sort((a, b) => b.baseRating - a.baseRating);

  const chosenAcc = sortByRating(accOptions)[0];
  const chosenFood = sortByRating(foodOptions);
  const chosenTrn = sortByRating(trnOptions)[0];

  // Distribute experiences across days (up to 2/day)
  let expPool = sortExpByRating(expOptions);
  const dayPlans = [];
  for (let d = 1; d <= days; d++) {
    const dayExps = [];
    for (let i = 0; i < 2 && expPool.length > 0; i++) dayExps.push(expPool.shift());
    if (expPool.length === 0) expPool = sortExpByRating(expOptions); // refill
    dayPlans.push({ day: d, experiences: dayExps });
  }

  // ── Cost calculation ──
  const accCostPerNight = chosenAcc ? parseInt(chosenAcc.priceRange.replace("KES ", "").split("–")[0].replace(/,/g, "")) : 0;
  const foodCostPerDay = chosenFood.length ? parseInt(chosenFood[0].priceRange.replace("KES ", "").split("–")[0].replace(/,/g, "")) * 3 : 0;
  const trnCostPerDay = chosenTrn ? parseInt(chosenTrn.priceRange.replace("KES ", "").split("–")[0].replace(/,/g, "")) : 0;
  const expCostTotal = dayPlans.reduce((sum, d) => sum + d.experiences.reduce((s, e) => s + e.price, 0), 0);
  const totalCost = ((accCostPerNight * days) + (foodCostPerDay * days) + (trnCostPerDay * days) + expCostTotal) * groupSize;
  const totalCarbon = dayPlans.reduce((sum, d) => sum + d.experiences.reduce((s, e) => s + e.carbon, 0), 0);

  // ── Build itinerary HTML ──
  let html = `
    <div class="itinerary-header">
      <h4>Your ${days}-Day Laikipia Itinerary</h4>
      <div class="itinerary-meta">
        <span>👥 ${groupSize} person${groupSize > 1 ? "s" : ""}</span>
        <span>💰 Est. KES ${totalCost.toLocaleString()} total</span>
        <span>🌱 ${totalCarbon.toFixed(1)} kg CO₂</span>
        ${ownerPref !== "any" ? `<span class="itin-pref-badge">✅ ${ownerPref}-owned priority</span>` : ""}
      </div>
    </div>
  `;

  // STAY
  html += `<div class="itin-section-title">🏡 Recommended Stay</div>`;
  if (chosenAcc) {
    const waAcc = `https://wa.me/${chosenAcc.phone}?text=${encodeURIComponent(`Hello, I'd like to book ${chosenAcc.name} via Tembea Laikipia. Please send availability and details.`)}`;
    html += `
      <div class="itin-resource-card">
        <div class="itin-res-emoji">${chosenAcc.emoji}</div>
        <div class="itin-res-info">
          <div class="itin-res-name">${chosenAcc.name} <span class="owner-badge ${ownerBadgeClass(chosenAcc.ownerType)}" style="font-size:10px">${ownerBadgeLabel(chosenAcc.ownerType)}</span></div>
          <div class="itin-res-sub">📍 ${chosenAcc.location} · ${chosenAcc.priceRange}/night · ⭐ ${chosenAcc.rating}</div>
          <div class="itin-res-services">${chosenAcc.services.map(s => `<span class="service-tag">${s}</span>`).join("")}</div>
        </div>
        <a class="whatsapp-btn" href="${waAcc}" target="_blank" style="font-size:11px;padding:7px 11px;flex-shrink:0">
          <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Book
        </a>
      </div>`;
  } else {
    html += `<p class="no-reviews-msg">No accommodation matches your budget. Try increasing your daily budget.</p>`;
  }

  // TRANSPORT
  html += `<div class="itin-section-title">🚗 Recommended Transport</div>`;
  if (chosenTrn) {
    const waTrn = `https://wa.me/${chosenTrn.phone}?text=${encodeURIComponent(`Hello, I'd like to arrange transport via ${chosenTrn.name} through Tembea Laikipia. Please send details.`)}`;
    html += `
      <div class="itin-resource-card">
        <div class="itin-res-emoji">${chosenTrn.emoji}</div>
        <div class="itin-res-info">
          <div class="itin-res-name">${chosenTrn.name} <span class="owner-badge ${ownerBadgeClass(chosenTrn.ownerType)}" style="font-size:10px">${ownerBadgeLabel(chosenTrn.ownerType)}</span></div>
          <div class="itin-res-sub">📍 ${chosenTrn.location} · ${chosenTrn.priceRange}/day · ⭐ ${chosenTrn.rating}</div>
          <div class="itin-res-services">${chosenTrn.services.map(s => `<span class="service-tag">${s}</span>`).join("")}</div>
        </div>
        <a class="whatsapp-btn" href="${waTrn}" target="_blank" style="font-size:11px;padding:7px 11px;flex-shrink:0">
          <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Book
        </a>
      </div>`;
  } else {
    html += `<p class="no-reviews-msg">No transport matches your budget. Try increasing your daily budget.</p>`;
  }

  // FOOD
  html += `<div class="itin-section-title">🍽️ Recommended Dining</div>`;
  const foodToShow = chosenFood.slice(0, 2);
  if (foodToShow.length) {
    foodToShow.forEach(f => {
      const waFood = `https://wa.me/${f.phone}?text=${encodeURIComponent(`Hello, I found ${f.name} on Tembea Laikipia and I'd like to visit. Please share your menu or hours.`)}`;
      html += `
        <div class="itin-resource-card">
          <div class="itin-res-emoji">${f.emoji}</div>
          <div class="itin-res-info">
            <div class="itin-res-name">${f.name} <span class="owner-badge ${ownerBadgeClass(f.ownerType)}" style="font-size:10px">${ownerBadgeLabel(f.ownerType)}</span></div>
            <div class="itin-res-sub">📍 ${f.location} · ${f.priceRange}/meal · ⭐ ${f.rating}</div>
            <div class="itin-res-services">${f.services.map(s => `<span class="service-tag">${s}</span>`).join("")}</div>
          </div>
          <a class="whatsapp-btn" href="${waFood}" target="_blank" style="font-size:11px;padding:7px 11px;flex-shrink:0">
            <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Visit
          </a>
        </div>`;
    });
  } else {
    html += `<p class="no-reviews-msg">No dining options match your budget. Try increasing your daily budget.</p>`;
  }

  // DAY-BY-DAY ACTIVITIES
  html += `<div class="itin-section-title">🗓️ Day-by-Day Activities</div>`;
  dayPlans.forEach(({ day, experiences: dayExps }) => {
    html += `<div class="itin-day"><div class="itin-day-header">Day ${day}</div>`;
    if (!dayExps.length) {
      html += `<p class="no-reviews-msg">Free day — explore Laikipia at your own pace!</p>`;
    } else {
      dayExps.forEach((exp, idx) => {
        html += `
          <div class="itin-item">
            <div class="itin-time">${idx === 0 ? "🌅 Morning" : "🌄 Afternoon"}</div>
            <div class="itin-exp-emoji">${exp.emoji}</div>
            <div class="itin-exp-info">
              <div class="itin-exp-name">${exp.name}</div>
              <div class="itin-exp-loc">📍 ${exp.location}</div>
              <div class="itin-exp-meta">⏱ ${exp.duration} · KES ${exp.price.toLocaleString()}/person · ${exp.guide.name}</div>
            </div>
          </div>`;
      });
    }
    html += `</div>`;
  });

  // COST BREAKDOWN
  html += `
    <div class="itin-cost-breakdown">
      <h5>💰 Estimated Cost Breakdown (${groupSize} person${groupSize > 1 ? "s" : ""})</h5>
      <div class="cost-row"><span>🏡 Accommodation (${days} night${days > 1 ? "s" : ""})</span><span>KES ${(accCostPerNight * days * groupSize).toLocaleString()}</span></div>
      <div class="cost-row"><span>🍽️ Meals (${days} day${days > 1 ? "s" : ""})</span><span>KES ${(foodCostPerDay * days * groupSize).toLocaleString()}</span></div>
      <div class="cost-row"><span>🚗 Transport (${days} day${days > 1 ? "s" : ""})</span><span>KES ${(trnCostPerDay * days * groupSize).toLocaleString()}</span></div>
      <div class="cost-row"><span>🌿 Activities</span><span>KES ${(expCostTotal * groupSize).toLocaleString()}</span></div>
      <div class="cost-row cost-total"><span>TOTAL ESTIMATE</span><span>KES ${totalCost.toLocaleString()}</span></div>
    </div>
    <div class="itin-summary">
      <div class="itin-tip">💡 <strong>Tip:</strong> Book each provider directly via their WhatsApp button for the best rate and personalised service.</div>
      <div class="carbon-tracker">🌱 <strong>Carbon:</strong> ${totalCarbon.toFixed(1)} kg CO₂ for activities. Consider planting ${Math.ceil(totalCarbon / 5)} trees to offset your journey!</div>
    </div>
  `;

  document.getElementById("itineraryResult").innerHTML = html;
  document.getElementById("plannerStep1").hidden = true;
  document.getElementById("plannerStep2").hidden = false;
}

function downloadItinerary() {
  const content = document.getElementById("itineraryResult").innerText;
  const blob = new Blob([
    "TEMBEA LAIKIPIA — YOUR PERSONALISED ITINERARY\n" +
    "==============================================\n\n" + content +
    "\n\nGenerated by Tembea Laikipia Smart Tourism Platform\nwww.tembea-laikipia.netlify.app"
  ], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Tembea_Laikipia_Itinerary.txt";
  a.click();
  showToast("📄 Itinerary downloaded!");
}

// ── REVIEW MODAL ──────────────────────────────────────────────
let currentExpId = null, selectedStars = 0;

function openReviewModal(expId) {
  currentExpId = expId; selectedStars = 0;
  const exp = experiences.find(e => e.id === expId);
  document.getElementById("modalExpName").textContent = exp.name;
  document.getElementById("reviewName").value = "";
  document.getElementById("reviewText").value = "";
  document.getElementById("reviewError").textContent = "";
  document.querySelectorAll(".modal-star").forEach(s => { s.textContent = "☆"; s.classList.remove("active"); });
  openModal("reviewModal");
}

function submitReview() {
  const name = document.getElementById("reviewName").value.trim();
  const text = document.getElementById("reviewText").value.trim();
  const errorEl = document.getElementById("reviewError");
  if (!selectedStars) { errorEl.textContent = "Please select a star rating."; return; }
  if (!name) { errorEl.textContent = "Please enter your name."; return; }
  const review = { stars: selectedStars, name, text, date: new Date().toISOString() };
  saveReview(currentExpId, review);
  const exp = experiences.find(e => e.id === currentExpId);
  window.open(buildReviewWhatsAppLink(exp.guide, exp, selectedStars, name, text), "_blank", "noopener,noreferrer");
  const expId = exp.id;
  const previewEl = document.getElementById(`preview-${expId}`);
  if (previewEl) previewEl.innerHTML = renderReviewsPreview(expId);
  const card = document.querySelector(`.card[data-id="${expId}"]`);
  if (card) {
    const newAvg = getAverageRating(exp);
    const badge = card.querySelector(".card-rating-badge");
    if (badge) badge.textContent = `⭐ ${newAvg}`;
    const starsDisplay = card.querySelector(".review-stars-display");
    if (starsDisplay) starsDisplay.innerHTML = starsHTML(newAvg);
    const countLabel = card.querySelector(".review-count-label");
    const count = getTotalReviewCount(exp);
    if (countLabel) countLabel.textContent = `${count} review${count > 1 ? "s" : ""}`;
  }
  closeModal("reviewModal");
  showToast("✅ Review saved & sent to guide's WhatsApp!");
}

// ── BOOKING + M-PESA ──────────────────────────────────────────
let currentBookingExp = null, bookingStep = 1;

function openBookingModal(expId) {
  currentBookingExp = experiences.find(e => e.id === expId);
  bookingStep = 1;
  document.getElementById("bookingExpName").textContent = currentBookingExp.name;
  ["bookingName","bookingDate","bookingPhone","mpesaPhone"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  document.getElementById("bookingPeople").value = "1";
  document.getElementById("bookingError").textContent = "";
  document.getElementById("mpesaPayArea").hidden = true;
  document.getElementById("bookingNextBtn").textContent = "Proceed to Payment →";
  document.getElementById("bookingNextBtn").style.background = "var(--moss)";
  document.getElementById("bookingNextBtn").disabled = false;
  updateMpesaAmount();
  ["mstep1","mstep2","mstep3"].forEach((id,i) => document.getElementById(id).classList.toggle("active", i === 0));
  openModal("bookingModal");
}

function updateMpesaAmount() {
  if (!currentBookingExp) return;
  const people = parseInt(document.getElementById("bookingPeople")?.value) || 1;
  const total = currentBookingExp.price * people;
  document.getElementById("mpesaAmount").textContent = `Total: KES ${total.toLocaleString()} (${people} person${people > 1 ? "s" : ""})`;
}

function handleBookingNext() {
  const errorEl = document.getElementById("bookingError");
  if (bookingStep === 1) {
    const name = document.getElementById("bookingName").value.trim();
    const date = document.getElementById("bookingDate").value;
    const phone = document.getElementById("bookingPhone").value.trim();
    if (!name || !date || !phone) { errorEl.textContent = "Please fill in all required fields."; return; }
    errorEl.textContent = ""; bookingStep = 2;
    document.getElementById("mpesaPayArea").hidden = false;
    document.getElementById("bookingNextBtn").textContent = "🔐 Simulate STK Push";
    document.getElementById("mstep1").classList.remove("active");
    document.getElementById("mstep2").classList.add("active");
  } else if (bookingStep === 2) {
    const mpesaPhone = document.getElementById("mpesaPhone").value.trim();
    if (!mpesaPhone) { errorEl.textContent = "Please enter your M-Pesa number."; return; }
    errorEl.textContent = ""; bookingStep = 3;
    document.getElementById("bookingNextBtn").textContent = "⏳ Waiting for PIN...";
    document.getElementById("bookingNextBtn").disabled = true;
    document.getElementById("mstep2").classList.remove("active");
    document.getElementById("mstep3").classList.add("active");
    setTimeout(() => {
      document.getElementById("bookingNextBtn").textContent = "✅ Payment Confirmed!";
      document.getElementById("bookingNextBtn").style.background = "var(--whatsapp)";
      document.getElementById("bookingNextBtn").disabled = false;
      const name = document.getElementById("bookingName").value.trim();
      const date = document.getElementById("bookingDate").value;
      const people = document.getElementById("bookingPeople").value;
      const exp = currentBookingExp;
      const msg = [`✅ *New Booking — Tembea Laikipia*`, ``, `*Experience:* ${exp.name}`, `*Location:* ${exp.location}`, `*Tourist Name:* ${name}`, `*Date:* ${date}`, `*People:* ${people}`, `*Total Paid (M-Pesa Demo):* KES ${(exp.price * parseInt(people)).toLocaleString()}`, ``, `_Booking via Tembea Laikipia Platform_`].join("\n");
      window.open(`https://wa.me/${exp.guide.phone}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
      showToast("🎉 Booking confirmed! Guide notified via WhatsApp.");
      setTimeout(() => closeModal("bookingModal"), 2000);
    }, 2500);
  }
}

// ── MODAL HELPERS ─────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add("open"); document.body.style.overflow = "hidden"; }
function closeModal(id) { document.getElementById(id).classList.remove("open"); document.body.style.overflow = ""; }

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  renderCards("all");
  renderDirectory();
  renderImpact();
  observeImpact();
  renderMarketplace();

  // Experience filters
  document.querySelectorAll(".pill[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill[data-filter]").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      renderCards(btn.dataset.filter);
    });
  });

  // Directory category filters
  document.querySelectorAll(".pill[data-dircat]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill[data-dircat]").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      activeDirCat = btn.dataset.dircat;
      renderDirectory();
    });
  });

  // Directory ownership filters
  document.querySelectorAll(".pill[data-dirown]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill[data-dirown]").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      activeDirOwn = btn.dataset.dirown;
      renderDirectory();
    });
  });

  // Marketplace filters
  document.querySelectorAll(".pill[data-mktcat]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill[data-mktcat]").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      activeMktCat = btn.dataset.mktcat;
      renderMarketplace();
    });
  });

  // Navbar scroll shadow
  window.addEventListener("scroll", () => {
    document.getElementById("mainNav").style.boxShadow = window.scrollY > 10 ? "0 2px 20px rgba(45,31,15,0.1)" : "none";
  });

  // Review modal
  document.getElementById("reviewModal").addEventListener("click", e => { if (e.target === document.getElementById("reviewModal")) closeModal("reviewModal"); });
  document.getElementById("modalCloseBtn").addEventListener("click", () => closeModal("reviewModal"));
  document.getElementById("submitReviewBtn").addEventListener("click", submitReview);
  document.querySelectorAll(".modal-star").forEach(star => {
    star.addEventListener("mouseover", () => { const v = parseInt(star.dataset.val); document.querySelectorAll(".modal-star").forEach(s => { s.textContent = parseInt(s.dataset.val) <= v ? "★" : "☆"; s.classList.toggle("active", parseInt(s.dataset.val) <= v); }); });
    star.addEventListener("mouseleave", () => { document.querySelectorAll(".modal-star").forEach(s => { s.textContent = parseInt(s.dataset.val) <= selectedStars ? "★" : "☆"; s.classList.toggle("active", parseInt(s.dataset.val) <= selectedStars); }); });
    star.addEventListener("click", () => { selectedStars = parseInt(star.dataset.val); });
  });

  // Booking modal
  document.getElementById("bookingModal").addEventListener("click", e => { if (e.target === document.getElementById("bookingModal")) closeModal("bookingModal"); });
  document.getElementById("bookingCloseBtn").addEventListener("click", () => closeModal("bookingModal"));
  document.getElementById("bookingNextBtn").addEventListener("click", handleBookingNext);
  document.getElementById("bookingPeople").addEventListener("input", updateMpesaAmount);

  // Planner modal
  document.getElementById("plannerModal").addEventListener("click", e => { if (e.target === document.getElementById("plannerModal")) closeModal("plannerModal"); });
  document.getElementById("plannerCloseBtn").addEventListener("click", () => closeModal("plannerModal"));
  document.getElementById("generatePlanBtn").addEventListener("click", generateItinerary);
  document.getElementById("downloadItineraryBtn").addEventListener("click", downloadItinerary);
  document.getElementById("planAgainBtn").addEventListener("click", () => { document.getElementById("plannerStep1").hidden = false; document.getElementById("plannerStep2").hidden = true; });

  // ESC closes all modals
  document.addEventListener("keydown", e => { if (e.key === "Escape") ["reviewModal","bookingModal","plannerModal"].forEach(id => closeModal(id)); });

  // Service worker
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(console.warn);
});
