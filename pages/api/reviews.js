// ============================================================
//  /api/reviews
//  GET  ?experienceId=1   -> list reviews for an experience
//  POST { experienceId, name, stars, text } -> save a review
// ============================================================
import { getReviews, saveReview } from '../../lib/dataAccess';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { experienceId } = req.query;
    if (!experienceId) return res.status(400).json({ error: 'Missing experienceId' });
    const reviews = await getReviews(Number(experienceId));
    return res.status(200).json({ reviews });
  }

  if (req.method === 'POST') {
    const { experienceId, name, stars, text } = req.body;
    if (!experienceId || !name || !stars) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await saveReview(Number(experienceId), {
      name, stars: Number(stars), text: text || '', date: new Date().toISOString(),
    });
    return res.status(200).json(result);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
