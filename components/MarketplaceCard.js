import WhatsAppIcon from './WhatsAppIcon';
import { buildWhatsAppLink } from '../lib/utils';

// ============================================================
//  MarketplaceCard
//  Clicking the card opens MarketplaceDetailModal which
//  includes the payment-split preview.
// ============================================================
export default function MarketplaceCard({ item, onOpenDetail }) {
  const waLink = buildWhatsAppLink(item.phone, `Hello! I saw *${item.name}* (KES ${item.price.toLocaleString()}) on the Tembea Laikipia Marketplace and I'd like to order. Please send me more details.`);

  return (
    <div className="market-card">
      <div className="market-emoji clickable-area" onClick={() => onOpenDetail(item)}>{item.emoji}</div>
      <div className="market-body">
        <div className="market-category">{item.category}</div>
        <h4 className="market-name clickable-area" onClick={() => onOpenDetail(item)}>{item.name}</h4>
        <p className="market-desc">{item.description}</p>
        <div className="market-artisan">🧑‍🎨 {item.artisan} · Laikipia</div>
        <div className="market-price">KES {item.price.toLocaleString()}</div>
        <div className="clickable-area view-details-hint" style={{ marginBottom: 8 }} onClick={() => onOpenDetail(item)}>
          ℹ️ View details &amp; payment split
        </div>
        <a className="market-btn" href={waLink} target="_blank" rel="noopener noreferrer">🛒 Order via WhatsApp</a>
      </div>
    </div>
  );
}
