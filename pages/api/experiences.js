// ============================================================
//  GET /api/experiences
//  Returns all experiences (from database if connected, else
//  the built-in static data).
// ============================================================
import { getExperiences } from '../../lib/dataAccess';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const experiences = await getExperiences();
  res.status(200).json({ experiences });
}
