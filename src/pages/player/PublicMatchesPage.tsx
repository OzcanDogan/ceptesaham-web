import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOpenMatches, getMyMatches } from '../../api/publicMatch';
import { PublicMatch, MyMatchesResponse } from '../../types';
import { Trophy, Users, MapPin, Calendar, Clock } from 'lucide-react';

function statusBadge(s: string) {
  const map: Record<string, string> = {
    Open: 'bg-green-100 text-green-700',
    Full: 'bg-orange-100 text-orange-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Completed: 'bg-gray-100 text-gray-600',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return map[s] || 'bg-gray-100 text-gray-600';
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    Open: 'Açık', Full: 'Dolu', Confirmed: 'Onaylı', Completed: 'Tamamlandı', Cancelled: 'İptal',
  };
  return map[s] || s;
}

function MatchCard({ match, onClick }: { match: PublicMatch; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-800 text-lg leading-tight">{match.title}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge(match.status)}`}>
          {statusLabel(match.status)}
        </span>
      </div>
      <div className="space-y-1 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={14} /> <span>{match.footballFieldName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} /> <span>{new Date(match.matchDate).toLocaleDateString('tr-TR')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} /> <span>{match.startTime} - {match.endTime}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            {match.currentPlayerCount}/{match.maxPlayers} oyuncu
          </span>
        </div>
        <div className="w-full max-w-24 bg-gray-200 rounded-full h-2 ml-3">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${(match.currentPlayerCount / match.maxPlayers) * 100}%` }}
          />
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
      .then(([open, my]) => {
        setOpenMatches(open);
        setMyMatches(my);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
    </div>
  );

  const myAll = [...(myMatches?.organizedMatches || []), ...(myMatches?.joinedMatches || [])];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Maçlar</h1>
          <p className="text-gray-500">Açık maçlara katıl veya kendi maçını oluştur</p>
        </div>
        <button
          onClick={() => navigate('/player/matches/create')}
          className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700"
        >
          + Maç Oluştur
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('open')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'open' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}
        >
          Açık Maçlar ({openMatches.length})
        </button>
        <button
          onClick={() => setTab('my')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'my' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}
        >
          Maçlarım ({myAll.length})
        </button>
      </div>

      {tab === 'open' && (
        openMatches.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Trophy size={48} className="mx-auto mb-3 opacity-30" />
            <p>Açık maç yok</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {openMatches.map(m => (
              <MatchCard key={m.id} match={m} onClick={() => navigate(`/player/matches/${m.id}`)} />
            ))}
          </div>
        )
      )}

      {tab === 'my' && (
        myAll.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Trophy size={48} className="mx-auto mb-3 opacity-30" />
            <p>Maç yok</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {myAll.map(m => (
              <MatchCard key={m.id} match={m} onClick={() => navigate(`/player/matches/${m.id}`)} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
