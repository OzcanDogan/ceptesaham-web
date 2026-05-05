import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllFields } from '../../api/footballField';
import { getMyReservations } from '../../api/reservations';
import { createPublicMatch } from '../../api/publicMatch';
import { FootballField, ReservationDto } from '../../types';
import { ChevronLeft } from 'lucide-react';

export default function CreateMatchPage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState<FootballField[]>([]);
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', teamSize: 5,
    footballFieldId: 0, reservationId: 0,
  });

  useEffect(() => {
    Promise.all([
      getAllFields(),
      getMyReservations(),
    ]).then(([f, r]) => {
      setFields(f);
      setReservations(r.activeReservations || []);
      if (f.length > 0) setForm(fr => ({ ...fr, footballFieldId: f[0].id }));
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        title: form.title,
        description: form.description,
        teamSize: form.teamSize,
        footballFieldId: form.footballFieldId || undefined,
        reservationId: form.reservationId || undefined,
      };
      const match = await createPublicMatch(payload);
      navigate(`/player/matches/${match.id}`);
    } catch {
      setMsg('Maç oluşturulamadı.');
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm";

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" /></div>;

  return (
    <div className="max-w-xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-4">
        <ChevronLeft size={20} /> Geri
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Maç Oluştur</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Maç Başlığı</label>
          <input className={inputClass} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="5x5 Maç - Kadıköy" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Açıklama</label>
          <textarea className={inputClass + ' resize-none h-24'} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Maç hakkında bilgi..." />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Takım Büyüklüğü</label>
          <select className={inputClass} value={form.teamSize} onChange={e => setForm(f => ({ ...f, teamSize: Number(e.target.value) }))}>
            {[3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}x{n}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Saha</label>
          <select className={inputClass} value={form.footballFieldId} onChange={e => setForm(f => ({ ...f, footballFieldId: Number(e.target.value) }))}>
            <option value={0}>Saha seç...</option>
            {fields.map(f => <option key={f.id} value={f.id}>{f.fieldName} - {f.cityName}</option>)}
          </select>
        </div>

        {reservations.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Rezervasyona Bağla (Opsiyonel)</label>
            <select className={inputClass} value={form.reservationId} onChange={e => setForm(f => ({ ...f, reservationId: Number(e.target.value) }))}>
              <option value={0}>Seçme</option>
              {reservations.map(r => <option key={r.id} value={r.id}>{r.footballFieldName} - {r.date} {r.startTime}</option>)}
            </select>
          </div>
        )}

        {msg && <p className="text-red-600 text-sm">{msg}</p>}

        <button type="submit" disabled={saving} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50">
          {saving ? 'Oluşturuluyor...' : 'Maç Oluştur'}
        </button>
      </form>
    </div>
  );
}
