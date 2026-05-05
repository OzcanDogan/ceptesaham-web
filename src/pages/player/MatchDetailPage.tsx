import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchById, sendJoinRequest, leaveMatch, cancelMatch, approveJoinRequest, rejectJoinRequest, getPendingJoinRequests } from '../../api/publicMatch';
import { PublicMatch } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Users, MapPin, Calendar, Clock, User } from 'lucide-react';

const POSITIONS = ['Kaleci', 'Defans', 'Orta Saha', 'Forvet'];
const TEAMS = ['Takım 1', 'Takım 2'];

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

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (match && user && match.organizerId === user.id) {
      getPendingJoinRequests(match.id).then(setPendingRequests).catch(() => {});
    }
  }, [match, user]);

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" /></div>;
  if (!match) return <div className="text-center py-16 text-gray-400">Maç bulunamadı</div>;

  const isOrganizer = user?.id === match.organizerId;
  const isParticipant = match.participants.some(p => p.playerId === user?.id);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await sendJoinRequest(match.id, position, team);
      setMsg('Katılım isteği gönderildi!');
      load();
    } catch {
      setMsg('İstek gönderilemedi.');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveMatch(match.id);
      setMsg('Maçtan ayrıldınız.');
      load();
    } catch {
      setMsg('İşlem başarısız.');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMatch(match.id);
      setMsg('Maç iptal edildi.');
      load();
    } catch {
      setMsg('İptal başarısız.');
    }
  };

  const team1 = match.participants.filter(p => p.selectedTeam === 'Team1');
  const team2 = match.participants.filter(p => p.selectedTeam === 'Team2');

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-4">
        <ChevronLeft size={20} /> Geri
      </button>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{match.title}</h1>
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-green-100 text-green-700">
            {match.status}
          </span>
        </div>

        {match.description && <p className="text-gray-600 mb-4">{match.description}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-green-600" />
            <span>{match.footballFieldName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-green-600" />
            <span>{new Date(match.matchDate).toLocaleDateString('tr-TR')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-green-600" />
            <span>{match.startTime} - {match.endTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${(match.currentPlayerCount / match.maxPlayers) * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-green-700">
            {match.currentPlayerCount}/{match.maxPlayers}
          </span>
        </div>

        {msg && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${msg.includes('başarısız') || msg.includes('edilemedi') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {msg}
          </div>
        )}

        {!isOrganizer && !isParticipant && match.status === 'Open' && (
          <div className="space-y-3 border-t pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Pozisyon</label>
                <select
                  value={position}
                  onChange={e => setPosition(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {POSITIONS.map((p, i) => <option key={i} value={i}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Takım</label>
                <select
                  value={team}
                  onChange={e => setTeam(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {TEAMS.map((t, i) => <option key={i} value={i}>{t}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={handleJoin}
              disabled={joining}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {joining ? 'Gönderiliyor...' : 'Katılmak İstiyorum'}
            </button>
          </div>
        )}

        {isParticipant && !isOrganizer && (
          <button onClick={handleLeave} className="w-full border border-red-300 text-red-600 py-2.5 rounded-xl font-medium hover:bg-red-50">
            Maçtan Ayrıl
          </button>
        )}

        {isOrganizer && match.status !== 'Cancelled' && match.status !== 'Completed' && (
          <button onClick={handleCancel} className="w-full border border-red-300 text-red-600 py-2.5 rounded-xl font-medium hover:bg-red-50">
            Maçı İptal Et
          </button>
        )}
      </div>

      {/* Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[{ label: 'Takım 1', players: team1, color: 'blue' }, { label: 'Takım 2', players: team2, color: 'red' }].map(({ label, players, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-3">{label}</h3>
            {players.length === 0 ? (
              <p className="text-gray-400 text-sm">Henüz oyuncu yok</p>
            ) : (
              <div className="space-y-2">
                {players.map(p => (
                  <div key={p.playerId} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className={`w-8 h-8 rounded-full bg-${color}-100 flex items-center justify-center`}>
                      <User size={14} className={`text-${color}-600`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{p.playerName}</p>
                      <p className="text-xs text-gray-500">{p.preferredPosition}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pending requests for organizer */}
      {isOrganizer && pendingRequests.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4">Katılım İstekleri ({pendingRequests.length})</h3>
          <div className="space-y-3">
            {pendingRequests.map(req => (
              <div key={req.requestId} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="font-medium text-gray-800">{req.playerName}</p>
                  <p className="text-xs text-gray-500">{req.preferredPosition} • {req.skillLevel}</p>
                  <p className="text-xs text-gray-400">{req.totalMatchesPlayed} maç • Ort: {req.averageRating?.toFixed(1)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveJoinRequest(req.requestId).then(() => { getPendingJoinRequests(match.id).then(setPendingRequests); load(); })}
                    className="bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-green-700"
                  >
                    Kabul
                  </button>
                  <button
                    onClick={() => rejectJoinRequest(req.requestId).then(() => { getPendingJoinRequests(match.id).then(setPendingRequests); })}
                    className="bg-red-100 text-red-600 text-sm px-3 py-1.5 rounded-lg hover:bg-red-200"
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
