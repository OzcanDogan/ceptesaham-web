import React, { useEffect, useState } from 'react';
import { getBusinessReservations } from '../../api/footballField';
import { BusinessReservationDto } from '../../types';
import { Calendar, Clock, User, TrendingUp } from 'lucide-react';

function statusBadge(s: string) {
  const map: Record<string, string> = {
    Confirmed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Cancelled: 'bg-red-100 text-red-700',
    Completed: 'bg-blue-100 text-blue-700',
  };
  return map[s] || 'bg-gray-100 text-gray-600';
}

export default function BusinessReservationsPage() {
  const [reservations, setReservations] = useState<BusinessReservationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getBusinessReservations().then(setReservations).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
    </div>
  );

  const grouped: Record<string, BusinessReservationDto[]> = {};
  const filtered = filter === 'all' ? reservations : reservations.filter(r => r.status === filter);
  filtered.forEach(r => {
    const date = r.date?.split('T')[0] || 'Bilinmiyor';
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(r);
  });

  const totalRevenue = reservations.filter(r => r.status === 'Confirmed' || r.status === 'Completed')
    .reduce((s, r) => s + (r.totalPrice || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rezervasyonlar</h1>
          <p className="text-gray-500">{reservations.length} toplam rezervasyon</p>
        </div>
        <div className="bg-green-50 rounded-2xl px-5 py-3 text-center">
          <p className="text-xs text-green-600">Toplam Gelir</p>
          <p className="text-xl font-bold text-green-700">₺{totalRevenue.toFixed(0)}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === s ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {s === 'all' ? 'Tümü' : s === 'Confirmed' ? 'Onaylı' : s === 'Pending' ? 'Bekliyor' : s === 'Completed' ? 'Tamamlandı' : 'İptal'}
          </button>
        ))}
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Calendar size={48} className="mx-auto mb-3 opacity-30" />
          <p>Rezervasyon yok</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, items]) => (
            <div key={date}>
              <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">
                {new Date(date).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {items.map(r => (
                  <div key={r.reservationId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} className="text-green-600" />
                        <span className="font-semibold text-gray-800">{r.startTime} - {r.endTime}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <User size={14} />
                      <span className="truncate">{r.playerEmail}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">#{r.reservationId}</span>
                      <span className="font-bold text-green-700">₺{r.totalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
