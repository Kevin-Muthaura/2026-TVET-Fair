import WhatsAppIcon from './WhatsAppIcon';
import { buildWhatsAppLink, formatPhone, ownerBadgeClass, ownerBadgeLabel } from '../lib/utils';

// ============================================================
//  ResourceDetailModal
//  Opens when a tourist clicks an accommodation, transport or
//  food provider card to see full information.
// ============================================================
export default function ResourceDetailModal({ resource, onClose }) {
  if (!resource) return null;

  const r = resource;
  const waLink = buildWhatsAppLink(
    r.phone,
    `Hello, I found *${r.name}* on the Tembea Laikipia platform. I'm interested in ${r.subcategory} — ${r.priceRange || r.price_range}. Please send me more details.`
  );

  return (
    <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="detail-modal-box">
        <div className="detail-hero">
          <button className="detail-close" onClick={onClose} aria-label="Close">✕</button>
          <span className="detail-hero-emoji">{r.emoji}</span>
          <div className="detail-hero-category">{r.subcategory} · {r.category}</div>
          <h2>{r.name}</h2>
          <div className="detail-hero-meta">
            <span>📍 {r.location}</span>
            <span>⭐ {r.rating}</span>
            <span>👥 Capacity {r.capacity}</span>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h4>About</h4>
            <p>{r.longDescription || r.description}</p>
          </div>

          {r.amenities && r.amenities.length > 0 && (
            <div className="detail-section">
              <h4>Amenities &amp; Highlights</h4>
              <div className="detail-tags">
                {r.amenities.map((a, i) => <span className="detail-tag" key={i}>✓ {a}</span>)}
              </div>
            </div>
          )}

          {r.services && r.services.length > 0 && (
            <div className="detail-section">
              <h4>Services Offered</h4>
              <div className="detail-tags">
                {r.services.map((s, i) => <span className="service-tag" key={i}>{s}</span>)}
              </div>
            </div>
          )}

          <div className="detail-section">
            <div className="detail-info-grid">
              <div className="detail-info-item">
                <div className="detail-info-label">Price Range</div>
                <div className="detail-info-value">{r.priceRange || r.price_range}</div>
              </div>
              <div className="detail-info-item">
                <div className="detail-info-label">Payment Methods</div>
                <div className="detail-info-value">{(r.paymentMethods || r.payment_methods || []).join(', ')}</div>
              </div>
              <div className="detail-info-item">
                <div className="detail-info-label">Ownership</div>
                <div className="detail-info-value">
                  <span className={`owner-badge ${ownerBadgeClass(r.ownerType || r.owner_type)}`}>
                    {ownerBadgeLabel(r.ownerType || r.owner_type)}
                  </span>
                </div>
              </div>
              <div className="detail-info-item">
                <div className="detail-info-label">Capacity</div>
                <div className="detail-info-value">👥 {r.capacity} people</div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>Contact</h4>
            <div className="detail-contact-card">
              <div className="guide-avatar" style={{ width: 44, height: 44, fontSize: 18 }}>
                {(r.contact || r.name || '?').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div className="guide-name">{r.contact || r.name}</div>
                <div className="guide-phone">{formatPhone(r.phone)}</div>
              </div>
              <a className="whatsapp-btn" href={waLink} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
