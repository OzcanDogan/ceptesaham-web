import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../../api/playerProfile';
import { PlayerProfile } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrophy } from '@fortawesome/free-solid-svg-icons';
import '../../components/layout.css';

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(setPlayers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><div className="spinner" /></div>
  );

  const medal = (i: number) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: 0 }}>Liderlik Tablosu</h1>
        <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>En yüksek puanlı oyuncular</p>
      </div>

      {players.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 64, color: '#9ca3af' }}>
          <FontAwesomeIcon icon={faTrophy} style={{ fontSize: 48, margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
          <p style={{ margin: 0 }}>Henüz veri yok</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {players.map((p, i) => (
            <div
              key={p.userId}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
                borderBottom: '1px solid #f9fafb',
                background: i === 0 ? '#fffbeb' : i === 1 ? '#fafafa' : '#fff',
              }}
            >
              <div style={{ width: 36, textAlign: 'center', fontSize: i < 3 ? 22 : 15, fontWeight: 700, color: '#9ca3af', flexShrink: 0 }}>{medal(i)}</div>

              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: 15, flexShrink: 0 }}>
                {p.displayName?.[0] || '?'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, color: '#0f1117', fontSize: 14, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.displayName}</p>
                {(p.cityName || p.districtName) && (
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
                    {[p.districtName, p.cityName].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, color: '#0f1117', fontSize: 16, margin: 0 }}>{p.totalMatchesPlayed}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Maç</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fffbeb', border: '1px solid #fde68a', padding: '6px 12px', borderRadius: 10 }}>
                  <FontAwesomeIcon icon={faStar} style={{ color: '#f59e0b', fontSize: 13 }} />
                  <p style={{ fontWeight: 800, color: '#92400e', fontSize: 17, margin: 0 }}>{p.averageRating?.toFixed(1) ?? '—'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
