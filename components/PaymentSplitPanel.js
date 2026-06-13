import { splitRoleIcon, splitRoleLabel } from '../lib/utils';

// ============================================================
//  PaymentSplitPanel
//  Shows the automatic split of a payment across providers.
//  `splits` = [{ provider_id, providerName, role, percentage, amount, label }]
// ============================================================
export default function PaymentSplitPanel({ splits, totalAmount, title = 'Automatic Payment Split' }) {
  if (!splits || !splits.length) return null;

  return (
    <div className="split-panel">
      <div className="split-panel-title">💸 {title}</div>
      <div className="split-panel-subtitle">
        No single wallet holds this payment. As soon as it's confirmed, it's automatically divided
        and credited to each provider below.
      </div>

      {splits.map((s, i) => (
        <div className="split-row" key={i}>
          <div className="split-row-left">
            <div className={`split-icon role-${s.role}`}>{splitRoleIcon(s.role)}</div>
            <div>
              <div className="split-name">{s.label || s.providerName || splitRoleLabel(s.role)}</div>
              <div className="split-role">{s.providerName && s.label ? s.providerName : splitRoleLabel(s.role)}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="split-amount">KES {s.amount.toLocaleString()}</div>
            <div className="split-pct">{s.percentage}%</div>
          </div>
        </div>
      ))}

      <div className="split-total-row">
        <span>Total</span>
        <span>KES {(totalAmount ?? splits.reduce((sum, s) => sum + s.amount, 0)).toLocaleString()}</span>
      </div>

      <div className="split-note">
        💡 Each provider receives their share directly — tour guides, accommodation owners,
        food vendors, transport operators and artisans are paid independently for their part
        of the service, with a small platform fee and community conservation contribution.
      </div>
    </div>
  );
}
