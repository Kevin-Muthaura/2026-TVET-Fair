import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import WhatsAppIcon from './WhatsAppIcon';
import { buildWhatsAppLink, formatPhone, timeAgo } from '../lib/utils';

// ============================================================
//  ExperienceDetailModal
//  Opens when a tourist clicks an experience card to see full
//  information: long description, what's included, meeting
//  point, best time, reviews, and booking/contact actions.
// ============================================================
export default function ExperienceDetailModal({ experience, onClose, onBook, getAvgRating, getReviewCount, getReviewsPreview }) {
  if (!experience) return null;

  const exp = experience;
  const waLink = buildWhatsAppLink(
    exp.guide?.phone || exp.phone,
    `Hello, I'm interested in the ${exp.name} at ${exp.location}. Please send me more details.`
  );

  const avgRating = getAvgRating ? getAvgRating(exp) : exp.baseRating || exp.base_rating;
  const reviewCount = getReviewCount ? getReviewCount(exp) : 0;
  const reviews = getReviewsPreview ? getReviewsPreview(exp) : [];

  return (
    <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="detail-modal-box">
        <div className="detail-hero">
          <button className="detail-close" onClick={onClose} aria-label="Close">✕</button>
          <span className="detail-hero-emoji">{exp.emoji}</span>
          <div className="detail-hero-category">{exp.category}</div>
          <h2>{exp.name}</h2>
          <div className="detail-hero-meta">
            <span>📍 {exp.location}</span>
            <span>⏱ {exp.duration}</span>
            <span>⭐ {avgRating} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h4>About this experience</h4>
            <p>{exp.longDescription || exp.description}</p>
          </div>

          {exp.included && exp.included.length > 0 && (
            <div className="detail-section">
              <h4>What&apos;s included</h4>
              <div className="detail-tags">
                {exp.included.map((item, i) => <span className="detail-tag" key={i}>✓ {item}</span>)}
              </div>
            </div>
          )}

          <div className="detail-section">
            <div className="detail-info-grid">
              {exp.meetingPoint && (
                <div className="detail-info-item">
                  <div className="detail-info-label">Meeting Point</div>
                  <div className="detail-info-value">{exp.meetingPoint}</div>
                </div>
              )}
              {exp.bestTime && (
                <div className="detail-info-item">
                  <div className="detail-info-label">Best Time</div>
                  <div className="detail-info-value">{exp.bestTime}</div>
                </div>
              )}
              <div className="detail-info-item">
                <div className="detail-info-label">Group Bookings</div>
                <div className="detail-info-value">{exp.groupBooking ?? exp.group_booking ? '✅ Available' : '👤 Private only'}</div>
              </div>
              <div className="detail-info-item">
                <div className="detail-info-label">Carbon Footprint</div>
                <div className="detail-info-value">🌱 {exp.carbon} kg CO₂/person</div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-price-box">
              <div>
                <div className="detail-price-amount">
                  KES {Number(exp.price).toLocaleString()} <span>/ person</span>
                </div>
              </div>
              <div className="detail-actions">
                <button className="book-btn" style={{ padding: '12px 22px' }} onClick={() => onBook(exp)}>
                  📅 Book Now
                </button>
                <a className="whatsapp-btn" href={waLink} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>Your Local Guide</h4>
            <div className="detail-contact-card">
              <div className="guide-avatar" style={{ width: 44, height: 44, fontSize: 18 }}>
                {(exp.guide?.name || '?').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="guide-name">{exp.guide?.name}</div>
                <div className="guide-phone">{exp.guide?.phone ? formatPhone(exp.guide.phone) : ''}</div>
              </div>
            </div>
          </div>

          {reviews && reviews.length > 0 && (
            <div className="detail-section">
              <h4>Recent Reviews</h4>
              <div className="detail-reviews-list">
                {reviews.map((r, i) => (
                  <div className="review-item" key={i}>
                    <div className="review-item-header">
                      <div className="review-avatar">{r.name ? r.name[0].toUpperCase() : '?'}</div>
                      <div>
                        <div className="review-author">{r.name || 'Anonymous'}</div>
                        <StarRating rating={r.stars} small />
                      </div>
                      <span className="review-time">{timeAgo(r.date)}</span>
                    </div>
                    {r.text && <p className="review-text">&quot;{r.text}&quot;</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
