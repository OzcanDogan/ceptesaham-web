import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllFields } from '../../api/footballField';
import { FootballField, parseServices, FIELD_SERVICES } from '../../types';
import { MapPin, Clock, Star, IndianRupee, Home } from 'lucide-react';

export default function FieldListPage() {
  const [fields, setFields] = useState<FootballField[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllFields().then(setFields).finally(() => setLoading(false));
  }, []);

  const filtered = fields.filter(f =>
    f.fieldName.toLowerCase().includes(search.toLowerCase()) ||
    (f.cityName || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sahalar</h1>
        <p className="text-gray-500">Size en yakın halı sahayı bulun</p>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Saha adı veya şehir ara..."
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">⚽</div>
          <p>Saha bulunamadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(field => {
            const services = parseServices(field.services);
            return (
              <div
                key={field.id}
                onClick={() => navigate(`/player/fields/${field.id}`)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden border border-gray-100"
              >
                <div className="bg-gradient-to-r from-green-500 to-green-700 h-32 flex items-center justify-center">
                  <span className="text-6xl">🏟️</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="font-bold text-gray-800 text-lg leading-tight">{field.fieldName}</h2>
                    {field.averageRating ? (
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-yellow-700">{field.averageRating.toFixed(1)}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
                    <MapPin size={14} />
                    <span>{field.cityName}{field.districtName ? `, ${field.districtName}` : ''}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                    <Clock size={14} />
                    <span>{field.startTime} - {field.endTime}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-green-700 font-bold text-lg">₺{field.hourlyPrice}</span>
                      <span className="text-gray-400 text-sm">/saat</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${field.isIndoor ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {field.isIndoor ? 'Kapalı' : 'Açık'}
                    </span>
                  </div>

                  {services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {services.slice(0, 3).map(id => (
                        <span key={id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {FIELD_SERVICES.find(s => s.id === id)?.label}
                        </span>
                      ))}
                      {services.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          +{services.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
