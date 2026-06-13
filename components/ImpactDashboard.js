import { useEffect, useRef, useState } from 'react';

// ============================================================
//  ImpactDashboard
//  Computes ownership stats from resourcesDirectory and
//  animates counters into view.
// ============================================================
export default function ImpactDashboard({ resourcesDirectory }) {
  const sectionRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  const total = resourcesDirectory.length;
  const ownerTypes = resourcesDirectory.map(r => (r.ownerType || '').toLowerCase());
  const womenCount = ownerTypes.filter(o => o.includes('women')).length;
  const youthCount = ownerTypes.filter(o => o.includes('youth')).length;
  const communityCount = ownerTypes.filter(o => o.includes('community')).length;
  const womenPct = total ? Math.round((womenCount / total) * 100) : 0;
  const youthPct = total ? Math.round((youthCount / total) * 100) : 0;
  const communityPct = total ? Math.round((communityCount / total) * 100) : 0;

  const impactData = [
    { icon: '🏘️', target: total, label: 'Tourism Providers in Directory', bar: 78, prefix: '', format: '' },
    { icon: '👩', target: womenCount, label: `Women-owned Businesses (${womenPct}%)`, bar: womenPct, prefix: '', format: '' },
    { icon: '🧑', target: youthCount, label: `Youth-owned Businesses (${youthPct}%)`, bar: youthPct, prefix: '', format: '' },
    { icon: '🤝', target: communityCount, label: `Community-owned Enterprises (${communityPct}%)`, bar: communityPct, prefix: '', format: '' },
    { icon: '💰', target: 2100000, label: 'Estimated Income Generated (KES)', bar: 55, prefix: 'KES ', format: 'money' },
    { icon: '🎓', target: 127, label: 'TVET Students Placed', bar: 60, prefix: '', format: '' },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setAnimated(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="impact-section" id="impact" ref={sectionRef}>
      <div className="impact-inner">
        <div className="section-heading-light">
          <div className="section-badge">🌍 Community Impact Dashboard</div>
          <h2>Real People. Real Change.</h2>
          <p>Every booking directly supports Laikipia&apos;s communities, conservation and youth empowerment.</p>
        </div>

        <div className="impact-grid">
          {impactData.map((d, i) => (
            <ImpactCard key={i} data={d} animate={animated} />
          ))}
        </div>

        <div className="ownership-breakdown">
          <div className="ownership-chart">
            <h4>Provider Ownership Breakdown</h4>
            <div className="ownership-bars">
              <OwnBarRow label="👩 Women-owned" pct={womenPct} count={womenCount} cls="own-women" animate={animated} />
              <OwnBarRow label="🧑 Youth-owned" pct={youthPct} count={youthCount} cls="own-youth" animate={animated} />
              <OwnBarRow label="🤝 Community" pct={communityPct} count={communityCount} cls="own-community" animate={animated} />
            </div>
            <p className="ownership-note">
              💡 {womenPct + youthPct + communityPct}% of all providers are youth, women or community-owned —
              our system prioritises inclusive economic growth.
            </p>
          </div>
        </div>

        <div className="sdg-row">
          <div className="sdg-badge sdg-8">SDG 8<br /><span>Decent Work</span></div>
          <div className="sdg-badge sdg-10">SDG 10<br /><span>Reduced Inequalities</span></div>
          <div className="sdg-badge sdg-13">SDG 13<br /><span>Climate Action</span></div>
          <div className="sdg-badge sdg-15">SDG 15<br /><span>Life on Land</span></div>
          <div className="sdg-badge sdg-17">SDG 17<br /><span>Partnerships</span></div>
        </div>
      </div>
    </section>
  );
}

function ImpactCard({ data, animate }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let current = 0;
    const increment = data.target / 80;
    const timer = setInterval(() => {
      current = Math.min(current + increment, data.target);
      setValue(current);
      if (current >= data.target) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [animate, data.target]);

  const display = data.format === 'money'
    ? data.prefix + (value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : Math.floor(value).toLocaleString())
    : data.prefix + Math.floor(value).toLocaleString();

  return (
    <div className="impact-card">
      <div className="impact-icon">{data.icon}</div>
      <div className="impact-num">{display}</div>
      <div className="impact-label">{data.label}</div>
      <div className="impact-bar"><div className="impact-bar-fill" style={{ width: `${data.bar}%` }}></div></div>
    </div>
  );
}

function OwnBarRow({ label, pct, count, cls, animate }) {
  return (
    <div className="own-bar-row">
      <span className="own-bar-label">{label}</span>
      <div className="own-bar-track"><div className={`own-bar-fill ${cls}`} style={{ width: animate ? `${pct}%` : '0%' }}></div></div>
      <span className="own-bar-pct">{pct}% ({count})</span>
    </div>
  );
}
