import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchById, sendJoinRequest, leaveMatch, cancelMatch, approveJoinRequest, rejectJoinRequest, getPendingJoinRequests } from '../../api/publicMatch';
import { PublicMatch } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faUsers, faMapMarkerAlt, faCalendar, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import '../../components/layout.css';

const POSITIONS = ['Kaleci', 'Defans', 'Orta Saha', 'Forvet'];
const TEAMS = ['Takım 1', 'Takım 2'];

const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: 14, background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 10, outline: 'none', color: '#111', boxSizing: 'border-box', fontFamily: 'inherit' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 };

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [match, setMatch] = useState<PublicMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [joining, setJoining] = useState(false);
  const [position, setPosition] = useState(0);
  const [team, setTeam] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  const load = () => {
    getMatchById(Number(id)).then(setMatch).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  useEffect(() => {
    if (match && user && match.organizerId === user.id) {
      getPendingJoinRequests(match.id).then(setPendingRequests).catch(() => {});
    }
  }, [match, user]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><div className="spinner" /></div>;
  if (!match) return <div style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af' }}>Maç bulunamadı</div>;

  const isOrganizer = user?.id === match.organizerId;
  const isParticipant = match.participants.some(p => p.playerId === user?.id);

  const handleJoin = async () => {
    setJoining(true);
    try { await sendJoinRequest(match.id, position, team); setMsg('Katılım isteği gönderildi!'); load(); }
    catch { setMsg('İstek gönderilemedi.'); }
    finally { setJoining(false); }
  };

  const handleLeave = async () => {
    try { await leaveMatch(match.id); setMsg('Maçtan ayrıldınız.'); load(); }
    catch { setMsg('İşlem başarısız.'); }
  };

  const handleCancel = async () => {
    try { await cancelMatch(match.id); setMsg('Maç iptal edildi.'); load(); }
    catch { setMsg('İptal başarısız.'); }
  };

  const team1 = match.participants.filter(p => p.selectedTeam === 'Team1');
  const team2 = match.participants.filter(p => p.selectedTeam === 'Team2');
  const isError = msg.includes('başarısız') || msg.includes('edilemedi') || msg.includes('gönderilemedi');

  const infoItems: { icon: IconDefinition; text: string }[] = [
    { icon: faMapMarkerAlt, text: match.footballFieldName },
    { icon: faCalendar, text: new Date(match.matchDate).toLocaleDateString('tr-TR') },
    { icon: faClock, text: `${match.startTime} – ${match.endTime}` },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 14, fontWeight: 500, marginBottom: 20, padding: 0 }}>
        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 18 }} /> Geri
      </button>

      {/* Main card */}
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: 0 }}>{match.title}</h1>
          <span style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 20, background: '#f0fdf4', color: '#16a34a', flexShrink: 0 }}>{match.status}</span>
        </div>

        {match.description && <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>{match.description}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
          {infoItems.map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151' }}>
              <FontAwesomeIcon icon={icon} style={{ color: '#22c55e', fontSize: 15, flexShrink: 0 }} /> <span>{text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, background: '#f3f4f6', borderRadius: 999, height: 10 }}>
            <div style={{ background: '#22c55e', height: 10, borderRadius: 999, width: `${(match.currentPlayerCount / match.maxPlayers) * 100}%` }} />
          </div>
          <span style={{ fontWeight: 700, color: '#22c55e', fontSize: 14, flexShrink: 0 }}>{match.currentPlayerCount}/{match.maxPlayers}</span>
        </div>

        {msg && (
          <div style={{ padding: '10px 14px', borderRadius: 12, marginBottom: 16, fontSize: 13, fontWeight: 500, background: isError ? '#fef2f2' : '#f0fdf4', color: isError ? '#dc2626' : '#16a34a' }}>
            {msg}
          </div>
        )}

        {!isOrganizer && !isParticipant && match.status === 'Open' && (
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={lbl}>Pozisyon</label>
                <select value={position} onChange={e => setPosition(Number(e.target.value))} style={inp}>
                  {POSITIONS.map((p, i) => <option key={i} value={i}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Takım</label>
                <select value={team} onChange={e => setTeam(Number(e.target.value))} style={inp}>
                  {TEAMS.map((t, i) => <option key={i} value={i}>{t}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleJoin} disabled={joining} style={{ width: '100%', padding: 13, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.35)', opacity: joining ? 0.7 : 1 }}>
              {joining ? 'Gönderiliyor...' : 'Katılmak İstiyorum'}
            </button>
          </div>
        )}

        {isParticipant && !isOrganizer && (
          <button onClick={handleLeave} style={{ width: '100%', padding: 12, background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Maçtan Ayrıl
          </button>
        )}

        {isOrganizer && match.status !== 'Cancelled' && match.status !== 'Completed' && (
          <button onClick={handleCancel} style={{ width: '100%', padding: 12, background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Maçı İptal Et
          </button>
        )}
      </div>

      {/* Teams */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Takım 1', players: team1, accent: '#3b82f6' },
          { label: 'Takım 2', players: team2, accent: '#ef4444' },
        ].map(({ label, players, accent }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 20 }}>
            <h3 style={{ fontWeight: 700, color: '#0f1117', fontSize: 15, margin: '0 0 14px' }}>{label}</h3>
            {players.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>Henüz oyuncu yok</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {players.map(p => (
                  <div key={p.playerId} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9fafb', borderRadius: 12, padding: '10px 12px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: accent + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FontAwesomeIcon icon={faUser} style={{ color: accent, fontSize: 14 }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#0f1117', fontSize: 13, margin: 0 }}>{p.playerName}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>{p.preferredPosition}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pending requests */}
      {isOrganizer && pendingRequests.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 24 }}>
          <h3 style={{ fontWeight: 700, color: '#0f1117', fontSize: 15, margin: '0 0 16px' }}>Katılım İstekleri ({pendingRequests.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pendingRequests.map(req => (
              <div key={req.requestId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', borderRadius: 14, padding: '14px 16px' }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#0f1117', fontSize: 14, margin: 0 }}>{req.playerName}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '3px 0 0' }}>{req.preferredPosition} · {req.skillLevel}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>{req.totalMatchesPlayed} maç · Ort: {req.averageRating?.toFixed(1)}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => approveJoinRequest(req.requestId).then(() => { getPendingJoinRequests(match.id).then(setPendingRequests); load(); })}
                    style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Kabul
                  </button>
                  <button
                    onClick={() => rejectJoinRequest(req.requestId).then(() => getPendingJoinRequests(match.id).then(setPendingRequests))}
                    style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Reddet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
