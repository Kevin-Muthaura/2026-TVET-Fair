import StarRating from './StarRating';
import WhatsAppIcon from './WhatsAppIcon';
import { buildWhatsAppLink, getInitials, formatPhone } from '../lib/utils';

// ============================================================
//  ExperienceCard
//  Clicking the image, title or "View details" opens the
//  ExperienceDetailModal. "Book Now" and "WhatsApp" remain
//  direct-action buttons.
// ============================================================
export default function ExperienceCard({ exp, avgRating, reviewCount, reviewsPreview, onOpenDetail, onBook }) {
  const waLink = buildWhatsAppLink(exp.guide.phone, `Hello, I'm interested in the ${exp.name} at ${exp.location}. Please send me more details.`);
  const priceDisplay = exp.price >= 1000 ? `KES ${exp.price.toLocaleString()}` : `KES ${exp.price}`;

  return (
    <article className="card" data-tags={exp.tags.join(',')} data-id={exp.id}>
      <div className="card-img-wrap clickable-area" onClick={() => onOpenDetail(exp)}>
        <div className="card-img-placeholder">{exp.emoji}</div>
        <div className="card-category">{exp.category}</div>
        <div className="card-rating-badge">⭐ {avgRating}</div>
      </div>
      <div className="card-body">
        <h3 className="card-title clickable-area" onClick={() => onOpenDetail(exp)} style={{ display: 'inline-block' }}>
          {exp.name}
        </h3>
        <div className="card-meta-row">
          <span className="card-location">📍 {exp.location}</span>
          <span className="card-duration">⏱ {exp.duration}</span>
        </div>
        <p className="card-desc">{exp.description}</p>
        <div className="card-price">{priceDisplay} <span>/ person</span></div>
        <div className="card-meta-pills">
          <span className="card-group-tag">{exp.groupBooking ? '✅ Group bookings' : '👤 Private only'}</span>
          <span className="carbon-tag">🌱 {exp.carbon} kg CO₂</span>
        </div>

        <div className="review-summary-row">
          <StarRating rating={avgRating} />
          <span className="review-count-label">{reviewCount > 0 ? `${reviewCount} review${reviewCount > 1 ? 's' : ''}` : 'No reviews yet'}</span>
        </div>

        <div className="clickable-area view-details-hint" onClick={() => onOpenDetail(exp)}>
          ℹ️ View full details &amp; reviews →
        </div>

        <div className="card-actions" style={{ marginTop: 12 }}>
          <button className="book-btn" onClick={() => onBook(exp)}>📅 Book Now</button>
          <a className="whatsapp-btn" href={waLink} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /> WhatsApp
          </a>
        </div>

        <div className="guide-section">
          <div className="guide-label">Your Local Guide</div>
          <div className="guide-info">
            <div className="guide-avatar">{getInitials(exp.guide.name)}</div>
            <div className="guide-details">
              <div className="guide-name">{exp.guide.name}</div>
              <div className="guide-phone">{formatPhone(exp.guide.phone)}</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
