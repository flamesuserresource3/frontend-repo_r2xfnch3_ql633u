import React, { useEffect, useState } from 'react';
import { Car, User, Trophy, Calendar, Globe } from 'lucide-react';
import Spline from '@splinetool/react-spline';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function DriverProfile({ driver }) {
  const [detail, setDetail] = useState(null);
  const [tab, setTab] = useState('driver');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!driver) return;
    let ignore = false;
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API_BASE}/drivers/${driver.id}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to load driver');
        const data = await res.json();
        if (!ignore) setDetail(data);
      } catch (e) {
        if (!ignore && e.name !== 'AbortError') setError('Unable to load driver details.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [driver]);

  if (!driver) return null;

  const driverModel = detail?.driverSplineUrl || driver.driverSplineUrl;
  const carModel = detail?.carSplineUrl || driver.carSplineUrl;

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-4">
              {driver.headshot ? (
                <img src={driver.headshot} alt={driver.name} className="h-20 w-20 rounded-xl object-cover" />)
                : (
                <div className="h-20 w-20 rounded-xl bg-white/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-white/60" />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-2xl font-semibold text-white">{driver.name}</h3>
                <p className="text-white/60">{driver.team || '—'} {driver.number ? `• #${driver.number}` : ''}</p>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <Stat icon={Trophy} label="Podiums" value={detail?.stats?.podiums ?? '—'} />
                  <Stat icon={Trophy} label="Wins" value={detail?.stats?.wins ?? '—'} />
                  <Stat icon={Calendar} label="Starts" value={detail?.stats?.starts ?? '—'} />
                  <Stat icon={Globe} label="Nationality" value={driver.country || '—'} />
                </div>
              </div>
            </div>

            {loading && <p className="mt-4 text-white/70">Loading profile…</p>}
            {error && <p className="mt-4 text-red-400">{error}</p>}
          </div>

          <div className="w-full lg:w-[520px]">
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="flex">
                <button onClick={() => setTab('driver')} className={`flex-1 px-4 py-2 text-sm ${tab==='driver' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'}`}>Driver 3D</button>
                <button onClick={() => setTab('car')} className={`flex-1 px-4 py-2 text-sm ${tab==='car' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'}`}><span className="inline-flex items-center gap-2"><Car className="h-4 w-4"/>Car 3D</span></button>
              </div>
              <div className="h-[360px] relative">
                {tab === 'driver' ? (
                  driverModel ? (
                    <Spline scene={driverModel} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Empty3D label="Driver 3D model not available." />
                  )
                ) : (
                  carModel ? (
                    <Spline scene={carModel} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Empty3D label="Car 3D model not available." />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 p-3">
      <div className="flex items-center gap-2 text-white/60 text-xs">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="mt-1 text-white font-medium">{value}</div>
    </div>
  );
}

function Empty3D({ label }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/0 to-white/0">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
          <Car className="h-6 w-6 text-white/60" />
        </div>
        <p className="mt-3 text-white/70 text-sm">{label}</p>
        <p className="text-white/60 text-xs">Select another driver or add a Spline URL via the API.</p>
      </div>
    </div>
  );
}
