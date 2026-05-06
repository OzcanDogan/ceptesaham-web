import React, { useEffect, useState } from 'react';
import { searchPlayers } from '../../api/playerProfile';
import { PlayerProfile } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faStar } from '@fortawesome/free-solid-svg-icons';
import '../../components/layout.css';

export default function PlayerFinderPage() {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = () => {
    setLoading(true);
    searchPlayers().then(setPlayers).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { doSearch(); }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: 0 }}>Oyuncu Bul</h1>
        <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Maçına uygun oyuncuları keşfet</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><div className="spinner" /></div>
      ) : players.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 64, color: '#9ca3af' }}>
          <FontAwesomeIcon icon={faUsers} style={{ fontSize: 48, margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
          <p style={{ margin: 0, fontSize: 15 }}>Oyuncu bulunamadı</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {players.map(p => (
            <div key={p.userId} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {p.displayName?.[0] || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, color: '#0f1117', fontSize: 14, margin: 0 }}>{p.displayName}</p>
                  {(p.cityName || p.districtName) && (
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
                      {[p.districtName, p.cityName].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                {p.averageRating > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FontAwesomeIcon icon={faStar} style={{ color: '#f59e0b', fontSize: 13 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f1117' }}>{p.averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: '10px 4px', textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, color: '#0f1117', fontSize: 18, margin: 0 }}>{p.totalMatchesPlayed}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Maç</p>
                </div>
                <div style={{ background: '#fffbeb', borderRadius: 12, padding: '10px 4px', textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, color: '#92400e', fontSize: 18, margin: 0 }}>{p.averageRating > 0 ? p.averageRating.toFixed(1) : '—'}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Puan</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
