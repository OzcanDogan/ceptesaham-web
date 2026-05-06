import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOpenMatches, getMyMatches } from '../../api/publicMatch';
import { PublicMatch, MyMatchesResponse } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faUsers, faMapMarkerAlt, faCalendar, faClock, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../components/layout.css';

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  Open:      { label: 'Açık',        bg: '#f0fdf4', color: '#16a34a' },
  Full:      { label: 'Dolu',        bg: '#fff7ed', color: '#c2410c' },
  Confirmed: { label: 'Onaylı',      bg: '#eff6ff', color: '#2563eb' },
  Completed: { label: 'Tamamlandı', bg: '#f9fafb', color: '#6b7280' },
  Cancelled: { label: 'İptal',       bg: '#fef2f2', color: '#dc2626' },
};

function MatchCard({ match, onClick }: { match: PublicMatch; onClick: () => void }) {
  const s = STATUS_MAP[match.status] || { label: match.status, bg: '#f9fafb', color: '#6b7280' };
  const pct = (match.currentPlayerCount / match.maxPlayers) * 100;

  return (
    <div
      onClick={onClick}
      style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', cursor: 'pointer', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.13)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
    >
      <div style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', padding: '18px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
          <h3 style={{ fontWeight: 700, color: '#fff', fontSize: 15, lineHeight: 1.3, margin: 0 }}>{match.title}</h3>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 9px', borderRadius: 20, background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
          <FontAwesomeIcon icon={faMapMarkerAlt} style={{ fontSize: 11 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.footballFieldName}</span>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14, fontSize: 13, color: '#6b7280' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FontAwesomeIcon icon={faCalendar} style={{ color: '#9ca3af', fontSize: 12 }} />
            <span>{new Date(match.matchDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FontAwesomeIcon icon={faClock} style={{ color: '#9ca3af', fontSize: 12 }} />
            <span>{match.startTime}</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#374151' }}>
              <FontAwesomeIcon icon={faUsers} style={{ fontSize: 12 }} />
              <span style={{ fontWeight: 600 }}>{match.currentPlayerCount}/{match.maxPlayers}</span>
              <span style={{ color: '#9ca3af' }}>oyuncu</span>
            </div>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>{match.teamSize}x{match.teamSize}</span>
          </div>
          <div style={{ width: '100%', background: '#f3f4f6', borderRadius: 999, height: 6 }}>
            <div style={{ height: 6, borderRadius: 999, background: pct >= 100 ? '#f97316' : '#22c55e', width: `${Math.min(pct, 100)}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicMatchesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'open' | 'my'>('open');
  const [openMatches, setOpenMatches] = useState<PublicMatch[]>([]);
  const [myMatches, setMyMatches] = useState<MyMatchesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOpenMatches(), getMyMatches()])
      .then(([open, my]) => { setOpenMatches(open); setMyMatches(my); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}><div className="spinner" /></div>
  );

  const myAll = [...(myMatches?.organizedMatches || []), ...(myMatches?.joinedMatches || [])];
  const current = tab === 'open' ? openMatches : myAll;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: 0 }}>Maçlar</h1>
          <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Açık maçlara katıl veya yeni maç oluştur</p>
        </div>
        <button
          onClick={() => navigate('/player/matches/create')}
          style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}
        >
          <FontAwesomeIcon icon={faPlus} style={{ fontSize: 15 }} /> Maç Oluştur
        </button>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 4, width: 'fit-content' }}>
        {[
          { key: 'open', label: 'Açık Maçlar', count: openMatches.length },
          { key: 'my',   label: 'Maçlarım',    count: myAll.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            style={{ padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: tab === key ? '#22c55e' : 'transparent', color: tab === key ? '#fff' : '#6b7280', transition: 'all 0.15s' }}
          >
            {label} <span style={{ fontSize: 11, opacity: 0.75 }}>({count})</span>
          </button>
        ))}
      </div>

      {current.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.05)' }}>
          <FontAwesomeIcon icon={faTrophy} style={{ fontSize: 48, margin: '0 auto 12px', color: '#e5e7eb', display: 'block' }} />
          <p style={{ fontWeight: 600, color: '#6b7280', fontSize: 15, margin: 0 }}>Maç bulunamadı</p>
          {tab === 'open' && (
            <button onClick={() => navigate('/player/matches/create')} style={{ marginTop: 12, background: 'none', border: 'none', color: '#22c55e', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              İlk maçı sen oluştur!
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {current.map(m => (
            <MatchCard key={m.id} match={m} onClick={() => navigate(`/player/matches/${m.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
