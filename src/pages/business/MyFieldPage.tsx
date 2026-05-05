import React, { useEffect, useState } from 'react';
import { getMyField, createField, updateField } from '../../api/footballField';
import { FootballField, FIELD_SERVICES } from '../../types';
import { Building2, Edit, Save } from 'lucide-react';

const CITIES = [{ id: 1, name: 'İstanbul' }, { id: 2, name: 'Ankara' }, { id: 3, name: 'İzmir' }];

export default function MyFieldPage() {
  const [field, setField] = useState<FootballField | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    fieldName: '', cityId: 1, districtId: 1, neighborhoodId: 1,
    address: '', hourlyPrice: 100, startTime: '08:00', endTime: '23:00',
    isIndoor: false, services: [] as number[],
  });

  useEffect(() => {
    getMyField().then(f => {
      setField(f);
      const services = Array.isArray(f.services) ? f.services : (JSON.parse(f.services || '[]') as number[]);
      setForm({
        fieldName: f.fieldName, cityId: f.cityId, districtId: f.districtId,
        neighborhoodId: f.neighborhoodId, address: f.address, hourlyPrice: f.hourlyPrice,
        startTime: f.startTime, endTime: f.endTime, isIndoor: f.isIndoor, services,
      });
    }).catch(() => {
      setEditing(true);
    }).finally(() => setLoading(false));
  }, []);

  const toggleService = (id: number) => {
    setForm(f => ({
      ...f,
      services: f.services.includes(id) ? f.services.filter(s => s !== id) : [...f.services, id],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      if (field) {
        await updateField({ ...form, id: field.id });
        setMsg('Saha güncellendi!');
      } else {
        await createField(form);
        setMsg('Saha oluşturuldu!');
      }
      const updated = await getMyField();
      setField(updated);
      setEditing(false);
    } catch {
      setMsg('İşlem başarısız.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm";

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Saham</h1>
          <p className="text-gray-500">{field ? field.fieldName : 'Saha oluştur'}</p>
        </div>
        {field && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50"
          >
            <Edit size={16} /> Düzenle
          </button>
        )}
      </div>

      {msg && (
        <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${msg.includes('başarısız') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </div>
      )}

      {!editing && field ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-xl h-36 flex items-center justify-center mb-2">
            <span className="text-6xl">🏟️</span>
          </div>
          {[
            { label: 'Saha Adı', val: field.fieldName },
            { label: 'Adres', val: field.address },
            { label: 'Şehir', val: field.cityName },
            { label: 'Fiyat', val: `₺${field.hourlyPrice}/saat` },
            { label: 'Çalışma Saatleri', val: `${field.startTime} - ${field.endTime}` },
            { label: 'Tür', val: field.isIndoor ? 'Kapalı' : 'Açık' },
          ].map(({ label, val }) => (
            <div key={label} className="flex justify-between border-b border-gray-50 pb-3">
              <span className="text-gray-500 text-sm">{label}</span>
              <span className="font-medium text-gray-800 text-sm">{val}</span>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Saha Adı</label>
            <input className={inputClass} value={form.fieldName} onChange={e => setForm(f => ({ ...f, fieldName: e.target.value }))} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Adres</label>
            <input className={inputClass} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Açılış Saati</label>
              <input type="time" className={inputClass} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Kapanış Saati</label>
              <input type="time" className={inputClass} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Saatlik Fiyat (₺)</label>
            <input type="number" className={inputClass} value={form.hourlyPrice} onChange={e => setForm(f => ({ ...f, hourlyPrice: Number(e.target.value) }))} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="indoor" checked={form.isIndoor} onChange={e => setForm(f => ({ ...f, isIndoor: e.target.checked }))} className="w-4 h-4" />
            <label htmlFor="indoor" className="text-sm font-medium text-gray-700">Kapalı Saha</label>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Hizmetler</p>
            <div className="flex flex-wrap gap-2">
              {FIELD_SERVICES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={`text-sm px-3 py-1.5 rounded-xl border transition ${form.services.includes(s.id) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            {field && (
              <button type="button" onClick={() => setEditing(false)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50">
                İptal
              </button>
            )}
            <button type="submit" disabled={saving} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
              <Save size={16} /> {saving ? 'Kaydediliyor...' : field ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
