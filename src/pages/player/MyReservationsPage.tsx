import React, { useEffect, useState } from 'react';
import { getMyReservations, cancelReservation } from '../../api/reservations';
import { AllMyReservationsResponse, ReservationDto } from '../../types';
import { Calendar, Clock, MapPin } from 'lucide-react';

function statusLabel(s: string) {
  const map: Record<string, { label: string; color: string }> = {
    Pending: { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-700' },
    Confirmed: { label: 'Onaylı', color: 'bg-green-100 text-green-700' },
    Cancelled: { label: 'İptal', color: 'bg-red-100 text-red-700' },
    Completed: { label: 'Tamamlandı', color: 'bg-blue-100 text-blue-700' },
  };
  return map[s] || { label: s, color: 'bg-gray-100 text-gray-700' };
}

function ReservationCard({ res, onCancel }: { res: ReservationDto; onCancel?: () => void }) {
  const { label, color } = statusLabel(res.status);
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-800">{res.footballFieldName || 'Saha'}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>{label}</span>
      </div>
      <div className="space-y-1 text-sm text-gray-500">
        {res.date && (
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{new Date(res.date).toLocaleDateString('tr-TR')}</span>
          </div>
        )}
        {res.startTime && res.endTime && (
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>{res.startTime} - {res.endTime}</span>
          </div>
        )}
        {res.totalPrice && (
          <p className="font-semibold text-green-700 mt-2">₺{res.totalPrice}</p>
        )}
      </div>
      {onCancel && res.status === 'Confirmed' && (
        <button
          onClick={onCancel}
          className="mt-3 text-sm text-red-600 hover:underline"
        >
          İptal Et
        </button>
      )}
    </div>
  );
}

export default function MyReservationsPage() {
  const [data, setData] = useState<AllMyReservationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'past' | 'cancelled'>('active');

  const load = () => {
    setLoading(true);
    getMyReservations().then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id: number) => {
    try {
      await cancelReservation(id);
      load();
    } catch {}
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
    </div>
  );

  const tabs = [
    { key: 'active', label: 'Aktif', items: data?.activeReservations || [] },
    { key: 'past', label: 'Geçmiş', items: data?.pastReservations || [] },
    { key: 'cancelled', label: 'İptal', items: data?.cancelledReservations || [] },
  ];

  const current = tabs.find(t => t.key === tab)!;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rezervasyonlarım</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition
              ${tab === t.key ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {t.label} ({t.items.length})
          </button>
        ))}
      </div>

      {current.items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Calendar size={48} className="mx-auto mb-3 opacity-30" />
          <p>Rezervasyon yok</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {current.items.map(r => (
            <ReservationCard
              key={r.id}
              res={r}
              onCancel={tab === 'active' ? () => handleCancel(r.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
