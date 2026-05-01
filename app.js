// ============================================================
//  TEMBEA LAIKIPIA — Smart Community Tourism System
//  app.js · Full feature implementation
// ============================================================

// ── DATA ────────────────────────────────────────────────────

const experiences = [
  {
    id: 1,
    name: "Chimpanzee Trekking",
    category: "Wildlife / Conservation",
    location: "Sweetwaters Chimpanzee Sanctuary, Ol Pejeta",
    price: 13000,
    description: "The only place in Kenya to see rescued chimpanzees in a natural forest habitat — an extraordinary and rare encounter.",
    groupBooking: true,
    guide: { name: "Muthaura Kevin", phone: "254714974036" },
    baseRating: 4.5,
    emoji: "🦍",
    tags: ["Wildlife", "Conservation"],
    duration: "3 hours",
    carbon: 2.1,
  },
  {
    id: 2,
    name: "Rhino Tracking",
    category: "Wildlife / Adventure",
    location: "Ol Pejeta Conservancy, Laikipia",
    price: 10000,
    description: "A walking or vehicle-based safari to see the world's last Northern White Rhinos — critically endangered and awe-inspiring.",
    groupBooking: true,
    guide: { name: "Wairimu Wamai", phone: "254792098960" },
    baseRating: 4.7,
    emoji: "🦏",
    tags: ["Wildlife", "Adventure"],
    duration: "4 hours",
    carbon: 1.8,
  },
  {
    id: 3,
    name: "Night Game Drives",
    category: "Adventure / Wildlife",
    location: "Loisaba Conservancy, Laikipia",
    price: 10000,
    description: "Experience the African bush after dark. Spot nocturnal predators like lions, leopards, and genets under a canopy of stars.",
    groupBooking: false,
    guide: { name: "Gichuru Juliet", phone: "254717194081" },
    baseRating: 4.6,
    emoji: "🌙",
    tags: ["Wildlife", "Adventure"],
    duration: "3 hours",
    carbon: 1.5,
  },
  {
    id: 4,
    name: "Canopy Walk",
    category: "Nature / Adventure",
    location: "Ngare Ndare Forest, Laikipia",
    price: 3000,
    description: "A breathtaking 450-metre bridge suspended 10 metres high through an ancient indigenous forest canopy — pure magic.",
    groupBooking: true,
    guide: { name: "Smychus Laith", phone: "254791388040" },
    baseRating: 4.8,
    emoji: "🌿",
    tags: ["Nature", "Adventure"],
    duration: "2 hours",
    carbon: 0.3,
  },
  {
    id: 5,
    name: "Horseback Safaris",
    category: "Adventure / Sports",
    location: "Borana Lodge & Conservancy, Laikipia",
    price: 100,
    description: "Ride silently alongside giraffes and zebras for a unique, intimate safari experience that no vehicle can replicate.",
    groupBooking: true,
    guide: { name: "Ken Obuya", phone: "254799295884" },
    baseRating: 4.8,
    emoji: "🐎",
    tags: ["Adventure"],
    duration: "2 hours",
    carbon: 0.1,
  },
];

const marketplaceItems = [
  { id: 1, name: "Maasai Beaded Bracelet", price: 850, artisan: "Naserian Sankale", emoji: "📿", category: "Crafts" },
  { id: 2, name: "Hand-woven Kikoi", price: 1500, artisan: "Wanjiku Mwangi", emoji: "🧣", category: "Textiles" },
  { id: 3, name: "Organic Laikipia Honey", price: 600, artisan: "Kamau Njoroge", emoji: "🍯", category: "Food" },
  { id: 4, name: "Carved Soapstone Bowl", price: 1200, artisan: "Ochieng Otieno", emoji: "🪨", category: "Art" },
  { id: 5, name: "Samburu Leather Sandals", price: 2000, artisan: "Lketinga Leparmarai", emoji: "👡", category: "Fashion" },
  { id: 6, name: "Baobab Body Oil (100ml)", price: 750, artisan: "Fatuma Hassan", emoji: "🌿", category: "Wellness" },
];

