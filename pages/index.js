import { useState, useEffect } from 'react';
import Head from 'next/head';

import ExperienceCard from '../components/ExperienceCard';
import ResourceCard from '../components/ResourceCard';
import MarketplaceCard from '../components/MarketplaceCard';
import ExperienceDetailModal from '../components/ExperienceDetailModal';
import ResourceDetailModal from '../components/ResourceDetailModal';
import MarketplaceDetailModal from '../components/MarketplaceDetailModal';
import ReviewModal from '../components/ReviewModal';
import BookingModal from '../components/BookingModal';
import TripPlannerModal from '../components/TripPlannerModal';
import ImpactDashboard from '../components/ImpactDashboard';

import { getExperiences, getResources, getMarketplaceItems, getReviews } from '../lib/dataAccess';

// ============================================================
//  HOME PAGE
// ============================================================
export default function Home() {
  const [experiences, setExperiences] = useState([]);
  const [resourcesDirectory, setResourcesDirectory] = useState([]);
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  // Filters
  const [expFilter, setExpFilter] = useState('all');
  const [dirCat, setDirCat] = useState('all');
  const [dirOwn, setDirOwn] = useState('all');
  const [mktCat, setMktCat] = useState('all');

  // Modals
  const [detailExp, setDetailExp] = useState(null);
  const [detailResource, setDetailResource] = useState(null);
  const [detailMarketItem, setDetailMarketItem] = useState(null);
  const [reviewExp, setReviewExp] = useState(null);
  const [bookingExp, setBookingExp] = useState(null);
  const [plannerOpen, setPlannerOpen] = useState(false);

  // Reviews cache (experienceId -> array)
  const [reviewsCache, setReviewsCache] = useState({});

  // ── Initial data load ──
  useEffect(() => {
    async function load() {
      const [exps, res, mkt] = await Promise.all([
        getExperiences(),
        getResources(),
        getMarketplaceItems(),
      ]);
      setExperiences(exps);
      setResourcesDirectory(res);
      setMarketplaceItems(mkt);
      setDbConnected(!!process.env.NEXT_PUBLIC_SUPABASE_URL);
      setLoading(false);

      // Preload reviews for all experiences
      const cache = {};
      for (const exp of exps) {
        cache[exp.id] = await getReviews(exp.id);
      }
      setReviewsCache(cache);
    }
    load();
  }, []);

  // Navbar scroll shadow
  useEffect(() => {
    function onScroll() {
      const nav = document.getElementById('mainNav');
      if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(45,31,15,0.1)' : 'none';
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Helpers ──
  function getAvgRating(exp) {
    const reviews = reviewsCache[exp.id] || [];
    if (!reviews.length) return exp.baseRating;
    const total = reviews.reduce((s, r) => s + r.stars, 0);
    return Math.round(((exp.baseRating * 10 + total) / (10 + reviews.length)) * 10) / 10;
  }
  function getReviewCount(exp) { return (reviewsCache[exp.id] || []).length; }
  function getReviewsPreview(exp) { return (reviewsCache[exp.id] || []).slice(0, 5); }

  async function refreshReviews(expId) {
    const fresh = await getReviews(expId);
    setReviewsCache(prev => ({ ...prev, [expId]: fresh }));
  }

  // ── Filtered lists ──
  const filteredExperiences = expFilter === 'all'
    ? experiences
    : experiences.filter(e => e.tags.some(t => t.toLowerCase().includes(expFilter.toLowerCase())));

  const filteredResources = resourcesDirectory.filter(r => {
    const catOk = dirCat === 'all' || r.category === dirCat;
    const ownOk = dirOwn === 'all' || (r.ownerType || '').toLowerCase().includes(dirOwn.toLowerCase());
    return catOk && ownOk;
  });

  const filteredMarket = mktCat === 'all' ? marketplaceItems : marketplaceItems.filter(i => i.category === mktCat);

  return (
    <>
      <Head>
        <title>Tembea Laikipia — Smart Community Tourism</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="description" content="Smart community-based tourism platform for inclusive economic growth in Laikipia, Kenya." />
        <meta name="theme-color" content="#c8963e" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
      </Head>

      {/* Toasts */}
      <div className="success-toast" id="successToast"></div>

      {/* MODALS */}
      <ExperienceDetailModal
        experience={detailExp}
        onClose={() => setDetailExp(null)}
        onBook={(exp) => { setDetailExp(null); setBookingExp(exp); }}
        getAvgRating={getAvgRating}
        getReviewCount={getReviewCount}
        getReviewsPreview={getReviewsPreview}
      />
      <ResourceDetailModal resource={detailResource} onClose={() => setDetailResource(null)} />
      <MarketplaceDetailModal item={detailMarketItem} onClose={() => setDetailMarketItem(null)} />
      <ReviewModal
        experience={reviewExp}
        onClose={() => setReviewExp(null)}
        onSubmitted={() => { refreshReviews(reviewExp.id); }}
      />
      <BookingModal experience={bookingExp} onClose={() => setBookingExp(null)} />
      <TripPlannerModal
        open={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        experiences={experiences}
        resourcesDirectory={resourcesDirectory}
      />

      {/* NAVBAR */}
      <nav className="navbar" id="mainNav">
        <div className="nav-inner">
          <div className="nav-logo">
            <span className="logo-icon">🌍</span>
            <div>
              <div className="logo-title">Tembea Laikipia</div>
              <div className="logo-sub">Smart Community Tourism</div>
            </div>
          </div>
          <ul className="nav-links">
            <li><a href="#experiences">Experiences</a></li>
            <li><a href="#planner-section">Trip Planner</a></li>
            <li><a href="#impact">Impact</a></li>
            <li><a href="#resources">Directory</a></li>
            <li><a href="#tvet">TVET</a></li>
            <li><a href="#marketplace">Marketplace</a></li>
          </ul>
          <button className="nav-cta" onClick={() => setPlannerOpen(true)}>Plan My Trip ✨</button>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-badge">🏆 Smart Tourism System · Laikipia County, Kenya</div>
          <h1 className="hero-title">Wild.<br /><em>Authentic.</em><br />Unforgettable.</h1>
          <p className="hero-desc">A smart digital ecosystem connecting tourists with local Laikipia guides, accommodation, food and transport — driving youth employment, conservation and inclusive economic growth.</p>
          <div className="hero-ctas">
            <a href="#experiences" className="hero-btn">Explore Experiences</a>
            <button className="hero-btn hero-btn--outline" onClick={() => setPlannerOpen(true)}>✨ Plan My Trip</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat"><span className="stat-num">{experiences.length}</span><span className="stat-label">Experiences</span></div>
          <div className="stat"><span className="stat-num">{resourcesDirectory.length}</span><span className="stat-label">Local Providers</span></div>
          <div className="stat"><span className="stat-num">100%</span><span className="stat-label">Community-led</span></div>
          <div className="stat"><span className="stat-num">KES 2.1M</span><span className="stat-label">Income Generated</span></div>
        </div>
      </header>

      {/* AI PLANNER BANNER */}
      <section className="planner-banner" id="planner-section">
        <div className="planner-banner-inner">
          <div className="planner-banner-text">
            <span className="planner-banner-icon">🧠</span>
            <div>
              <h3>AI-Powered Full Trip Planner</h3>
              <p>Tell us your budget, interests and group size — we auto-select your stay, meals, transport and experiences in one personalised itinerary, with automatic payment splitting across every provider.</p>
            </div>
          </div>
          <button className="planner-banner-btn" onClick={() => setPlannerOpen(true)}>Plan My Trip →</button>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="filter-bar" id="experiences">
        <div className="filter-inner">
          <span className="filter-label">Filter by:</span>
          <div className="filter-pills">
            {['all', 'Wildlife', 'Adventure', 'Nature', 'Conservation'].map(f => (
              <button key={f} className={`pill ${expFilter === f ? 'active' : ''}`} onClick={() => setExpFilter(f)}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>
      </section>
      <main className="experiences-section">
        <div className="section-heading">
          <h2>Our Experiences</h2>
          <p>Book directly with your guide — no middleman, no markup. Click any experience for full details.</p>
        </div>
        {loading ? (
          <div className="loading-spinner"><div className="spinner-icon"></div><span>Loading experiences...</span></div>
        ) : (
          <div className="cards-grid">
            {filteredExperiences.length ? filteredExperiences.map(exp => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                avgRating={getAvgRating(exp)}
                reviewCount={getReviewCount(exp)}
                reviewsPreview={getReviewsPreview(exp)}
                onOpenDetail={setDetailExp}
                onBook={setBookingExp}
              />
            )) : (
              <div className="empty-state"><span>🌿</span><p>No experiences found. Try another filter!</p></div>
            )}
          </div>
        )}

        {/* Write review buttons (kept under cards grid for accessibility) */}
        {!loading && filteredExperiences.length > 0 && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 8 }}>Already been on one of these experiences?</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {filteredExperiences.map(exp => (
                <button key={exp.id} className="write-review-btn" onClick={() => setReviewExp(exp)}>
                  ✍️ Review {exp.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* TOURISM RESOURCES DIRECTORY */}
      <section className="resources-section" id="resources">
        <div className="resources-inner">
          <div className="section-heading">
            <div className="section-badge-dark">📋 Laikipia Tourism Resources Directory</div>
            <h2>Stay · Eat · Move</h2>
            <p>Browse all community-verified accommodation, food and transport providers in Laikipia. Click any listing for full details.</p>
          </div>
          <div className="dir-filters">
            <div className="dir-filter-group">
              <span className="filter-label">Category:</span>
              <div className="filter-pills">
                <button className={`pill ${dirCat === 'all' ? 'active' : ''}`} onClick={() => setDirCat('all')}>All</button>
                <button className={`pill ${dirCat === 'Accommodation' ? 'active' : ''}`} onClick={() => setDirCat('Accommodation')}>🏕️ Accommodation</button>
                <button className={`pill ${dirCat === 'Transport' ? 'active' : ''}`} onClick={() => setDirCat('Transport')}>🚗 Transport</button>
                <button className={`pill ${dirCat === 'Eating Facility' ? 'active' : ''}`} onClick={() => setDirCat('Eating Facility')}>🍽️ Food</button>
              </div>
            </div>
            <div className="dir-filter-group">
              <span className="filter-label">Ownership:</span>
              <div className="filter-pills">
                <button className={`pill ${dirOwn === 'all' ? 'active' : ''}`} onClick={() => setDirOwn('all')}>All</button>
                <button className={`pill ${dirOwn === 'Women' ? 'active' : ''}`} onClick={() => setDirOwn('Women')}>👩 Women-owned</button>
                <button className={`pill ${dirOwn === 'Youth' ? 'active' : ''}`} onClick={() => setDirOwn('Youth')}>🧑 Youth-owned</button>
                <button className={`pill ${dirOwn === 'Community' ? 'active' : ''}`} onClick={() => setDirOwn('Community')}>🤝 Community</button>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner-icon"></div><span>Loading directory...</span></div>
          ) : (
            <div className="dir-grid">
              {filteredResources.length ? filteredResources.map(r => (
                <ResourceCard key={r.id} resource={r} onOpenDetail={setDetailResource} />
              )) : (
                <div className="empty-state" style={{ gridColumn: '1/-1' }}><span>🔍</span><p>No providers match this filter. Try another combination.</p></div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* IMPACT DASHBOARD */}
      {!loading && <ImpactDashboard resourcesDirectory={resourcesDirectory} />}

      {/* TVET SECTION */}
      <section className="tvet-section" id="tvet">
        <div className="tvet-inner">
          <div className="section-heading">
            <div className="section-badge-dark">🎓 Skills Behind the Experience</div>
            <h2>Education → Skills → Income → Tourism</h2>
            <p>Every experience on this platform is powered by TVET-trained local talent.</p>
          </div>
          <div className="tvet-grid">
            <div className="tvet-card"><div className="tvet-emoji">🧭</div><h4>Tour Guiding Trainees</h4><p>Trainees from Laikipia-based TVET colleges trained in wildlife interpretation, safety and customer experience.</p><div className="tvet-stat">34 active trainees</div></div>
            <div className="tvet-card"><div className="tvet-emoji">🍽️</div><h4>Hospitality Students</h4><p>Catering and accommodation management students providing world-class service at community lodges and campsites.</p><div className="tvet-stat">58 active trainees</div></div>
            <div className="tvet-card"><div className="tvet-emoji">🎨</div><h4>Local Artisans</h4><p>Maasai and Samburu craftspeople trained in product packaging, pricing and digital selling for the tourism marketplace.</p><div className="tvet-stat">41 artisans onboarded</div></div>
            <div className="tvet-card"><div className="tvet-emoji">💻</div><h4>Digital Skills Trainees</h4><p>Youth trained in web design, social media marketing and digital bookings to manage and grow the platform locally.</p><div className="tvet-stat">22 digital trainees</div></div>
          </div>
          <div className="tvet-cta">
            <p>Are you a TVET student or institution in Laikipia?</p>
            <a className="hero-btn" href="https://wa.me/254714974036?text=Hello%2C%20I%20am%20interested%20in%20joining%20the%20Tembea%20Laikipia%20TVET%20programme.%20Please%20send%20me%20more%20details." target="_blank" rel="noopener noreferrer">Join the Programme →</a>
          </div>
        </div>
      </section>

      {/* MARKETPLACE */}
      <section className="marketplace-section" id="marketplace">
        <div className="marketplace-inner">
          <div className="section-heading">
            <div className="section-badge-dark">🤝 Local Marketplace</div>
            <h2>Take Laikipia Home With You</h2>
            <p>Authentic crafts, produce and cultural products made by Laikipia communities. Click any item to preview its automatic payment split.</p>
          </div>
          <div className="dir-filters">
            <div className="dir-filter-group">
              <span className="filter-label">Category:</span>
              <div className="filter-pills">
                {['all', 'Crafts', 'Textiles', 'Food', 'Art', 'Wellness'].map(c => (
                  <button key={c} className={`pill ${mktCat === c ? 'active' : ''}`} onClick={() => setMktCat(c)}>
                    {{ all: 'All', Crafts: '📿 Crafts', Textiles: '🧣 Textiles', Food: '🍯 Food', Art: '🪨 Art', Wellness: '🌿 Wellness' }[c]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner-icon"></div><span>Loading marketplace...</span></div>
          ) : (
            <div className="market-grid">
              {filteredMarket.length ? filteredMarket.map(item => (
                <MarketplaceCard key={item.id} item={item} onOpenDetail={setDetailMarketItem} />
              )) : (
                <div className="empty-state" style={{ gridColumn: '1/-1' }}><span>🛒</span><p>No items in this category yet.</p></div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" id="about">
        <div className="hiw-inner">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step"><div className="step-icon">🔍</div><h3>Browse</h3><p>Explore curated experiences and the full tourism directory.</p></div>
            <div className="step-arrow">→</div>
            <div className="step"><div className="step-icon">🧠</div><h3>Plan</h3><p>Use the AI Trip Planner to auto-generate a full itinerary with stay, food and transport.</p></div>
            <div className="step-arrow">→</div>
            <div className="step"><div className="step-icon">💳</div><h3>Book & Pay</h3><p>Book directly with the provider and pay via M-Pesa — fast and secure.</p></div>
            <div className="step-arrow">→</div>
            <div className="step"><div className="step-icon">💸</div><h3>Auto-Split</h3><p>Your payment is automatically divided among every provider — no central wallet.</p></div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contact">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">🌍 Tembea Laikipia</div>
            <p>A smart digital ecosystem for community-based tourism and TVET-driven economic empowerment in Laikipia County, Kenya.</p>
            <div className="footer-sdgs"><span>🎯 SDG 8</span><span>🌍 SDG 13</span><span>🌿 SDG 15</span></div>
          </div>
          <div className="footer-links">
            <h4>Platform</h4>
            <a href="#experiences">Experiences</a>
            <a href="#planner-section">Trip Planner</a>
            <a href="#resources">Directory</a>
            <a href="#impact">Impact Dashboard</a>
            <a href="#tvet">TVET Skills</a>
            <a href="#marketplace">Marketplace</a>
          </div>
          <div className="footer-links">
            <h4>Contact</h4>
            <a href="mailto:info@tembealaikpia.co.ke">info@tembealaikpia.co.ke</a>
            <a href="https://wa.me/254714974036?text=Hello%2C%20I%20would%20like%20to%20get%20in%20touch%20with%20Tembea%20Laikipia." target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
            <p style={{ color: 'rgba(248,242,232,0.35)', fontSize: 13, marginTop: 8 }}>Laikipia County, Kenya</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Tembea Laikipia · Smart Community Tourism Platform · All rights reserved.</p>
        </div>
      </footer>

      {/* DB connection status badge (visible to help non-technical owner verify setup) */}
      <div className="db-status-badge">
        <span className={`db-status-dot ${dbConnected ? 'connected' : 'demo'}`}></span>
        {dbConnected ? 'Database connected' : 'Demo mode (no database connected)'}
      </div>
    </>
  );
}
