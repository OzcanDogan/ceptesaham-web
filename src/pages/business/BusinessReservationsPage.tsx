import React, { useEffect, useState } from 'react';
import { getBusinessReservations } from '../../api/footballField';
import { BusinessReservationDto } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import '../../components/layout.css';

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  Confirmed: { label: 'Onaylı',      bg: '#f0fdf4', color: '#16a34a' },
  Pending:   { label: 'Bekliyor',    bg: '#fefce8', color: '#a16207' },
  Cancelled: { label: 'İptal',       bg: '#fef2f2', color: '#dc2626' },
  Completed: { label: 'Tamamlandı', bg: '#eff6ff', color: '#2563eb' },
};

const FILTER_OPTS = [
  { key: 'all',       label: 'Tümü' },
  { key: 'Confirmed', label: 'Onaylı' },
  { key: 'Pending',   label: 'Bekliyor' },
  { key: 'Completed', label: 'Tamamlandı' },
  { key: 'Cancelled', label: 'İptal' },
];

export default function BusinessReservationsPage() {
  const [reservations, setReservations] = useState<BusinessReservationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getBusinessReservations().then(setReservations).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><div className="spinner" /></div>
  );

  const filtered = filter === 'all' ? reservations : reservations.filter(r => r.status === filter);
  const grouped: Record<string, BusinessReservationDto[]> = {};
  filtered.forEach(r => {
    const date = r.date?.split('T')[0] || 'Bilinmiyor';
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(r);
  });

  const totalRevenue = reservations
    .filter(r => r.status === 'Confirmed' || r.status === 'Completed')
    .reduce((s, r) => s + (r.totalPrice || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: 0 }}>Rezervasyonlar</h1>
          <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{reservations.length} toplam rezervasyon</p>
        </div>
        <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 16, padding: '10px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#16a34a', margin: 0, fontWeight: 600 }}>Toplam Gelir</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#16a34a', margin: '2px 0 0' }}>₺{totalRevenue.toFixed(0)}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {FILTER_OPTS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: filter === key ? '#22c55e' : '#fff', color: filter === key ? '#fff' : '#374151', boxShadow: filter === key ? '0 4px 14px rgba(34,197,94,0.3)' : '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            {label}
          </button>
        ))}
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 64, color: '#9ca3af' }}>
          <FontAwesomeIcon icon={faCalendar} style={{ fontSize: 48, margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
          <p style={{ margin: 0, fontSize: 15 }}>Rezervasyon yok</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, items]) => (
            <div key={date}>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.6, margin: '0 0 12px' }}>
                {new Date(date).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {items.map(r => {
                  const s = STATUS_MAP[r.status] || { label: r.status, bg: '#f9fafb', color: '#6b7280' };
                  return (
                    <div key={r.reservationId} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#0f1117' }}>
                          <FontAwesomeIcon icon={faClock} style={{ color: '#22c55e', fontSize: 14 }} />
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{r.startTime} – {r.endTime}</span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: s.bg, color: s.color }}>{s.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>
                        <FontAwesomeIcon icon={faUser} style={{ fontSize: 12 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.playerEmail}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#d1d5db' }}>#{r.reservationId}</span>
                        <span style={{ fontWeight: 700, color: '#22c55e', fontSize: 16 }}>₺{r.totalPrice}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