// ── STORAGE ─────────────────────────────────────────────────

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

// ── HELPERS ─────────────────────────────────────────────────

function buildWhatsAppLink(phone, experienceName, location) {
  const msg = `Hello, I'm interested in the ${experienceName} at ${location}. Please send me more details.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

function buildReviewWhatsAppLink(guide, exp, stars, name, text) {
  const starEmojis = "★".repeat(stars) + "☆".repeat(5 - stars);
  const lines = [
    `🌍 *New Review — Tembea Laikipia*`, ``,
    `*Experience:* ${exp.name}`,
    `*Location:* ${exp.location}`,
    `*Rating:* ${starEmojis} (${stars}/5)`,
    `*Reviewer:* ${name}`,
    text ? `*Review:* "${text}"` : null, ``,
    `_Sent via Tembea Laikipia Platform_`,
  ].filter(l => l !== null).join("\n");
  return `https://wa.me/${guide.phone}?text=${encodeURIComponent(lines)}`;
}

function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
}

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
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-KE", { day:"numeric", month:"short", year:"numeric" });
}

function showToast(msg) {
  const t = document.getElementById("successToast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3500);
}

// ── CARD RENDERER ───────────────────────────────────────────

function renderReviewsPreview(expId) {
  const reviews = getReviews(expId).slice(0, 2);
  if (!reviews.length) return `<p class="no-reviews-msg">Be the first to share your experience!</p>`;
  return reviews.map(r => `
    <div class="review-item">
      <div class="review-item-header">
        <div class="review-avatar">${r.name ? r.name[0].toUpperCase() : "?"}</div>
        <div>
          <div class="review-author">${r.name || "Anonymous"}</div>
          <div class="review-stars-small">${starsHTML(r.stars)}</div>
        </div>
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
        <div class="card-meta-row">
          <span class="card-location">📍 ${exp.location}</span>
          <span class="card-duration">⏱ ${exp.duration}</span>
        </div>
        <p class="card-desc">${exp.description}</p>
        <div class="card-price">${priceDisplay} <span>/ person</span></div>
        <div class="card-meta-pills">
          <span class="card-group-tag">${exp.groupBooking ? "✅ Group bookings" : "👤 Private only"}</span>
          <span class="carbon-tag">🌱 ${exp.carbon} kg CO₂</span>
        </div>

        <!-- Review Summary -->
        <div class="review-summary-row">
          <div class="review-stars-display">${starsHTML(avgRating)}</div>
          <span class="review-count-label">${reviewCount > 0 ? `${reviewCount} review${reviewCount > 1 ? "s" : ""}` : "No reviews yet"}</span>
          <button class="write-review-btn" onclick="openReviewModal(${exp.id})">✍️ Review</button>
        </div>

        <!-- Reviews Preview -->
        <div class="reviews-preview" id="preview-${exp.id}">${renderReviewsPreview(exp.id)}</div>

        <!-- Actions -->
        <div class="card-actions">
          <button class="book-btn" onclick="openBookingModal(${exp.id})">📅 Book Now</button>
          <a class="whatsapp-btn" href="${waLink}" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
        </div>

        <!-- Guide Info -->
        <div class="guide-section">
          <div class="guide-label">Your Local Guide</div>
          <div class="guide-info">
            <div class="guide-avatar">${initials}</div>
            <div class="guide-details">
              <div class="guide-name">${exp.guide.name}</div>
              <div class="guide-phone">${displayPhone}</div>
            </div>
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

// ── MARKETPLACE ─────────────────────────────────────────────

function renderMarketplace() {
  const grid = document.getElementById("marketGrid");
  grid.innerHTML = marketplaceItems.map(item => `
    <div class="market-card">
      <div class="market-emoji">${item.emoji}</div>
      <div class="market-body">
        <div class="market-category">${item.category}</div>
        <h4 class="market-name">${item.name}</h4>
        <div class="market-artisan">by ${item.artisan}</div>
        <div class="market-price">KES ${item.price.toLocaleString()}</div>
        <a class="market-btn"
          href="https://wa.me/254700000000?text=${encodeURIComponent(`Hello, I'd like to order: ${item.name} (KES ${item.price}) by ${item.artisan}. Please send me details.`)}"
          target="_blank" rel="noopener">
          🛒 Order via WhatsApp
        </a>
      </div>
    </div>
  `).join("");
}

// ── REVIEW MODAL ────────────────────────────────────────────

let currentExpId = null;
let selectedStars = 0;

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

// ── BOOKING + M-PESA DEMO ───────────────────────────────────

let currentBookingExp = null;
let bookingStep = 1;

function openBookingModal(expId) {
  currentBookingExp = experiences.find(e => e.id === expId);
  bookingStep = 1;
  document.getElementById("bookingExpName").textContent = currentBookingExp.name;
  document.getElementById("bookingName").value = "";
  document.getElementById("bookingDate").value = "";
  document.getElementById("bookingPeople").value = "1";
  document.getElementById("bookingPhone").value = "";
  document.getElementById("mpesaPhone").value = "";
  document.getElementById("bookingError").textContent = "";
  document.getElementById("mpesaPayArea").hidden = true;
  document.getElementById("bookingNextBtn").textContent = "Proceed to Payment →";
  document.getElementById("bookingNextBtn").style.background = "var(--moss)";
  updateMpesaAmount();
  ["mstep1","mstep2","mstep3"].forEach((id,i) => {
    document.getElementById(id).classList.toggle("active", i === 0);
  });
  openModal("bookingModal");
}

function updateMpesaAmount() {
  if (!currentBookingExp) return;
  const people = parseInt(document.getElementById("bookingPeople")?.value) || 1;
  const total = currentBookingExp.price * people;
  document.getElementById("mpesaAmount").textContent =
    `Total: KES ${total.toLocaleString()} (${people} person${people > 1 ? "s" : ""})`;
}

function handleBookingNext() {
  const errorEl = document.getElementById("bookingError");
  if (bookingStep === 1) {
    const name = document.getElementById("bookingName").value.trim();
    const date = document.getElementById("bookingDate").value;
    const phone = document.getElementById("bookingPhone").value.trim();
    if (!name || !date || !phone) { errorEl.textContent = "Please fill in all required fields."; return; }
    errorEl.textContent = "";
    bookingStep = 2;
    document.getElementById("mpesaPayArea").hidden = false;
    document.getElementById("bookingNextBtn").textContent = "🔐 Simulate STK Push";
    document.getElementById("mstep1").classList.remove("active");
    document.getElementById("mstep2").classList.add("active");
  } else if (bookingStep === 2) {
    const mpesaPhone = document.getElementById("mpesaPhone").value.trim();
    if (!mpesaPhone) { errorEl.textContent = "Please enter your M-Pesa number."; return; }
    errorEl.textContent = "";
    bookingStep = 3;
    document.getElementById("bookingNextBtn").textContent = "⏳ Waiting for PIN...";
    document.getElementById("bookingNextBtn").disabled = true;
    document.getElementById("mstep2").classList.remove("active");
    document.getElementById("mstep3").classList.add("active");
    setTimeout(() => {
      document.getElementById("bookingNextBtn").textContent = "✅ Payment Confirmed!";
      document.getElementById("bookingNextBtn").style.background = "var(--whatsapp)";
      document.getElementById("bookingNextBtn").disabled = false;
      // Send booking confirmation via WhatsApp
      const name = document.getElementById("bookingName").value.trim();
      const date = document.getElementById("bookingDate").value;
      const people = document.getElementById("bookingPeople").value;
      const exp = currentBookingExp;
      const msg = [
        `✅ *New Booking — Tembea Laikipia*`, ``,
        `*Experience:* ${exp.name}`,
        `*Location:* ${exp.location}`,
        `*Tourist Name:* ${name}`,
        `*Date:* ${date}`,
        `*People:* ${people}`,
        `*Total Paid (M-Pesa Demo):* KES ${(exp.price * parseInt(people)).toLocaleString()}`,
        ``, `_Booking via Tembea Laikipia Platform_`,
      ].join("\n");
      window.open(`https://wa.me/${exp.guide.phone}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
      showToast("🎉 Booking confirmed! Guide notified via WhatsApp.");
      setTimeout(() => closeModal("bookingModal"), 2000);
    }, 2500);
  }
}

