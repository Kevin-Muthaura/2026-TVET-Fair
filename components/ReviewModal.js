import { useState, useEffect } from 'react';
import WhatsAppIcon from './WhatsAppIcon';
import { buildWhatsAppLink } from '../lib/utils';

// ============================================================
//  ReviewModal
//  Saves a review (DB if connected, else localStorage) and
//  opens WhatsApp with the review pre-filled to the guide.
// ============================================================
export default function ReviewModal({ experience, onClose, onSubmitted }) {
  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (experience) { setStars(0); setHoverStars(0); setName(''); setText(''); setError(''); setSubmitting(false); }
  }, [experience]);

  if (!experience) return null;

  async function handleSubmit() {
    if (!stars) { setError('Please select a star rating.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    setError('');
    setSubmitting(true);

    const review = { stars, name, text, date: new Date().toISOString() };

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experienceId: experience.id, name, stars, text }),
      });
    } catch (e) {
      console.error(e);
    }

    // Send to guide's WhatsApp
    const starEmojis = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    const lines = [
      `🌍 *New Review — Tembea Laikipia*`, ``,
      `*Experience:* ${experience.name}`,
      `*Location:* ${experience.location}`,
      `*Rating:* ${starEmojis} (${stars}/5)`,
      `*Reviewer:* ${name}`,
      text ? `*Review:* "${text}"` : null, ``,
      `_Sent via Tembea Laikipia Platform_`,
    ].filter(Boolean).join('\n');
    window.open(buildWhatsAppLink(experience.guide.phone, lines), '_blank', 'noopener,noreferrer');

    setSubmitting(false);
    if (onSubmitted) onSubmitted(review);
    onClose();
  }

  return (
    <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <div><div className="modal-label">Leave a Review</div><h3 className="modal-title">{experience.name}</h3></div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-section">
          <label className="modal-field-label">Your Rating <span className="required">*</span></label>
          <div className="modal-stars">
            {[1, 2, 3, 4, 5].map(v => (
              <span
                key={v}
                className={`modal-star ${(hoverStars || stars) >= v ? 'active' : ''}`}
                onMouseEnter={() => setHoverStars(v)}
                onMouseLeave={() => setHoverStars(0)}
                onClick={() => setStars(v)}
              >
                {(hoverStars || stars) >= v ? '★' : '☆'}
              </span>
            ))}
          </div>
          <div className="star-labels"><span>Poor</span><span>Fair</span><span>Good</span><span>Great</span><span>Excellent</span></div>
        </div>

        <div className="modal-section">
          <label className="modal-field-label">Your Name <span className="required">*</span></label>
          <input className="modal-input" type="text" placeholder="e.g. Jane Wanjiku" maxLength={60}
            value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="modal-section">
          <label className="modal-field-label">Your Review <span className="optional">(optional)</span></label>
          <textarea className="modal-textarea" rows={4} placeholder="Tell other tourists what made this experience special..."
            value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        {error && <p className="review-error">{error}</p>}

        <button className="modal-submit-btn" onClick={handleSubmit} disabled={submitting}>
          <WhatsAppIcon size={15} /> {submitting ? 'Sending...' : 'Submit & Send to Guide'}
        </button>
        <p className="modal-wa-note">Your review is saved on the platform and delivered to the guide&apos;s WhatsApp.</p>
      </div>
    </div>
  );
}
