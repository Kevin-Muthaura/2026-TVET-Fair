// ============================================================
//  GET /api/resources
//  Returns the full tourism resources directory (accommodation,
//  transport, food) from the database if connected, else static.
// ============================================================
import { getResources } from '../../lib/dataAccess';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const resources = await getResources();
  res.status(200).json({ resources });
}
