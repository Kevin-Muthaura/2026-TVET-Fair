// ============================================================
//  POST /api/bookings
//  Creates a booking AND automatically computes + stores the
//  payment split across all relevant providers.
// ============================================================
import { createBooking } from '../../lib/dataAccess';
import { splitExperienceBooking } from '../../lib/paymentSplit';
import { experiences } from '../../data/staticData';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { experienceId, touristName, touristPhone, date, numPeople } = req.body;

    if (!experienceId || !touristName || !touristPhone || !date || !numPeople) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const experience = experiences.find(e => e.id === Number(experienceId));
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    const totalAmount = experience.price * Number(numPeople);

    // ── AUTOMATIC PAYMENT SPLIT ──
    // No "one wallet" — the total is immediately divided:
    //  85% guide, 10% platform fee, 5% community fund
    const splits = splitExperienceBooking(totalAmount, experience.provider_id);

    const result = await createBooking(
      {
        experienceId: Number(experienceId),
        touristName,
        touristPhone,
        date,
        numPeople: Number(numPeople),
        totalAmount,
      },
      splits
    );

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to create booking', details: result.error });
    }

    return res.status(200).json({
      success: true,
      bookingId: result.bookingId,
      totalAmount,
      splits,
      experience: { name: experience.name, location: experience.location },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
