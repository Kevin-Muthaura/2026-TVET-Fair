// ============================================================
//  PAYMENT SPLITTING ENGINE
//  Defines how every booking's total payment is divided among
//  providers automatically — no central "one wallet" model.
//
//  This module computes the split breakdown for:
//   1. Single experience bookings (guide-led)
//   2. Full AI-generated itineraries (accommodation + food +
//      transport + experiences, each with their own provider)
//   3. Marketplace orders (artisan + platform fee)
//
//  IMPORTANT FOR NON-TECHNICAL USERS:
//  This is a SIMULATION of automatic splitting. It calculates
//  exactly how much each provider should receive and stores
//  that breakdown in the `payment_splits` table. Connecting
//  this to REAL M-Pesa payouts requires Safaricom Daraja B2C
//  API approval — see DEPLOYMENT_GUIDE.md, Phase 6.
// ============================================================

// ── SPLIT RULES ───────────────────────────────────────────────
// These percentages can be adjusted any time without touching
// the rest of the code.
export const SPLIT_RULES = {
  // Single experience booking (e.g. "Book Now" on a guide-led tour)
  experience: {
    guide: 85,            // goes directly to the tour guide
    platform_fee: 10,     // covers platform maintenance, M-Pesa charges
    community_fund: 5,    // Laikipia Community Conservation Fund
  },
  // Full AI-generated itinerary — each category has its own provider
  itinerary: {
    accommodation: 100,   // 100% of the accommodation line goes to that provider
    food: 100,            // 100% of the food line goes to that provider
    transport: 100,       // 100% of the transport line goes to that provider
    experience_guide: 85, // experience line: 85% to guide
    experience_platform_fee: 10,
    experience_community_fund: 5,
  },
  // Marketplace order
  marketplace: {
    artisan: 92,          // goes to the artisan/vendor
    platform_fee: 8,      // covers payment processing & platform upkeep
  },
};

// ── HELPER: round to 2 decimals ────────────────────────────────
const r2 = (n) => Math.round(n * 100) / 100;

// ── SPLIT FOR A SINGLE EXPERIENCE BOOKING ───────────────────────
// Returns an array of { provider_id, role, percentage, amount }
export function splitExperienceBooking(totalAmount, guideProviderId) {
  const rules = SPLIT_RULES.experience;
  return [
    {
      provider_id: guideProviderId,
      role: 'guide',
      percentage: rules.guide,
      amount: r2(totalAmount * (rules.guide / 100)),
    },
    {
      provider_id: 'PLATFORM',
      role: 'platform_fee',
      percentage: rules.platform_fee,
      amount: r2(totalAmount * (rules.platform_fee / 100)),
    },
    {
      provider_id: 'COMMUNITY_FUND',
      role: 'community_fund',
      percentage: rules.community_fund,
      amount: r2(totalAmount * (rules.community_fund / 100)),
    },
  ];
}

// ── SPLIT FOR A FULL AI-GENERATED ITINERARY ─────────────────────
// `lineItems` = {
//   accommodation: { providerId, amount } | null,
//   food:          { providerId, amount } | null,
//   transport:     { providerId, amount } | null,
//   experiences:   [{ providerId, amount, name }],
// }
export function splitItineraryPayment(lineItems) {
  const splits = [];
  const rules = SPLIT_RULES.itinerary;

  if (lineItems.accommodation && lineItems.accommodation.amount > 0) {
    splits.push({
      provider_id: lineItems.accommodation.providerId,
      role: 'accommodation',
      percentage: rules.accommodation,
      amount: r2(lineItems.accommodation.amount),
      label: 'Accommodation',
    });
  }

  if (lineItems.food && lineItems.food.amount > 0) {
    splits.push({
      provider_id: lineItems.food.providerId,
      role: 'food',
      percentage: rules.food,
      amount: r2(lineItems.food.amount),
      label: 'Meals',
    });
  }

  if (lineItems.transport && lineItems.transport.amount > 0) {
    splits.push({
      provider_id: lineItems.transport.providerId,
      role: 'transport',
      percentage: rules.transport,
      amount: r2(lineItems.transport.amount),
      label: 'Transport',
    });
  }

  // Each experience is split 85/10/5 individually
  let totalPlatformFee = 0;
  let totalCommunityFund = 0;
  (lineItems.experiences || []).forEach((exp) => {
    const guideAmount = r2(exp.amount * (rules.experience_guide / 100));
    const feeAmount = r2(exp.amount * (rules.experience_platform_fee / 100));
    const fundAmount = r2(exp.amount * (rules.experience_community_fund / 100));
    splits.push({
      provider_id: exp.providerId,
      role: 'experience_guide',
      percentage: rules.experience_guide,
      amount: guideAmount,
      label: `${exp.name} — Guide Fee`,
    });
    totalPlatformFee += feeAmount;
    totalCommunityFund += fundAmount;
  });

  if (totalPlatformFee > 0) {
    splits.push({
      provider_id: 'PLATFORM',
      role: 'platform_fee',
      percentage: rules.experience_platform_fee,
      amount: r2(totalPlatformFee),
      label: 'Platform Fee (across all activities)',
    });
  }

  if (totalCommunityFund > 0) {
    splits.push({
      provider_id: 'COMMUNITY_FUND',
      role: 'community_fund',
      percentage: rules.experience_community_fund,
      amount: r2(totalCommunityFund),
      label: 'Community Conservation Fund',
    });
  }

  return splits;
}

// ── SPLIT FOR A MARKETPLACE ORDER ───────────────────────────────
export function splitMarketplaceOrder(totalAmount, artisanProviderId) {
  const rules = SPLIT_RULES.marketplace;
  return [
    {
      provider_id: artisanProviderId,
      role: 'artisan',
      percentage: rules.artisan,
      amount: r2(totalAmount * (rules.artisan / 100)),
    },
    {
      provider_id: 'PLATFORM',
      role: 'platform_fee',
      percentage: rules.platform_fee,
      amount: r2(totalAmount * (rules.platform_fee / 100)),
    },
  ];
}

// ── VALIDATE: splits must sum to total (rounding-safe) ──────────
export function validateSplitsSum(splits, expectedTotal) {
  const sum = splits.reduce((s, x) => s + x.amount, 0);
  return Math.abs(sum - expectedTotal) < 1; // allow 1 KES rounding tolerance
}
