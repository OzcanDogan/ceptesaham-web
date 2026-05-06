import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllFields, getTimeSlots } from '../../api/footballField';
import { createReservation, confirmPayment } from '../../api/reservations';
import { FootballField, TimeSlotDto, parseServices, FIELD_SERVICES } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faStar, faChevronLeft, faChevronRight, faPhone } from '@fortawesome/free-solid-svg-icons';
import '../../components/layout.css';

function formatDate(d: Date) { return d.toISOString().split('T')[0]; }
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

const inp: React.CSSProperties = { background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#111', outline: 'none', fontFamily: 'inherit' };

export default function FieldDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [field, setField] = useState<FootballField | null>(null);
  const [slots, setSlots] = useState<TimeSlotDto[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [paying, setPaying] = useState(false);
  const [msg, setMsg] = useState<{text: string; type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    getAllFields().then(fields => setField(fields.find(x => x.id === Number(id)) || null));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getTimeSlots(Number(id), formatDate(selectedDate)).then(setSlots).finally(() => setLoading(false));
  }, [id, selectedDate]);

  const handleBook = async (slotId: number) => {
    try {
      const r = await createReservation(slotId);
      setBookingId(r.id);
      setMsg({ text: 'Rezervasyon oluşturuldu! Ödemeyi onaylayın.', type: 'success' });
    } catch {
      setMsg({ text: 'Rezervasyon başarısız. Tekrar deneyin.', type: 'error' });
    }
  };

  const handlePay = async () => {
    if (!bookingId) return;
    setPaying(true);
    try {
      await confirmPayment(bookingId);
      setMsg({ text: '✅ Ödeme onaylandı! Rezervasyonunuz tamamlandı.', type: 'success' });
      setBookingId(null);
      getTimeSlots(Number(id), formatDate(selectedDate)).then(setSlots);
    } catch {
      setMsg({ text: 'Ödeme başarısız. Cüzdan bakiyenizi kontrol edin.', type: 'error' });
    } finally { setPaying(false); }
  };

  if (!field) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div className="spinner" />
    </div>
  );

  const services = parseServices(field.services);
  const dateStr = selectedDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 14, fontWeight: 500, marginBottom: 20, padding: 0 }}>
        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 18 }} /> Geri dön
      </button>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: 24, overflow: 'hidden', marginBottom: 24, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
        <div style={{ position: 'relative', padding: '32px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 8 }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ fontSize: 13 }} /><span>{field.address}, {field.districtName}, {field.cityName}</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: -0.5 }}>{field.fieldName}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, padding: '5px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 5 }}>
                <FontAwesomeIcon icon={faClock} style={{ fontSize: 12 }} /> {field.startTime} — {field.endTime}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, padding: '5px 12px', borderRadius: 20 }}>
                {field.isIndoor ? '🏠 Kapalı' : '☀️ Açık'}
              </span>
              {field.averageRating && (
                <span style={{ background: '#fbbf24', color: '#78350f', fontSize: 12, padding: '5px 12px', borderRadius: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <FontAwesomeIcon icon={faStar} style={{ fontSize: 11 }} /> {field.averageRating.toFixed(1)} ({field.reviewCount})
                </span>
              )}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: '16px 28px', textAlign: 'center', flexShrink: 0 }}>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, margin: '0 0 4px' }}>Saatlik Fiyat</p>
            <p style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: 0 }}>₺{field.hourlyPrice}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
        {/* Slots */}
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <button onClick={() => setSelectedDate(d => addDays(d, -1))} style={{ width: 34, height: 34, border: 'none', borderRadius: 10, background: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>
              <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 17 }} />
            </button>
            <p style={{ fontWeight: 700, color: '#0f1117', fontSize: 14, textTransform: 'capitalize', margin: 0 }}>{dateStr}</p>
            <button onClick={() => setSelectedDate(d => addDays(d, 1))} style={{ width: 34, height: 34, border: 'none', borderRadius: 10, background: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>
              <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 17 }} />
            </button>
          </div>

          {msg && (
            <div style={{ margin: '16px 20px 0', padding: '12px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: msg.type === 'success' ? '#166534' : '#dc2626', margin: 0 }}>{msg.text}</p>
              {bookingId && (
                <button onClick={handlePay} disabled={paying} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                  {paying ? '...' : 'Öde'}
                </button>
              )}
            </div>
          )}

          <div style={{ padding: 20 }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}><div className="spinner" /></div>
            ) : slots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
                <FontAwesomeIcon icon={faClock} style={{ fontSize: 32, margin: '0 auto 8px', opacity: 0.3, display: 'block' }} />
                <p style={{ margin: 0 }}>Bu tarih için zaman dilimi yok</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                {slots.map(slot => {
                  const available = slot.isAvailable && !slot.isBlockedByOwner;
                  return (
                    <button
                      key={slot.id}
                      disabled={!available}
                      onClick={() => available && handleBook(slot.id)}
                      style={{
                        padding: '12px 8px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: available ? 'pointer' : 'not-allowed',
                        border: available ? '2px solid #bbf7d0' : '2px solid #f3f4f6',
                        background: available ? '#f0fdf4' : '#f9fafb',
                        color: available ? '#16a34a' : '#d1d5db',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => available && ((e.currentTarget.style.background = '#dcfce7'), (e.currentTarget.style.borderColor = '#86efac'))}
                      onMouseLeave={e => available && ((e.currentTarget.style.background = '#f0fdf4'), (e.currentTarget.style.borderColor = '#bbf7d0'))}
                    >
                      <p style={{ margin: 0 }}>{slot.startTime}</p>
                      <p style={{ margin: '3px 0 0', fontSize: 11, fontWeight: 400, opacity: 0.85 }}>{slot.endTime} · {available ? '✓' : '✗'}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Info sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {field.ownerName && (
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.6, margin: '0 0 10px' }}>Saha Sahibi</p>
              <p style={{ fontWeight: 700, color: '#0f1117', margin: '0 0 4px' }}>{field.ownerName}</p>
              {field.ownerPhoneNumber && (
                <a href={`tel:${field.ownerPhoneNumber}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22c55e', fontSize: 13, textDecoration: 'none', marginTop: 4 }}>
                  <FontAwesomeIcon icon={faPhone} style={{ fontSize: 13 }} /> {field.ownerPhoneNumber}
                </a>
              )}
            </div>
          )}
          {services.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.6, margin: '0 0 10px' }}>Hizmetler</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {services.map(id => (
                  <span key={id} style={{ fontSize: 12, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: 20, fontWeight: 500 }}>
                    {FIELD_SERVICES.find(s => s.id === id)?.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
