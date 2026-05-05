import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../../api/playerProfile';
import { PlayerProfile } from '../../types';
import { Trophy, Star, Target, TrendingUp } from 'lucide-react';

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(setPlayers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
    </div>
  );

  const medal = (i: number) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Liderlik Tablosu</h1>
        <p className="text-gray-500">En iyi oyuncular</p>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Trophy size={48} className="mx-auto mb-3 opacity-30" />
          <p>Henüz veri yok</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {players.map((p, i) => (
            <div key={p.userId} className={`flex items-center gap-4 p-5 border-b border-gray-50 hover:bg-gray-50 transition ${i === 0 ? 'bg-yellow-50' : ''}`}>
              <div className="w-10 text-center font-bold text-xl">{medal(i)}</div>

              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">
                {p.displayName?.[0] || '?'}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800">{p.displayName}</p>
                <p className="text-xs text-gray-500">{p.preferredPosition} • {p.skillLevel}</p>
                {p.cityName && <p className="text-xs text-gray-400">{p.cityName}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-bold text-gray-800">{p.totalMatchesPlayed}</p>
                  <p className="text-xs text-gray-400">Maç</p>
                </div>
                <div>
                  <p className="font-bold text-green-700">{p.wins}</p>
                  <p className="text-xs text-gray-400">Galibiyet</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <p className="font-bold text-gray-800">{p.averageRating?.toFixed(1)}</p>
                  </div>
                  <p className="text-xs text-gray-400">Puan</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