// ── AI TRIP PLANNER ─────────────────────────────────────────

function openPlannerModal() { openModal("plannerModal"); }

function generateItinerary() {
  const budget = parseInt(document.getElementById("planBudget").value);
  const days = parseInt(document.getElementById("planDays").value);
  const groupSize = parseInt(document.getElementById("planGroupSize").value) || 1;
  const interests = [...document.querySelectorAll(".interest-chips input:checked")].map(c => c.value);

  // Filter matching experiences by budget and interest
  const matching = experiences.filter(exp => {
    const withinBudget = exp.price <= budget;
    const matchesInterest = interests.length === 0 || exp.tags.some(t => interests.includes(t));
    return withinBudget && matchesInterest;
  });

  // Distribute across days
  const itinerary = [];
  let pool = [...matching];
  for (let d = 1; d <= days; d++) {
    const dayExps = [];
    // pick up to 2 experiences per day
    for (let i = 0; i < 2 && pool.length > 0; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      dayExps.push(pool.splice(idx, 1)[0]);
    }
    // If pool is exhausted, refill
    if (pool.length === 0) pool = [...matching];
    itinerary.push({ day: d, experiences: dayExps });
  }

  const totalCost = itinerary.reduce((sum, d) => sum + d.experiences.reduce((s, e) => s + e.price, 0), 0) * groupSize;
  const totalCarbon = itinerary.reduce((sum, d) => sum + d.experiences.reduce((s, e) => s + e.carbon, 0), 0);

  let html = `
    <div class="itinerary-header">
      <h4>Your ${days}-Day Laikipia Itinerary</h4>
      <div class="itinerary-meta">
        <span>👥 ${groupSize} person${groupSize > 1 ? "s" : ""}</span>
        <span>💰 Est. KES ${totalCost.toLocaleString()}</span>
        <span>🌱 ${totalCarbon.toFixed(1)} kg CO₂</span>
      </div>
    </div>
  `;

  if (matching.length === 0) {
    html += `<p class="no-reviews-msg" style="text-align:center;padding:20px">No experiences match your filters. Try a higher budget or different interests.</p>`;
  } else {
    itinerary.forEach(({ day, experiences: dayExps }) => {
      html += `<div class="itin-day"><div class="itin-day-header">Day ${day}</div>`;
      if (dayExps.length === 0) {
        html += `<p class="no-reviews-msg">Free day — explore at your own pace!</p>`;
      } else {
        dayExps.forEach((exp, idx) => {
          const timeSlot = idx === 0 ? "🌅 Morning" : "🌄 Afternoon";
          html += `
            <div class="itin-item">
              <div class="itin-time">${timeSlot}</div>
              <div class="itin-exp-emoji">${exp.emoji}</div>
              <div class="itin-exp-info">
                <div class="itin-exp-name">${exp.name}</div>
                <div class="itin-exp-loc">📍 ${exp.location}</div>
                <div class="itin-exp-meta">⏱ ${exp.duration} · KES ${exp.price.toLocaleString()}/person · Guide: ${exp.guide.name}</div>
              </div>
            </div>
          `;
        });
      }
      html += `</div>`;
    });

    html += `
      <div class="itin-summary">
        <div class="itin-tip">💡 <strong>Tip:</strong> Book each experience directly with the guide via WhatsApp for the best rate.</div>
        <div class="carbon-tracker">
          🌱 <strong>Carbon footprint:</strong> ${totalCarbon.toFixed(1)} kg CO₂ for this trip.
          Consider planting ${Math.ceil(totalCarbon / 5)} trees to offset your journey!
        </div>
      </div>
    `;
  }

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

// ── IMPACT COUNTERS ─────────────────────────────────────────

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
        el.textContent = prefix + (current >= 1000000
          ? (current / 1000000).toFixed(1) + "M"
          : Math.floor(current).toLocaleString());
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
  }, { threshold: 0.3 });
  observer.observe(section);
}

