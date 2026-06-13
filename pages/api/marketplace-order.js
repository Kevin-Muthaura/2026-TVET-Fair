// ============================================================
//  POST /api/marketplace-order
//  Computes the automatic split for a marketplace purchase:
//  92% to the artisan, 8% platform fee.
// ============================================================
import { splitMarketplaceOrder } from '../../lib/paymentSplit';
import { marketplaceItems, providers } from '../../data/staticData';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { itemId, quantity } = req.body;
    if (!itemId) return res.status(400).json({ error: 'Missing itemId' });

    const item = marketplaceItems.find(i => i.id === Number(itemId));
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const qty = Number(quantity) || 1;
    const totalAmount = item.price * qty;

    const splits = splitMarketplaceOrder(totalAmount, item.provider_id);
    const splitsWithNames = splits.map(s => {
      const provider = providers.find(p => p.id === s.provider_id);
      return { ...s, providerName: provider?.name || s.provider_id, providerPhone: provider?.phone };
    });

    return res.status(200).json({
      success: true,
      item: { name: item.name, artisan: item.artisan },
      quantity: qty,
      totalAmount,
      splits: splitsWithNames,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
