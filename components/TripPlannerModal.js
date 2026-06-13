import { useState } from 'react';
import PaymentSplitPanel from './PaymentSplitPanel';
import { ownerBadgeClass, ownerBadgeLabel } from '../lib/utils';

// ============================================================
//  TripPlannerModal
//  Generates a full itinerary (stay + food + transport +
//  experiences), then calls /api/itinerary-split to compute
//  the automatic payment split across every provider involved.
// ============================================================
export default function TripPlannerModal({ open, onClose, experiences, resourcesDirectory }) {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(6000);
  const [days, setDays] = useState(2);
  const [groupSize, setGroupSize] = useState(2);
  const [ownerPref, setOwnerPref] = useState('any');
  const [interests, setInterests] = useState(['Wildlife']);
  const [itinerary, setItinerary] = useState(null);
  const [splitData, setSplitData] = useState(null);
  const [loadingSplit, setLoadingSplit] = useState(false);

  if (!open) return null;

  function toggleInterest(val) {
    setInterests(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  }

  function priceMin(priceRange) {
    return parseInt(priceRange.replace('KES ', '').split('–')[0].replace(/,/g, ''));
  }

  async function generate() {
    function filterResources(category, maxPrice) {
      return resourcesDirectory.filter(r => {
        const inCat = r.category === category;
        const withinBudget = priceMin(r.priceRange) <= maxPrice;
        const ownerMatch = ownerPref === 'any' || r.ownerType.toLowerCase().includes(ownerPref.toLowerCase());
        return inCat && withinBudget && ownerMatch;
      });
    }

    const accBudget = budget * 0.4;
    const foodBudget = budget * 0.3;
    const trnBudget = budget * 0.2;
    const expBudget = budget * 0.1 * 10;

    const accOptions = filterResources('Accommodation', accBudget);
    const foodOptions = filterResources('Eating Facility', foodBudget);
    const trnOptions = filterResources('Transport', trnBudget);

    const expOptions = experiences.filter(exp => {
      const withinBudget = exp.price <= expBudget;
      const matchesInterest = interests.length === 0 || exp.tags.some(t => interests.includes(t));
      return withinBudget && matchesInterest;
    });

    const sortByRating = arr => [...arr].sort((a, b) => b.rating - a.rating);
    const sortExpByRating = arr => [...arr].sort((a, b) => b.baseRating - a.baseRating);

    const chosenAcc = sortByRating(accOptions)[0];
    const chosenFood = sortByRating(foodOptions);
    const chosenTrn = sortByRating(trnOptions)[0];

    let expPool = sortExpByRating(expOptions);
    const dayPlans = [];
    for (let d = 1; d <= days; d++) {
      const dayExps = [];
      for (let i = 0; i < 2 && expPool.length > 0; i++) dayExps.push(expPool.shift());
      if (expPool.length === 0) expPool = sortExpByRating(expOptions);
      dayPlans.push({ day: d, experiences: dayExps });
    }

    const accCostPerNight = chosenAcc ? priceMin(chosenAcc.priceRange) : 0;
    const foodCostPerDay = chosenFood.length ? priceMin(chosenFood[0].priceRange) * 3 : 0;
    const trnCostPerDay = chosenTrn ? priceMin(chosenTrn.priceRange) : 0;
    const expCostTotal = dayPlans.reduce((sum, d) => sum + d.experiences.reduce((s, e) => s + e.price, 0), 0);
    const totalCost = ((accCostPerNight * days) + (foodCostPerDay * days) + (trnCostPerDay * days) + expCostTotal) * groupSize;

    const allScheduledExps = dayPlans.flatMap(d => d.experiences);
    const carbonPerPerson = allScheduledExps.reduce((sum, e) => sum + e.carbon, 0);
    const totalCarbon = Math.round(carbonPerPerson * groupSize * 10) / 10;
    const treesToPlant = Math.ceil(totalCarbon / 5);

    const result = {
      days, groupSize, ownerPref, totalCost, totalCarbon, treesToPlant,
      chosenAcc, chosenFood: chosenFood.slice(0, 2), chosenTrn, dayPlans, allScheduledExps,
      accCostPerNight, foodCostPerDay, trnCostPerDay, expCostTotal,
    };
    setItinerary(result);
    setSplitData(null);
    setStep(2);
  }

  async function fetchSplit() {
    if (!itinerary) return;
    setLoadingSplit(true);
    try {
      const lineItems = {
        accommodation: itinerary.chosenAcc
          ? { providerId: itinerary.chosenAcc.providerId || itinerary.chosenAcc.provider_id, amount: itinerary.accCostPerNight * itinerary.days * itinerary.groupSize }
          : null,
        food: itinerary.chosenFood[0]
          ? { providerId: itinerary.chosenFood[0].providerId || itinerary.chosenFood[0].provider_id, amount: itinerary.foodCostPerDay * itinerary.days * itinerary.groupSize }
          : null,
        transport: itinerary.chosenTrn
          ? { providerId: itinerary.chosenTrn.providerId || itinerary.chosenTrn.provider_id, amount: itinerary.trnCostPerDay * itinerary.days * itinerary.groupSize }
          : null,
        experiences: itinerary.allScheduledExps.map(e => ({
          providerId: e.provider_id || e.providerId,
          amount: e.price * itinerary.groupSize,
          name: e.name,
        })),
      };

      const res = await fetch('/api/itinerary-split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineItems,
          meta: {
            days: itinerary.days, groupSize: itinerary.groupSize,
            budgetPerDay: budget, interests, ownerPref,
            totalCarbon: itinerary.totalCarbon,
          },
        }),
      });
      const data = await res.json();
      setSplitData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSplit(false);
    }
  }

  function downloadItinerary() {
    let text = `TEMBEA LAIKIPIA — YOUR PERSONALISED ITINERARY\n==============================================\n\n`;
    text += `${itinerary.days}-Day Laikipia Itinerary\n`;
    text += `Group size: ${itinerary.groupSize} | Est. total: KES ${itinerary.totalCost.toLocaleString()} | Carbon: ${itinerary.totalCarbon.toFixed(1)} kg CO2\n\n`;
    if (itinerary.chosenAcc) text += `STAY: ${itinerary.chosenAcc.name} (${itinerary.chosenAcc.location}) - ${itinerary.chosenAcc.priceRange}/night\n`;
    if (itinerary.chosenTrn) text += `TRANSPORT: ${itinerary.chosenTrn.name} (${itinerary.chosenTrn.location}) - ${itinerary.chosenTrn.priceRange}/day\n`;
    itinerary.chosenFood.forEach(f => { text += `DINING: ${f.name} (${f.location}) - ${f.priceRange}/meal\n`; });
    text += `\nDAY-BY-DAY:\n`;
    itinerary.dayPlans.forEach(d => {
      text += `Day ${d.day}:\n`;
      d.experiences.forEach((e, i) => {
        text += `  ${i === 0 ? 'Morning' : 'Afternoon'}: ${e.name} (${e.location}) - ${e.duration} - KES ${e.price.toLocaleString()}/person - Guide: ${e.guide.name}\n`;
      });
    });
    text += `\nCarbon footprint: ${itinerary.totalCarbon.toFixed(1)} kg CO2. Consider planting ${itinerary.treesToPlant} tree(s) to offset.\n`;
    text += `\nGenerated by Tembea Laikipia Smart Tourism Platform`;

    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Tembea_Laikipia_Itinerary.txt';
    a.click();
  }

  return (
    <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box modal-box--wide">
        <div className="modal-header">
          <div><div className="modal-label">🧠 AI Trip Planner</div><h3 className="modal-title">Plan My Laikipia Trip</h3></div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {step === 1 && (
          <div>
            <div className="planner-grid">
              <div className="modal-section">
                <label className="modal-field-label">Daily Budget per person (KES)</label>
                <select className="modal-input" value={budget} onChange={(e) => setBudget(Number(e.target.value))}>
                  <option value={3000}>Under KES 3,000/day</option>
                  <option value={6000}>KES 3,000 – 6,000/day</option>
                  <option value={12000}>KES 6,000 – 12,000/day</option>
                  <option value={25000}>KES 12,000+/day</option>
                </select>
              </div>
              <div className="modal-section">
                <label className="modal-field-label">Trip Duration</label>
                <select className="modal-input" value={days} onChange={(e) => setDays(Number(e.target.value))}>
                  <option value={1}>1 Day</option>
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                </select>
              </div>
            </div>

            <div className="modal-section">
              <label className="modal-field-label">Interests (select all that apply)</label>
              <div className="interest-chips">
                {['Wildlife', 'Adventure', 'Nature', 'Conservation', 'Culture'].map(val => (
                  <label className="chip-label" key={val}>
                    <input type="checkbox" checked={interests.includes(val)} onChange={() => toggleInterest(val)} />
                    {{ Wildlife: '🦏', Adventure: '🏕️', Nature: '🌿', Conservation: '🌍', Culture: '🥘' }[val]} {val}
                  </label>
                ))}
              </div>
            </div>

            <div className="planner-grid">
              <div className="modal-section">
                <label className="modal-field-label">Group Size</label>
                <input className="modal-input" type="number" min="1" max="20" value={groupSize}
                  onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
              <div className="modal-section">
                <label className="modal-field-label">Preference</label>
                <select className="modal-input" value={ownerPref} onChange={(e) => setOwnerPref(e.target.value)}>
                  <option value="any">No preference</option>
                  <option value="Women">Women-owned</option>
                  <option value="Youth">Youth-owned</option>
                  <option value="Community">Community-owned</option>
                </select>
              </div>
            </div>

            <button className="modal-submit-btn" style={{ background: 'var(--moss)' }} onClick={generate}>
              ✨ Generate Full Itinerary
            </button>
          </div>
        )}

        {step === 2 && itinerary && (
          <div>
            <div className="itinerary-result">
              <div className="itinerary-header">
                <h4>Your {itinerary.days}-Day Laikipia Itinerary</h4>
                <div className="itinerary-meta">
                  <span>👥 {itinerary.groupSize} person{itinerary.groupSize > 1 ? 's' : ''}</span>
                  <span>💰 Est. KES {itinerary.totalCost.toLocaleString()} total</span>
                  <span>🌱 {itinerary.totalCarbon.toFixed(1)} kg CO₂ total</span>
                  {itinerary.ownerPref !== 'any' && <span className="itin-pref-badge">✅ {itinerary.ownerPref}-owned priority</span>}
                </div>
              </div>

              {/* STAY */}
              <div className="itin-section-title">🏡 Recommended Stay</div>
              {itinerary.chosenAcc ? (
                <ResourceMiniCard r={itinerary.chosenAcc} per="night" actionLabel="Book" />
              ) : <p className="no-reviews-msg">No accommodation matches your budget. Try increasing your daily budget.</p>}

              {/* TRANSPORT */}
              <div className="itin-section-title">🚗 Recommended Transport</div>
              {itinerary.chosenTrn ? (
                <ResourceMiniCard r={itinerary.chosenTrn} per="day" actionLabel="Book" />
              ) : <p className="no-reviews-msg">No transport matches your budget. Try increasing your daily budget.</p>}

              {/* FOOD */}
              <div className="itin-section-title">🍽️ Recommended Dining</div>
              {itinerary.chosenFood.length ? itinerary.chosenFood.map((f, i) => (
                <ResourceMiniCard r={f} per="meal" actionLabel="Visit" key={i} />
              )) : <p className="no-reviews-msg">No dining options match your budget. Try increasing your daily budget.</p>}

              {/* DAY-BY-DAY */}
              <div className="itin-section-title">🗓️ Day-by-Day Activities</div>
              {itinerary.dayPlans.map(({ day, experiences: dayExps }) => (
                <div className="itin-day" key={day}>
                  <div className="itin-day-header">Day {day}</div>
                  {!dayExps.length ? (
                    <p className="no-reviews-msg">Free day — explore Laikipia at your own pace!</p>
                  ) : dayExps.map((exp, idx) => (
                    <div className="itin-item" key={idx}>
                      <div className="itin-time">{idx === 0 ? '🌅 Morning' : '🌄 Afternoon'}</div>
                      <div className="itin-exp-emoji">{exp.emoji}</div>
                      <div className="itin-exp-info">
                        <div className="itin-exp-name">{exp.name}</div>
                        <div className="itin-exp-loc">📍 {exp.location}</div>
                        <div className="itin-exp-meta">⏱ {exp.duration} · KES {exp.price.toLocaleString()}/person · {exp.guide.name}</div>
                        <div className="itin-exp-carbon">🌱 {exp.carbon} kg CO₂/person</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* COST BREAKDOWN */}
              <div className="itin-cost-breakdown">
                <h5>💰 Estimated Cost Breakdown ({itinerary.groupSize} person{itinerary.groupSize > 1 ? 's' : ''})</h5>
                <div className="cost-row"><span>🏡 Accommodation ({itinerary.days} night{itinerary.days > 1 ? 's' : ''})</span><span>KES {(itinerary.accCostPerNight * itinerary.days * itinerary.groupSize).toLocaleString()}</span></div>
                <div className="cost-row"><span>🍽️ Meals ({itinerary.days} day{itinerary.days > 1 ? 's' : ''})</span><span>KES {(itinerary.foodCostPerDay * itinerary.days * itinerary.groupSize).toLocaleString()}</span></div>
                <div className="cost-row"><span>🚗 Transport ({itinerary.days} day{itinerary.days > 1 ? 's' : ''})</span><span>KES {(itinerary.trnCostPerDay * itinerary.days * itinerary.groupSize).toLocaleString()}</span></div>
                <div className="cost-row"><span>🌿 Activities</span><span>KES {(itinerary.expCostTotal * itinerary.groupSize).toLocaleString()}</span></div>
                <div className="cost-row cost-total"><span>TOTAL ESTIMATE</span><span>KES {itinerary.totalCost.toLocaleString()}</span></div>
              </div>

              {/* CARBON BREAKDOWN */}
              <div className="itin-summary">
                <div className="itin-tip">💡 <strong>Tip:</strong> Book each provider directly via their WhatsApp button for the best rate and personalised service.</div>
                <div className="carbon-breakdown">
                  <div className="carbon-breakdown-title">🌱 Cumulative Carbon Footprint Breakdown</div>
                  {itinerary.allScheduledExps.map((e, i) => (
                    <div className="carbon-row" key={i}>
                      <span>{e.emoji} {e.name}</span>
                      <span>{e.carbon} kg CO₂/person × {itinerary.groupSize} = <strong>{Math.round(e.carbon * itinerary.groupSize * 10) / 10} kg</strong></span>
                    </div>
                  ))}
                  <div className="carbon-row carbon-total-row">
                    <span>🌍 Total CO₂ ({itinerary.allScheduledExps.length} experience{itinerary.allScheduledExps.length !== 1 ? 's' : ''}, {itinerary.groupSize} person{itinerary.groupSize > 1 ? 's' : ''})</span>
                    <span><strong>{itinerary.totalCarbon.toFixed(1)} kg CO₂</strong></span>
                  </div>
                  <div className="carbon-offset-note">
                    🌳 To offset <strong>{itinerary.totalCarbon.toFixed(1)} kg CO₂</strong>, consider planting <strong>{itinerary.treesToPlant} tree{itinerary.treesToPlant !== 1 ? 's' : ''}</strong> in Laikipia&apos;s reforestation programme.
                  </div>
                </div>
              </div>

              {/* PAYMENT SPLIT */}
              <div style={{ marginTop: 16 }}>
                <button className="modal-submit-btn" style={{ background: '#3a6ea5' }} onClick={fetchSplit} disabled={loadingSplit}>
                  {loadingSplit ? 'Calculating split...' : `💸 Show Automatic Payment Split for KES ${itinerary.totalCost.toLocaleString()}`}
                </button>
                {splitData && splitData.splits && (
                  <PaymentSplitPanel
                    splits={splitData.splits}
                    totalAmount={splitData.totalAmount}
                    title="How this itinerary's payment would be split"
                  />
                )}
              </div>
            </div>

            <div className="planner-actions">
              <button className="modal-submit-btn" style={{ background: 'var(--savanna)' }} onClick={downloadItinerary}>⬇ Download Itinerary</button>
              <button className="modal-submit-btn" style={{ background: 'transparent', color: 'var(--earth)', border: '1.5px solid var(--savanna)' }}
                onClick={() => { setStep(1); setItinerary(null); setSplitData(null); }}>
                ← Plan Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small resource preview card used inside the itinerary ──
function ResourceMiniCard({ r, per, actionLabel }) {
  const waLink = `https://wa.me/${r.phone}?text=${encodeURIComponent(`Hello, I'd like to ${actionLabel.toLowerCase()} ${r.name} via Tembea Laikipia. Please send availability and details.`)}`;
  return (
    <div className="itin-resource-card">
      <div className="itin-res-emoji">{r.emoji}</div>
      <div className="itin-res-info">
        <div className="itin-res-name">
          {r.name} <span className={`owner-badge ${ownerBadgeClass(r.ownerType)}`} style={{ fontSize: 10 }}>{ownerBadgeLabel(r.ownerType)}</span>
        </div>
        <div className="itin-res-sub">📍 {r.location} · {r.priceRange}/{per} · ⭐ {r.rating}</div>
        <div className="itin-res-services">
          {r.services.map((s, i) => <span className="service-tag" key={i}>{s}</span>)}
        </div>
      </div>
      <a className="whatsapp-btn" href={waLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, padding: '7px 11px', flexShrink: 0 }}>
        {actionLabel}
      </a>
    </div>
  );
}
