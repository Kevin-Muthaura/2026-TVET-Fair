import { useState, useEffect } from 'react';
import PaymentSplitPanel from './PaymentSplitPanel';

// ============================================================
//  BookingModal
//  Books an experience, simulates M-Pesa STK push, then shows
//  the automatic payment split (no central wallet).
// ============================================================
export default function BookingModal({ experience, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1 = details, 2 = mpesa, 3 = confirmed
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);
  const [phone, setPhone] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    if (experience) {
      setStep(1); setName(''); setDate(''); setPeople(1); setPhone('');
      setMpesaPhone(''); setError(''); setProcessing(false); setBookingResult(null);
    }
  }, [experience]);

  if (!experience) return null;

  const total = experience.price * people;

  function handleStep1() {
    if (!name.trim() || !date || !phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setStep(2);
  }

  async function handleStep2() {
    if (!mpesaPhone.trim()) {
      setError('Please enter your M-Pesa number.');
      return;
    }
    setError('');
    setProcessing(true);
    setStep(3);

    // Simulate STK push delay
    await new Promise(r => setTimeout(r, 2200));

    // Call booking API — this computes the automatic payment split
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId: experience.id,
          touristName: name,
          touristPhone: phone,
          date,
          numPeople: people,
        }),
      });
      const data = await res.json();
      setBookingResult(data);
      setProcessing(false);
      if (onSuccess) onSuccess(data);
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setProcessing(false);
      setStep(2);
    }
  }

  return (
    <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <div className="modal-label">Book Experience</div>
            <h3 className="modal-title">{experience.name}</h3>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {step <= 2 && (
          <>
            <div className="modal-section">
              <label className="modal-field-label">Full Name <span className="required">*</span></label>
              <input className="modal-input" type="text" placeholder="Jane Wanjiku" value={name}
                onChange={(e) => setName(e.target.value)} disabled={step === 2} />
            </div>
            <div className="booking-row">
              <div className="modal-section">
                <label className="modal-field-label">Preferred Date <span className="required">*</span></label>
                <input className="modal-input" type="date" value={date}
                  onChange={(e) => setDate(e.target.value)} disabled={step === 2} />
              </div>
              <div className="modal-section">
                <label className="modal-field-label">No. of People <span className="required">*</span></label>
                <input className="modal-input" type="number" min="1" max="20" value={people}
                  onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))} disabled={step === 2} />
              </div>
            </div>
            <div className="modal-section">
              <label className="modal-field-label">Your WhatsApp Number <span className="required">*</span></label>
              <input className="modal-input" type="tel" placeholder="e.g. 0712345678" value={phone}
                onChange={(e) => setPhone(e.target.value)} disabled={step === 2} />
            </div>

            <div className="mpesa-section">
              <div className="mpesa-header"><span className="mpesa-logo">M-PESA</span><span className="mpesa-tag">Payment Demo</span></div>
              <div className="mpesa-amount">Total: KES {total.toLocaleString()} ({people} person{people > 1 ? 's' : ''})</div>
              <div className="mpesa-steps">
                <div className={`mpesa-step ${step === 1 ? 'active' : ''}`}>1. Enter Details</div>
                <div className={`mpesa-step ${step === 2 ? 'active' : ''}`}>2. Pay via M-Pesa</div>
                <div className="mpesa-step">3. Confirmed ✓</div>
              </div>
              {step === 2 && (
                <div>
                  <input className="modal-input" type="tel" placeholder="M-Pesa number e.g. 0712345678"
                    value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} />
                  <p className="mpesa-note">An STK Push will be sent to your phone. Enter your M-Pesa PIN to confirm.</p>
                </div>
              )}
            </div>

            {error && <p className="review-error">{error}</p>}

            <button className="modal-submit-btn" style={{ background: 'var(--moss)' }}
              onClick={step === 1 ? handleStep1 : handleStep2}>
              {step === 1 ? 'Proceed to Payment →' : '🔐 Confirm Payment'}
            </button>
          </>
        )}

        {step === 3 && (
          <div>
            {processing && (
              <div className="loading-spinner">
                <div className="spinner-icon"></div>
                <span>Processing payment & splitting funds among providers...</span>
              </div>
            )}

            {!processing && bookingResult && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: 'var(--earth)', marginBottom: 4 }}>
                    Payment Confirmed!
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-light)' }}>
                    Booking ref: {bookingResult.bookingId}
                  </p>
                </div>

                <PaymentSplitPanel
                  splits={bookingResult.splits}
                  totalAmount={bookingResult.totalAmount}
                  title="Your Payment Has Been Split Automatically"
                />

                <button className="modal-submit-btn" style={{ background: 'var(--whatsapp)', marginTop: 14 }} onClick={onClose}>
                  Done
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
