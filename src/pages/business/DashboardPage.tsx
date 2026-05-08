import React, { useEffect, useState } from 'react';
import { getMyField, getBusinessReservations } from '../../api/footballField';
import { FootballField, BusinessReservationDto } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCalendar, faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useNavigate } from 'react-router-dom';
import '../../components/layout.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [field, setField] = useState<FootballField | null>(null);
  const [reservations, setReservations] = useState<BusinessReservationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyField().catch(() => null), getBusinessReservations().catch(() => [])])
      .then(([f, r]) => { setField(f); setReservations(r as BusinessReservationDto[]); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><div className="spinner" /></div>
  );

  const today = new Date().toISOString().split('T')[0];
  const todayRes = reservations.filter(r => r.date?.startsWith(today));
  const totalRevenue = reservations.filter(r => r.status === 'Confirmed').reduce((s, r) => s + (r.totalPrice || 0), 0);

  const stats: { icon: IconDefinition; label: string; val: string; bg: string; iconBg: string }[] = [
    { icon: faCalendar,   label: 'Bugünkü Rezervasyon', val: String(todayRes.length),       bg: '#eff6ff', iconBg: '#3b82f6' },
    { icon: faUsers,      label: 'Toplam Rezervasyon',   val: String(reservations.length),   bg: '#f0fdf4', iconBg: '#22c55e' },
    { icon: faChartLine,  label: 'Toplam Gelir',         val: `₺${totalRevenue.toFixed(0)}`, bg: '#faf5ff', iconBg: '#a855f7' },
    { icon: faBuilding,   label: 'Saha Durumu',          val: field ? 'Aktif' : 'Kurulmadı', bg: '#fff7ed', iconBg: '#f97316' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Sahanızın özeti</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {stats.map(({ icon, label, val, bg, iconBg }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 20 }}>
            <div style={{ width: 40, height: 40, background: iconBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <FontAwesomeIcon icon={icon} style={{ color: '#fff', fontSize: 20 }} />
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#0f1117', margin: 0 }}>{val}</p>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '4px 0 0' }}>{label}</p>
          </div>
        ))}
      </div>

      {!field ? (
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 48, textAlign: 'center' }}>
          <FontAwesomeIcon icon={faBuilding} style={{ fontSize: 52, margin: '0 auto 16px', color: '#d1d5db', display: 'block' }} />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#374151', margin: '0 0 8px' }}>Henüz Saha Yok</h2>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 20px' }}>İlk sahanızı oluşturun ve rezervasyonları almaya başlayın.</p>
          <button
            onClick={() => navigate('/business/my-field')}
            style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}
          >
            Saha Oluştur
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 24 }}>
            <h2 style={{ fontWeight: 700, color: '#0f1117', fontSize: 15, margin: '0 0 16px' }}>Saha Bilgileri</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Ad',      val: field.fieldName },
                { label: 'Konum',   val: `${field.cityName}, ${field.districtName}` },
                { label: 'Fiyat',   val: `₺${field.hourlyPrice}/saat`, green: true },
                { label: 'Saatler', val: `${field.startTime} – ${field.endTime}` },
              ].map(({ label, val, green }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #f9fafb' }}>
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: green ? '#22c55e' : '#0f1117' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 24 }}>
            <h2 style={{ fontWeight: 700, color: '#0f1117', fontSize: 15, margin: '0 0 16px' }}>Bugünkü Rezervasyonlar</h2>
            {todayRes.length === 0 ? (
              <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '24px 0', margin: 0 }}>Bugün rezervasyon yok</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {todayRes.map(r => (
                  <div key={r.reservationId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', borderRadius: 12, padding: '10px 14px' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: '#0f1117', fontSize: 13, margin: 0 }}>{r.startTime} – {r.endTime}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>{r.playerEmail}</p>
                    </div>
                    <span style={{ fontWeight: 700, color: '#22c55e', fontSize: 14 }}>₺{r.totalPrice}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
