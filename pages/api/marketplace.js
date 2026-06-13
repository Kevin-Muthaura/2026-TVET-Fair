// ============================================================
//  GET /api/marketplace
//  Returns all marketplace items.
// ============================================================
import { getMarketplaceItems } from '../../lib/dataAccess';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const items = await getMarketplaceItems();
  res.status(200).json({ items });
}
