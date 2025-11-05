import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/4Tf9WOIaWs6LOezG/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            F1 Live Hub
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/80">
            Live driver profiles, upcoming Grands Prix, race results, and immersive 3D car visuals — all in one professional dashboard.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="#drivers" className="px-5 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition">
              Explore Drivers
            </a>
            <a href="#schedule" className="px-5 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition">
              View Schedule
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
