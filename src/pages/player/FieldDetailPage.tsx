import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllFields, getTimeSlots } from '../../api/footballField';
import { createReservation, confirmPayment } from '../../api/reservations';
import { FootballField, TimeSlotDto, parseServices, FIELD_SERVICES } from '../../types';
import { MapPin, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';

function formatDate(d: Date) {
  return d.toISOString().split('T')[0];
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export default function FieldDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [field, setField] = useState<FootballField | null>(null);
  const [slots, setSlots] = useState<TimeSlotDto[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [paying, setPaying] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getAllFields().then(fields => {
      const f = fields.find(x => x.id === Number(id));
      setField(f || null);
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getTimeSlots(Number(id), formatDate(selectedDate))
      .then(setSlots)
      .finally(() => setLoading(false));
  }, [id, selectedDate]);

  const handleBook = async (slotId: number) => {
    try {
      const r = await createReservation(slotId);
      setBookingId(r.id);
      setMsg('Rezervasyon oluşturuldu! Ödemeyi onaylayın.');
    } catch {
      setMsg('Rezervasyon başarısız.');
    }
  };

  const handlePay = async () => {
    if (!bookingId) return;
    setPaying(true);
    try {
      await confirmPayment(bookingId);
      setMsg('Ödeme onaylandı! Rezervasyonunuz tamamlandı.');
      setBookingId(null);
      getTimeSlots(Number(id), formatDate(selectedDate)).then(setSlots);
    } catch {
      setMsg('Ödeme başarısız. Cüzdan bakiyenizi kontrol edin.');
    } finally {
      setPaying(false);
    }
  };

  if (!field) return <div className="text-center py-16 text-gray-400">Saha bulunamadı</div>;

  const services = parseServices(field.services);
  const dateStr = selectedDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-4">
        <ChevronLeft size={20} /> Geri
      </button>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-700 h-48 flex items-center justify-center">
          <span className="text-8xl">🏟️</span>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{field.fieldName}</h1>
              <div className="flex items-center gap-1 text-gray-500 mt-1">
                <MapPin size={15} />
                <span className="text-sm">{field.address}, {field.districtName}, {field.cityName}</span>
              </div>
            </div>
            {field.averageRating ? (
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-xl">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-yellow-700">{field.averageRating.toFixed(1)}</span>
                <span className="text-xs text-yellow-600">({field.reviewCount})</span>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-green-700 font-bold text-xl">₺{field.hourlyPrice}</p>
              <p className="text-green-600 text-xs">/ saat</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-gray-700 font-medium text-sm">{field.startTime} - {field.endTime}</p>
              <p className="text-gray-500 text-xs">Çalışma Saatleri</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-gray-700 font-medium text-sm">{field.isIndoor ? 'Kapalı' : 'Açık'}</p>
              <p className="text-gray-500 text-xs">Tür</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-gray-700 font-medium text-sm">{field.ownerName || '-'}</p>
              <p className="text-gray-500 text-xs">Saha Sahibi</p>
            </div>
          </div>

          {services.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Hizmetler</p>
              <div className="flex flex-wrap gap-2">
                {services.map(id => (
                  <span key={id} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    {FIELD_SERVICES.find(s => s.id === id)?.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date picker */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setSelectedDate(d => addDays(d, -1))} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-bold text-gray-800 capitalize">{dateStr}</h2>
          <button onClick={() => setSelectedDate(d => addDays(d, 1))} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight size={20} />
          </button>
        </div>

        {msg && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${msg.includes('başarısız') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {msg}
            {bookingId && (
              <button
                onClick={handlePay}
                disabled={paying}
                className="ml-4 bg-green-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
              >
                {paying ? 'İşleniyor...' : 'Ödemeyi Onayla'}
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent" />
          </div>
        ) : slots.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Bu tarih için slot bulunamadı</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {slots.map(slot => {
              const available = slot.isAvailable && !slot.isBlockedByOwner;
              return (
                <button
                  key={slot.id}
                  disabled={!available}
                  onClick={() => available && handleBook(slot.id)}
                  className={`p-3 rounded-xl border text-sm font-medium transition
                    ${available
                      ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                      : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <div>{slot.startTime} - {slot.endTime}</div>
                  <div className="text-xs mt-0.5">{available ? 'Müsait' : 'Dolu'}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
