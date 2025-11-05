import React, { useEffect, useMemo, useState } from 'react';
import { Search, User, Flag } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function DriverDirectory({ onSelect }) {
  const [query, setQuery] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API_BASE}/drivers`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load drivers (${res.status})`);
        const data = await res.json();
        if (!ignore) setDrivers(Array.isArray(data) ? data : data.items || []);
      } catch (e) {
        if (!ignore && e.name !== 'AbortError') setError('Unable to load drivers right now.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return drivers;
    return drivers.filter((d) =>
      [d.name, d.team, d.country, d.number?.toString()].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    );
  }, [query, drivers]);

  return (
    <section id="drivers" className="relative py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">Drivers</h2>
            <p className="text-white/70">Search and select a driver to view their live profile and car.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, team, or number"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="text-white/70">Loading drivers…</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((d) => (
                <li key={d.id}
                    className="group rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition p-4 cursor-pointer"
                    onClick={() => onSelect?.(d)}>
                  <div className="flex items-center gap-3">
                    {d.headshot ? (
                      <img src={d.headshot} alt={d.name} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-white/60" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white truncate">{d.name}</p>
                        {d.number && (
                          <span className="text-xs px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/80">#{d.number}</span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 truncate">{d.team || '—'}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-white/50">
                        <Flag className="h-3.5 w-3.5" />
                        <span>{d.country || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
