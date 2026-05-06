import React, { useEffect, useState } from 'react';
import { getMyField, createField, updateField } from '../../api/footballField';
import { FootballField, FIELD_SERVICES } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import LocationPicker, { LocationValue } from '../../components/LocationPicker';
import '../../components/layout.css';

export default function MyFieldPage() {
  const [field, setField] = useState<FootballField | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [location, setLocation] = useState<LocationValue>({});
  const [form, setForm] = useState({
    fieldName: '', address: '', hourlyPrice: 100,
    startTime: '08:00', endTime: '23:00',
    isIndoor: false, services: [] as number[],
  });

  useEffect(() => {
    getMyField().then(f => {
      setField(f);
      const services = Array.isArray(f.services) ? f.services : (JSON.parse(f.services || '[]') as number[]);
      setLocation({ cityId: f.cityId, districtId: f.districtId, neighborhoodId: f.neighborhoodId });
      setForm({ fieldName: f.fieldName, address: f.address, hourlyPrice: f.hourlyPrice, startTime: f.startTime, endTime: f.endTime, isIndoor: f.isIndoor, services });
    }).catch(() => { setEditing(true); }).finally(() => setLoading(false));
  }, []);

  const toggleService = (id: number) => setForm(f => ({ ...f, services: f.services.includes(id) ? f.services.filter(s => s !== id) : [...f.services, id] }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      const payload = { ...form, cityId: location.cityId || 1, districtId: location.districtId || 1, neighborhoodId: location.neighborhoodId || 1 };
      if (field) { await updateField({ ...payload, id: field.id }); setMsg('Saha güncellendi!'); }
      else { await createField(payload); setMsg('Saha oluşturuldu!'); }
      const updated = await getMyField();
      setField(updated); setEditing(false);
    } catch { setMsg('İşlem başarısız.'); }
    finally { setSaving(false); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', fontSize: 14, background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 10, outline: 'none', color: '#111', boxSizing: 'border-box', fontFamily: 'inherit' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 };
  const focus = (e: React.FocusEvent<any>) => e.target.style.borderColor = '#22c55e';
  const blur  = (e: React.FocusEvent<any>) => e.target.style.borderColor = '#e5e7eb';

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: 0 }}>Saham</h1>
          <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{field ? field.fieldName : 'Saha oluştur'}</p>
        </div>
        {field && !editing && (
          <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '1.5px solid #e5e7eb', color: '#374151', borderRadius: 12, padding: '8px 16px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faEdit} style={{ fontSize: 14 }} /> Düzenle
          </button>
        )}
      </div>

      {msg && (
        <div style={{ padding: '10px 14px', borderRadius: 12, marginBottom: 16, fontSize: 13, fontWeight: 500, background: msg.includes('başarısız') ? '#fef2f2' : '#f0fdf4', color: msg.includes('başarısız') ? '#dc2626' : '#16a34a' }}>
          {msg}
        </div>
      )}

      {!editing && field ? (
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 56 }}>🏟️</span>
          </div>
          <div style={{ padding: 24 }}>
            {[
              { label: 'Saha Adı',          val: field.fieldName },
              { label: 'Adres',             val: field.address },
              { label: 'Şehir',             val: field.cityName },
              { label: 'Fiyat',             val: `₺${field.hourlyPrice}/saat`, green: true },
              { label: 'Çalışma Saatleri', val: `${field.startTime} – ${field.endTime}` },
              { label: 'Tür',               val: field.isIndoor ? 'Kapalı' : 'Açık' },
            ].map(({ label, val, green }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f9fafb' }}>
                <span style={{ fontSize: 13, color: '#9ca3af' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: green ? '#22c55e' : '#0f1117' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div><label style={lbl}>Saha Adı</label><input style={inp} value={form.fieldName} onChange={e => setForm(f => ({ ...f, fieldName: e.target.value }))} onFocus={focus} onBlur={blur} required /></div>

          <div>
            <label style={lbl}>Konum (İl / İlçe / Mahalle)</label>
            <LocationPicker value={location} onChange={setLocation} />
          </div>

          <div><label style={lbl}>Tam Adres</label><input style={inp} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} onFocus={focus} onBlur={blur} required placeholder="Sokak, bina no, kat..." /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={lbl}>Açılış Saati</label><input type="time" style={inp} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} onFocus={focus} onBlur={blur} /></div>
            <div><label style={lbl}>Kapanış Saati</label><input type="time" style={inp} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} onFocus={focus} onBlur={blur} /></div>
          </div>
          <div><label style={lbl}>Saatlik Fiyat (₺)</label><input type="number" style={inp} value={form.hourlyPrice} onChange={e => setForm(f => ({ ...f, hourlyPrice: Number(e.target.value) }))} onFocus={focus} onBlur={blur} /></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="indoor" checked={form.isIndoor} onChange={e => setForm(f => ({ ...f, isIndoor: e.target.checked }))} style={{ width: 16, height: 16, accentColor: '#22c55e' }} />
            <label htmlFor="indoor" style={{ fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer' }}>Kapalı Saha</label>
          </div>

          <div>
            <p style={{ ...lbl, marginBottom: 10 }}>Hizmetler</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FIELD_SERVICES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  style={{ fontSize: 13, padding: '7px 14px', borderRadius: 20, border: `1.5px solid ${form.services.includes(s.id) ? '#22c55e' : '#e5e7eb'}`, background: form.services.includes(s.id) ? '#22c55e' : '#fff', color: form.services.includes(s.id) ? '#fff' : '#6b7280', fontWeight: 500, cursor: 'pointer' }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {field && (
              <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, padding: 13, background: '#f9fafb', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                İptal
              </button>
            )}
            <button type="submit" disabled={saving} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 13, background: saving ? '#86efac' : '#22c55e', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}>
              <FontAwesomeIcon icon={faSave} style={{ fontSize: 15 }} /> {saving ? 'Kaydediliyor...' : field ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
