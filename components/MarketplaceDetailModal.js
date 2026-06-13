import { useState } from 'react';
import WhatsAppIcon from './WhatsAppIcon';
import PaymentSplitPanel from './PaymentSplitPanel';
import { buildWhatsAppLink } from '../lib/utils';

// ============================================================
//  MarketplaceDetailModal
//  Click for more info on a marketplace item, with an option
//  to preview the automatic payment split before ordering.
// ============================================================
export default function MarketplaceDetailModal({ item, onClose }) {
  const [splitData, setSplitData] = useState(null);
  const [loadingSplit, setLoadingSplit] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const waLink = buildWhatsAppLink(
    item.phone,
    `Hello! I saw *${item.name}* (KES ${item.price.toLocaleString()}) on the Tembea Laikipia Marketplace and I'd like to order ${quantity}. Please send me more details.`
  );

  async function previewSplit() {
    setLoadingSplit(true);
    try {
      const res = await fetch('/api/marketplace-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, quantity }),
      });
      const data = await res.json();
      setSplitData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSplit(false);
    }
  }

  return (
    <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="detail-modal-box">
        <div className="detail-hero">
          <button className="detail-close" onClick={onClose} aria-label="Close">✕</button>
          <span className="detail-hero-emoji">{item.emoji}</span>
          <div className="detail-hero-category">{item.category}</div>
          <h2>{item.name}</h2>
          <div className="detail-hero-meta">
            <span>🧑‍🎨 {item.artisan} · Laikipia</span>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h4>About this item</h4>
            <p>{item.longDescription || item.description}</p>
          </div>

          <div className="detail-section">
            <div className="detail-price-box">
              <div>
                <div className="detail-price-amount">KES {item.price.toLocaleString()}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <label style={{ fontSize: 13, color: 'var(--text-mid)' }}>Quantity:</label>
                  <input
                    type="number" min="1" max="20" value={quantity}
                    onChange={(e) => { setQuantity(Math.max(1, parseInt(e.target.value) || 1)); setSplitData(null); }}
                    className="modal-input" style={{ width: 70, padding: '6px 10px' }}
                  />
                </div>
              </div>
              <div className="detail-actions">
                <a className="whatsapp-btn" href={waLink} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon /> Order via WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <button
              className="modal-submit-btn"
              style={{ background: 'var(--moss)' }}
              onClick={previewSplit}
              disabled={loadingSplit}
            >
              {loadingSplit ? 'Calculating...' : `💸 Preview Payment Split for KES ${(item.price * quantity).toLocaleString()}`}
            </button>

            {splitData && splitData.splits && (
              <PaymentSplitPanel
                splits={splitData.splits}
                totalAmount={splitData.totalAmount}
                title="How this payment would be split"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
