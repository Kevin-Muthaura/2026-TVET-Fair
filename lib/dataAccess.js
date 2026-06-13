// ============================================================
//  DATA ACCESS LAYER
//  All data fetching goes through here. If Supabase env vars
//  aren't set, falls back to static data so the site always works.
// ============================================================
import { supabase } from './supabaseClient';
import * as staticData from '../data/staticData';

const isDbConnected = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Normalizes the static resourcesDirectory (snake_case-ish) into the
// camelCase shape components expect (ownerType, priceRange, paymentMethods)
function normalizeStaticResources() {
  return staticData.resourcesDirectory.map(r => ({
    ...r,
    ownerType: r.ownerType || r.owner_type,
    priceRange: r.priceRange || r.price_range,
    paymentMethods: r.paymentMethods || r.payment_methods,
  }));
}


// ── EXPERIENCES ──────────────────────────────────────────────
export async function getExperiences() {
  if (!isDbConnected()) return staticData.experiences;
  const { data, error } = await supabase.from('experiences').select('*').order('id');
  if (error || !data || !data.length) return staticData.experiences;
  // Merge in long-form details from static data (descriptions, included items etc.)
  return data.map(row => {
    const staticMatch = staticData.experiences.find(e => e.id === row.id) || {};
    return {
      ...row,
      guide: { name: staticMatch.guide?.name || row.provider_id, phone: staticMatch.guide?.phone },
      longDescription: staticMatch.longDescription,
      included: staticMatch.included,
      meetingPoint: staticMatch.meetingPoint,
      bestTime: staticMatch.bestTime,
      baseRating: row.base_rating,
      groupBooking: row.group_booking,
    };
  });
}

// ── RESOURCES DIRECTORY ──────────────────────────────────────
export async function getResources() {
  if (!isDbConnected()) return normalizeStaticResources();
  const { data, error } = await supabase.from('resources').select('*').order('id');
  if (error || !data || !data.length) return normalizeStaticResources();
  return data.map(row => {
    const staticMatch = staticData.resourcesDirectory.find(r => r.id === row.id) || {};
    return {
      ...row,
      ownerType: row.owner_type,
      priceRange: row.price_range,
      paymentMethods: row.payment_methods,
      longDescription: staticMatch.longDescription,
      amenities: staticMatch.amenities,
      contact: staticMatch.contact,
    };
  });
}

// ── MARKETPLACE ──────────────────────────────────────────────
export async function getMarketplaceItems() {
  if (!isDbConnected()) return staticData.marketplaceItems;
  const { data, error } = await supabase.from('marketplace_items').select('*').order('id');
  if (error || !data || !data.length) return staticData.marketplaceItems;
  return data.map(row => {
    const staticMatch = staticData.marketplaceItems.find(m => m.id === row.id) || {};
    return { ...row, longDescription: staticMatch.longDescription };
  });
}

// ── PROVIDERS ────────────────────────────────────────────────
export async function getProviders() {
  if (!isDbConnected()) return staticData.providers;
  const { data, error } = await supabase.from('providers').select('*');
  if (error || !data || !data.length) return staticData.providers;
  return data;
}

// ── REVIEWS ──────────────────────────────────────────────────
export async function getReviews(experienceId) {
  if (!isDbConnected()) {
    // fall back to localStorage on client
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem(`reviews_${experienceId}`)) || []; }
      catch { return []; }
    }
    return [];
  }
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('experience_id', experienceId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data.map(r => ({ name: r.reviewer_name, stars: r.stars, text: r.review_text, date: r.created_at }));
}

export async function saveReview(experienceId, review) {
  if (!isDbConnected()) {
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem(`reviews_${experienceId}`)) || [];
      existing.unshift(review);
      localStorage.setItem(`reviews_${experienceId}`, JSON.stringify(existing));
    }
    return { success: true, mode: 'local' };
  }
  const { error } = await supabase.from('reviews').insert({
    experience_id: experienceId,
    reviewer_name: review.name,
    stars: review.stars,
    review_text: review.text,
  });
  return { success: !error, mode: 'db' };
}

// ── BOOKINGS + PAYMENT SPLITS ────────────────────────────────
export async function createBooking(booking, splits) {
  if (!isDbConnected()) {
    // Return a fake booking id for demo mode
    return { success: true, mode: 'local', bookingId: `LOCAL-${Date.now()}` };
  }
  const { data: bookingRow, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      experience_id: booking.experienceId,
      tourist_name: booking.touristName,
      tourist_phone: booking.touristPhone,
      booking_date: booking.date,
      num_people: booking.numPeople,
      total_amount: booking.totalAmount,
      payment_status: 'completed',
    })
    .select()
    .single();

  if (bookingError) return { success: false, error: bookingError };

  const splitRows = splits.map(s => ({
    booking_id: bookingRow.id,
    provider_id: s.provider_id,
    role: s.role,
    percentage: s.percentage,
    amount: s.amount,
    payout_status: 'pending',
  }));

  const { error: splitError } = await supabase.from('payment_splits').insert(splitRows);
  if (splitError) return { success: false, error: splitError };

  return { success: true, mode: 'db', bookingId: bookingRow.id };
}

// ── SAVE ITINERARY ───────────────────────────────────────────
export async function saveItinerary(itineraryData) {
  if (!isDbConnected()) return { success: true, mode: 'local' };
  const { error } = await supabase.from('itineraries').insert({
    tourist_name: itineraryData.touristName || null,
    tourist_phone: itineraryData.touristPhone || null,
    days: itineraryData.days,
    group_size: itineraryData.groupSize,
    budget_per_day: itineraryData.budgetPerDay,
    interests: itineraryData.interests,
    owner_pref: itineraryData.ownerPref,
    total_cost: itineraryData.totalCost,
    total_carbon: itineraryData.totalCarbon,
    itinerary_json: itineraryData.fullItinerary,
  });
  return { success: !error };
}
