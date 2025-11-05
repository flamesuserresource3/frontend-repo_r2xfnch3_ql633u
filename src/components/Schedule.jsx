import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Trophy } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function Schedule() {
  const [tab, setTab] = useState('upcoming');
  const [upcoming, setUpcoming] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError('');
        const [a, b] = await Promise.all([
          fetch(`${API_BASE}/events/upcoming`, { signal: controller.signal }),
          fetch(`${API_BASE}/events/recent`, { signal: controller.signal }),
        ]);
        if (!a.ok || !b.ok) throw new Error('Failed to load schedule');
        const [aData, bData] = await Promise.all([a.json(), b.json()]);
        if (!ignore) {
          setUpcoming(Array.isArray(aData) ? aData : aData.items || []);
          setRecent(Array.isArray(bData) ? bData : bData.items || []);
        }
      } catch (e) {
        if (!ignore && e.name !== 'AbortError') setError('Unable to load schedule right now.');
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

  const list = tab === 'upcoming' ? upcoming : recent;

  return (
    <section id="schedule" className="py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">Grand Prix Schedule</h2>
          <div className="inline-flex rounded-lg bg-white/5 border border-white/10 overflow-hidden">
            <button onClick={() => setTab('upcoming')} className={`px-4 py-2 text-sm ${tab==='upcoming' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'}`}>Upcoming</button>
            <button onClick={() => setTab('recent')} className={`px-4 py-2 text-sm ${tab==='recent' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'}`}>
              <span className="inline-flex items-center gap-2"><Trophy className="h-4 w-4"/>Results</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-white/70">Loading schedule…</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : list.length === 0 ? (
            <p className="text-white/60">No data available.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((e) => (
                <li key={e.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-medium truncate">{e.name}</div>
                    <div className="text-xs text-white/60">Round {e.round || '—'}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-sm text-white/70">
                    <Calendar className="h-4 w-4"/>
                    <span>{formatDateRange(e.startDate, e.endDate)}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-white/70">
                    <MapPin className="h-4 w-4"/>
                    <span>{e.location || '—'}</span>
                  </div>
                  {tab === 'recent' && e.result && (
                    <div className="mt-3 rounded-lg bg-white/5 border border-white/10 p-3">
                      <div className="text-xs uppercase tracking-wide text-white/60">Winner</div>
                      <div className="text-white font-medium">{e.result.winner || '—'}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-white/60"><Clock className="h-3.5 w-3.5"/>Time {e.result.time || '—'}</div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function formatDateRange(a, b) {
  try {
    const d1 = a ? new Date(a) : null;
    const d2 = b ? new Date(b) : null;
    if (d1 && d2) return `${d1.toLocaleDateString()} – ${d2.toLocaleDateString()}`;
    if (d1) return d1.toLocaleDateString();
    if (d2) return d2.toLocaleDateString();
    return '—';
  } catch {
    return '—';
  }
}
