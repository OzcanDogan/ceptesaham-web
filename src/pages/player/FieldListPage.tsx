import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllFields } from '../../api/footballField';
import { FootballField, parseServices, FIELD_SERVICES } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faStar, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../components/layout.css';

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #4ade80, #16a34a)',
  'linear-gradient(135deg, #60a5fa, #0284c7)',
  'linear-gradient(135deg, #c084fc, #7c3aed)',
  'linear-gradient(135deg, #fb923c, #dc2626)',
  'linear-gradient(135deg, #2dd4bf, #0d9488)',
  'linear-gradient(135deg, #818cf8, #4f46e5)',
];

export default function FieldListPage() {
  const [fields, setFields] = useState<FootballField[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllFields().then(setFields).finally(() => setLoading(false));
  }, []);

  const filtered = fields.filter(f =>
    f.fieldName.toLowerCase().includes(search.toLowerCase()) ||
    (f.cityName || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 240, gap: 12 }}>
      <div className="spinner" />
      <p style={{ color: '#9ca3af', fontSize: 13 }}>Sahalar yükleniyor...</p>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: 0 }}>Sahalar</h1>
        <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{fields.length} saha listelendi</p>
      </div>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 16 }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Saha adı veya şehir ara..."
          style={{ width: '100%', padding: '12px 14px 12px 40px', fontSize: 14, background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 14, outline: 'none', color: '#111', boxSizing: 'border-box', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', fontFamily: 'inherit' }}
          onFocus={e => e.target.style.borderColor = '#22c55e'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 80 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
          <p style={{ fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Saha bulunamadı</p>
          <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>Farklı bir arama deneyin</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map((field, i) => {
            const services = parseServices(field.services);
            return (
              <div
                key={field.id}
                onClick={() => navigate(`/player/fields/${field.id}`)}
                style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.13)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
              >
                <div style={{ background: CARD_GRADIENTS[i % CARD_GRADIENTS.length], height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: 52 }}>🏟️</span>
                  {field.isIndoor && (
                    <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
                      Kapalı
                    </span>
                  )}
                </div>
                <div style={{ padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                    <h2 style={{ fontWeight: 700, color: '#0f1117', fontSize: 15, lineHeight: 1.3, margin: 0 }}>{field.fieldName}</h2>
                    {field.averageRating ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fffbeb', border: '1px solid #fde68a', padding: '3px 8px', borderRadius: 8, flexShrink: 0 }}>
                        <FontAwesomeIcon icon={faStar} style={{ color: '#f59e0b', fontSize: 11 }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#92400e' }}>{field.averageRating.toFixed(1)}</span>
                      </div>
                    ) : null}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 13, marginBottom: 4 }}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#9ca3af', fontSize: 12, flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{field.districtName ? `${field.districtName}, ` : ''}{field.cityName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 13 }}>
                      <FontAwesomeIcon icon={faClock} style={{ color: '#9ca3af', fontSize: 12, flexShrink: 0 }} />
                      <span>{field.startTime} — {field.endTime}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                    <div>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#22c55e' }}>₺{field.hourlyPrice}</span>
                      <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 3 }}>/saat</span>
                    </div>
                    {services.length > 0 && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        {services.slice(0, 2).map(id => (
                          <span key={id} style={{ fontSize: 11, background: '#f3f4f6', color: '#6b7280', padding: '2px 7px', borderRadius: 6 }}>
                            {FIELD_SERVICES.find(s => s.id === id)?.label}
                          </span>
                        ))}
                        {services.length > 2 && (
                          <span style={{ fontSize: 11, background: '#f3f4f6', color: '#6b7280', padding: '2px 7px', borderRadius: 6 }}>+{services.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
