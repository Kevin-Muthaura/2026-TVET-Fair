import WhatsAppIcon from './WhatsAppIcon';
import { buildWhatsAppLink, getInitials, formatPhone, ownerBadgeClass, ownerBadgeLabel } from '../lib/utils';

// ============================================================
//  ResourceCard
//  Clicking the card opens the ResourceDetailModal.
//  "Contact" button remains a direct WhatsApp action.
// ============================================================
export default function ResourceCard({ resource, onOpenDetail }) {
  const r = resource;
  const waLink = buildWhatsAppLink(r.phone, `Hello, I found *${r.name}* on the Tembea Laikipia platform. I'm interested in ${r.subcategory} — ${r.priceRange}. Please send me more details.`);

  return (
    <div className="dir-card">
      <div className="dir-card-header clickable-area" onClick={() => onOpenDetail(r)}>
        <div className="dir-emoji">{r.emoji}</div>
        <div className="dir-header-info">
          <div className="dir-subcategory">{r.subcategory}</div>
          <h4 className="dir-name">{r.name}</h4>
          <div className="dir-location">📍 {r.location}</div>
        </div>
        <div className="dir-rating">⭐ {r.rating}</div>
      </div>
      <p className="dir-desc">{r.description}</p>
      <div className="dir-services">
        {r.services.map((s, i) => <span className="service-tag" key={i}>{s}</span>)}
      </div>
      <div className="clickable-area view-details-hint" onClick={() => onOpenDetail(r)}>
        ℹ️ View full details →
      </div>
      <div className="dir-footer">
        <div>
          <div className="dir-price">{r.priceRange}</div>
          <div className="dir-payment">
            {r.paymentMethods.map((p, i) => <span className="payment-tag" key={i}>{p}</span>)}
          </div>
        </div>
        <div className="dir-badges">
          <span className={`owner-badge ${ownerBadgeClass(r.ownerType)}`}>{ownerBadgeLabel(r.ownerType)}</span>
        </div>
      </div>
      <div className="dir-contact">
        <div className="dir-contact-info">
          <div className="guide-avatar" style={{ width: 30, height: 30, fontSize: 12 }}>{getInitials(r.contact)}</div>
          <div>
            <div className="guide-name" style={{ fontSize: 13 }}>{r.contact}</div>
            <div className="guide-phone">{formatPhone(r.phone)}</div>
          </div>
        </div>
        <a className="whatsapp-btn" href={waLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, padding: '8px 12px' }}>
          <WhatsAppIcon size={12} /> Contact
        </a>
      </div>
    </div>
  );
}
