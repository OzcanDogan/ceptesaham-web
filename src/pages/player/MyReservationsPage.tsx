import React, { useEffect, useState } from 'react';
import { getMyReservations, cancelReservation } from '../../api/reservations';
import { AllMyReservationsResponse, ReservationDto } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import '../../components/layout.css';

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  Pending:   { label: 'Bekliyor',    bg: '#fefce8', color: '#a16207' },
  Confirmed: { label: 'Onaylı',      bg: '#f0fdf4', color: '#16a34a' },
  Cancelled: { label: 'İptal',       bg: '#fef2f2', color: '#dc2626' },
  Completed: { label: 'Tamamlandı', bg: '#eff6ff', color: '#2563eb' },
};

function ReservationCard({ res, onCancel }: { res: ReservationDto; onCancel?: () => void }) {
  const s = STATUS[res.status] || { label: res.status, bg: '#f9fafb', color: '#6b7280' };
  return (
    <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontWeight: 700, color: '#0f1117', fontSize: 15, margin: 0 }}>{res.footballFieldName || 'Saha'}</h3>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#6b7280' }}>
        {res.date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <FontAwesomeIcon icon={faCalendar} style={{ color: '#9ca3af', fontSize: 13 }} />
            <span>{new Date(res.date).toLocaleDateString('tr-TR')}</span>
          </div>
        )}
        {res.startTime && res.endTime && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <FontAwesomeIcon icon={faClock} style={{ color: '#9ca3af', fontSize: 13 }} />
            <span>{res.startTime} – {res.endTime}</span>
          </div>
        )}
        {res.totalPrice && (
          <p style={{ fontWeight: 700, color: '#22c55e', fontSize: 16, margin: '4px 0 0' }}>₺{res.totalPrice}</p>
        )}
      </div>
      {onCancel && res.status === 'Confirmed' && (
        <button onClick={onCancel} style={{ marginTop: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 13, padding: 0, fontWeight: 500 }}>
          İptal Et
        </button>
      )}
    </div>
  );
}

export default function MyReservationsPage() {
  const [data, setData] = useState<AllMyReservationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'past' | 'cancelled'>('active');

  const load = () => {
    setLoading(true);
    getMyReservations().then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id: number) => {
    try { await cancelReservation(id); load(); } catch {}
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><div className="spinner" /></div>
  );

  const tabs = [
    { key: 'active',    label: 'Aktif',   items: data?.activeReservations || [] },
    { key: 'past',      label: 'Geçmiş',  items: data?.pastReservations || [] },
    { key: 'cancelled', label: 'İptal',   items: data?.cancelledReservations || [] },
  ];
  const current = tabs.find(t => t.key === tab)!;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: 0 }}>Rezervasyonlarım</h1>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            style={{
              padding: '8px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: tab === t.key ? '#22c55e' : '#fff',
              color: tab === t.key ? '#fff' : '#374151',
              border: tab === t.key ? 'none' : '1px solid #e5e7eb',
              boxShadow: tab === t.key ? '0 4px 14px rgba(34,197,94,0.3)' : 'none',
            }}
          >
            {t.label} ({t.items.length})
          </button>
        ))}
      </div>

      {current.items.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 64, color: '#9ca3af' }}>
          <FontAwesomeIcon icon={faCalendar} style={{ fontSize: 48, margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
          <p style={{ margin: 0, fontSize: 15 }}>Rezervasyon yok</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {current.items.map(r => (
            <ReservationCard
              key={r.id}
              res={r}
              onCancel={tab === 'active' ? () => handleCancel(r.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
