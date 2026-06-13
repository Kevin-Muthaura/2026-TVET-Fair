// ============================================================
//  POST /api/itinerary-split
//  Given a generated itinerary's line items, computes the
//  automatic split across ALL providers (accommodation, food,
//  transport, each experience's guide, platform fee, and the
//  community fund) — no central wallet.
// ============================================================
import { splitItineraryPayment, validateSplitsSum } from '../../lib/paymentSplit';
import { saveItinerary } from '../../lib/dataAccess';
import { providers } from '../../data/staticData';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { lineItems, meta } = req.body;
    // lineItems: { accommodation, food, transport, experiences[] }
    // meta: { days, groupSize, budgetPerDay, interests, ownerPref, touristName, touristPhone }

    if (!lineItems) {
      return res.status(400).json({ error: 'Missing lineItems' });
    }

    const splits = splitItineraryPayment(lineItems);

    const totalAmount =
      (lineItems.accommodation?.amount || 0) +
      (lineItems.food?.amount || 0) +
      (lineItems.transport?.amount || 0) +
      (lineItems.experiences || []).reduce((s, e) => s + e.amount, 0);

    const isValid = validateSplitsSum(splits, totalAmount);

    // Attach provider names for display
    const splitsWithNames = splits.map(s => {
      const provider = providers.find(p => p.id === s.provider_id);
      return { ...s, providerName: provider?.name || s.provider_id, providerPhone: provider?.phone };
    });

    if (meta) {
      await saveItinerary({
        touristName: meta.touristName,
        touristPhone: meta.touristPhone,
        days: meta.days,
        groupSize: meta.groupSize,
        budgetPerDay: meta.budgetPerDay,
        interests: meta.interests,
        ownerPref: meta.ownerPref,
        totalCost: totalAmount,
        totalCarbon: meta.totalCarbon,
        fullItinerary: { lineItems, splits: splitsWithNames },
      });
    }

    return res.status(200).json({
      success: true,
      totalAmount,
      splits: splitsWithNames,
      validated: isValid,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
