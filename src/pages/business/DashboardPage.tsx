import React, { useEffect, useState } from 'react';
import { getMyField, getBusinessReservations } from '../../api/footballField';
import { FootballField, BusinessReservationDto } from '../../types';
import { Building2, Calendar, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [field, setField] = useState<FootballField | null>(null);
  const [reservations, setReservations] = useState<BusinessReservationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMyField().catch(() => null),
      getBusinessReservations().catch(() => []),
    ]).then(([f, r]) => {
      setField(f);
      setReservations(r as BusinessReservationDto[]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
    </div>
  );

  const today = new Date().toISOString().split('T')[0];
  const todayRes = reservations.filter(r => r.date?.startsWith(today));
  const totalRevenue = reservations.filter(r => r.status === 'Completed').reduce((s, r) => s + (r.totalPrice || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Sahanızın özeti</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Calendar, label: 'Bugünkü Rezervasyon', val: todayRes.length, color: 'bg-blue-500' },
          { icon: Users, label: 'Toplam Rezervasyon', val: reservations.length, color: 'bg-green-500' },
          { icon: TrendingUp, label: 'Toplam Gelir', val: `₺${totalRevenue.toFixed(0)}`, color: 'bg-purple-500' },
          { icon: Building2, label: 'Saha Durumu', val: field ? 'Aktif' : 'Kurulmadı', color: 'bg-orange-500' },
        ].map(({ icon: Icon, label, val, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm p-5">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{val}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {!field ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Henüz Saha Yok</h2>
          <p className="text-gray-500 mb-4">İlk sahanızı oluşturun ve rezervasyonları almaya başlayın.</p>
          <button
            onClick={() => navigate('/business/my-field')}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700"
          >
            Saha Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Saha Bilgileri</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Ad</span>
                <span className="font-medium text-gray-800 text-sm">{field.fieldName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Konum</span>
                <span className="font-medium text-gray-800 text-sm">{field.cityName}, {field.districtName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Fiyat</span>
                <span className="font-medium text-green-700 text-sm">₺{field.hourlyPrice}/saat</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Saatler</span>
                <span className="font-medium text-gray-800 text-sm">{field.startTime} - {field.endTime}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Bugünkü Rezervasyonlar</h2>
            {todayRes.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Bugün rezervasyon yok</p>
            ) : (
              <div className="space-y-2">
                {todayRes.map(r => (
                  <div key={r.reservationId} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{r.startTime} - {r.endTime}</p>
                      <p className="text-xs text-gray-500">{r.playerEmail}</p>
                    </div>
                    <span className="text-sm font-bold text-green-700">₺{r.totalPrice}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
