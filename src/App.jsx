import React, { useMemo, useState } from 'react';
import Hero from './components/Hero';
import DriverDirectory from './components/DriverDirectory';
import DriverProfile from './components/DriverProfile';
import Schedule from './components/Schedule';

export default function App() {
  const [selected, setSelected] = useState(null);
  const hasSelection = useMemo(() => !!selected, [selected]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Hero />

      <main className="relative">
        <DriverDirectory onSelect={setSelected} />
        {hasSelection && <DriverProfile driver={selected} />}
        <Schedule />
      </main>

      <footer className="border-t border-white/10 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/60 text-sm">
          <p>© {new Date().getFullYear()} F1 Live Hub. Unofficial fan project.</p>
          <p>Data updates automatically from the connected API.</p>
        </div>
      </footer>
    </div>
  );
}