// ── MODAL HELPERS ───────────────────────────────────────────

function openModal(id) {
  document.getElementById(id).classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
  document.body.style.overflow = "";
}

// ── INIT ────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  renderCards("all");
  renderMarketplace();
  observeImpact();

  // Filter pills
  document.querySelectorAll(".pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      renderCards(btn.dataset.filter);
    });
  });

  // Navbar scroll shadow
  window.addEventListener("scroll", () => {
    document.getElementById("mainNav").style.boxShadow =
      window.scrollY > 10 ? "0 2px 20px rgba(45,31,15,0.1)" : "none";
  });

  // Review modal events
  document.getElementById("reviewModal").addEventListener("click", e => {
    if (e.target === document.getElementById("reviewModal")) closeModal("reviewModal");
  });
  document.getElementById("modalCloseBtn").addEventListener("click", () => closeModal("reviewModal"));
  document.getElementById("submitReviewBtn").addEventListener("click", submitReview);
  document.querySelectorAll(".modal-star").forEach(star => {
    star.addEventListener("mouseover", () => {
      const val = parseInt(star.dataset.val);
      document.querySelectorAll(".modal-star").forEach(s => {
        s.textContent = parseInt(s.dataset.val) <= val ? "★" : "☆";
        s.classList.toggle("active", parseInt(s.dataset.val) <= val);
      });
    });
    star.addEventListener("mouseleave", () => {
      document.querySelectorAll(".modal-star").forEach(s => {
        s.textContent = parseInt(s.dataset.val) <= selectedStars ? "★" : "☆";
        s.classList.toggle("active", parseInt(s.dataset.val) <= selectedStars);
      });
    });
    star.addEventListener("click", () => {
      selectedStars = parseInt(star.dataset.val);
    });
  });

  // Booking modal events
  document.getElementById("bookingModal").addEventListener("click", e => {
    if (e.target === document.getElementById("bookingModal")) closeModal("bookingModal");
  });
  document.getElementById("bookingCloseBtn").addEventListener("click", () => closeModal("bookingModal"));
  document.getElementById("bookingNextBtn").addEventListener("click", handleBookingNext);
  document.getElementById("bookingPeople").addEventListener("input", updateMpesaAmount);

  // Planner modal events
  document.getElementById("plannerModal").addEventListener("click", e => {
    if (e.target === document.getElementById("plannerModal")) closeModal("plannerModal");
  });
  document.getElementById("plannerCloseBtn").addEventListener("click", () => closeModal("plannerModal"));
  document.getElementById("generatePlanBtn").addEventListener("click", generateItinerary);
  document.getElementById("downloadItineraryBtn").addEventListener("click", downloadItinerary);
  document.getElementById("planAgainBtn").addEventListener("click", () => {
    document.getElementById("plannerStep1").hidden = false;
    document.getElementById("plannerStep2").hidden = true;
  });

  // ESC key closes all modals
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      ["reviewModal","bookingModal","plannerModal"].forEach(id => closeModal(id));
    }
  });

  // Service worker registration
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(console.warn);
  }
});
