import React, { useEffect, useState } from 'react';
import { searchPlayers } from '../../api/playerProfile';
import { PlayerProfile } from '../../types';
import { Users, Star, Search } from 'lucide-react';

const POSITIONS = ['', 'Kaleci', 'Defans', 'Orta Saha', 'Forvet'];
const LEVELS = ['', 'Başlangıç', 'Orta', 'İleri', 'Profesyonel'];

export default function PlayerFinderPage() {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState('');
  const [skillLevel, setSkillLevel] = useState('');

  const search = () => {
    setLoading(true);
    searchPlayers({ position: position || undefined, skillLevel: skillLevel || undefined })
      .then(setPlayers)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { search(); }, []);

  const selectClass = "border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Oyuncu Bul</h1>
        <p className="text-gray-500">Maçına uygun oyuncuları keşfet</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Pozisyon</label>
          <select className={selectClass} value={position} onChange={e => setPosition(e.target.value)}>
            {POSITIONS.map((p, i) => <option key={i} value={p}>{p || 'Tümü'}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Seviye</label>
          <select className={selectClass} value={skillLevel} onChange={e => setSkillLevel(e.target.value)}>
            {LEVELS.map((l, i) => <option key={i} value={l}>{l || 'Tümü'}</option>)}
          </select>
        </div>
        <button
          onClick={search}
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700"
        >
          <Search size={16} /> Ara
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users size={48} className="mx-auto mb-3 opacity-30" />
          <p>Oyuncu bulunamadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {players.map(p => (
            <div key={p.userId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-700">
                  {p.displayName?.[0] || '?'}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{p.displayName}</p>
                  <p className="text-sm text-gray-500">{p.preferredPosition}</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold">{p.averageRating?.toFixed(1)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-xl p-2">
                  <p className="font-bold text-gray-800">{p.totalMatchesPlayed}</p>
                  <p className="text-xs text-gray-500">Maç</p>
                </div>
                <div className="bg-green-50 rounded-xl p-2">
                  <p className="font-bold text-green-700">{p.wins}</p>
                  <p className="text-xs text-gray-500">Galibiyet</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-2">
                  <p className="font-bold text-blue-700">{p.goalsScored}</p>
                  <p className="text-xs text-gray-500">Gol</p>
                </div>
              </div>

              {p.bio && <p className="text-xs text-gray-400 mt-3 line-clamp-2">{p.bio}</p>}
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.skillLevel}</span>
                {p.cityName && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.cityName}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
