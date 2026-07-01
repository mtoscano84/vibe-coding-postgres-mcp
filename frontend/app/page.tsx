'use client'

import React, { useState, useEffect } from 'react';
import { fetchRestaurants, Restaurant } from './actions';

// Helper to render modern developer-themed category icons
const getCategoryIcon = (category: string) => {
  const baseClass = "w-10 h-10 text-indigo-400 group-hover:text-cyan-400 transition-colors duration-300";
  switch (category?.toLowerCase()) {
    case 'cafe':
      // Coffee/Cafe cup icon
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 12a5.5 5.5 0 11-11 0V9h11v3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 9V5a2 2 0 114 0v4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 9h1a2.5 2.5 0 012.5 2.5v1a2.5 2.5 0 01-2.5 2.5h-1" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 20h13" />
        </svg>
      );
    case 'bistro':
      // Burger/Bistro icon
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 18h14a1 1 0 001-1v-1a5 5 0 00-10 0H7a5 5 0 00-5 5v1a1 1 0 001 1z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C7.58 2 4 4.69 4 8h16c0-3.31-3.58-6-8-6z" />
        </svg>
      );
    default:
      // Fork/Knife/Restaurant icon
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      );
  }
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchRestaurants(query);
      setRestaurants(data);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col items-center p-8 font-sans antialiased">

      <header className="w-full max-w-4xl text-center mb-16 mt-12 flex flex-col items-center">
        {/* Modern typographic/SVG logo for developers */}
        <div className="w-24 h-24 mb-6 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 p-0.5">
          <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
            <svg className="w-12 h-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-100 to-cyan-100">
          Berlin AI Gastronomy Guide
        </h1>
        <p className="text-lg text-slate-400 font-mono tracking-wide">
          Less algorithm, more <span className="text-cyan-400 font-bold">currywurst</span>
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-12">

        {/* Sleek Search Input */}
        <div className="bg-[#111827] p-1.5 rounded-2xl border border-slate-800 shadow-xl focus-within:border-indigo-500/50 transition-colors">
          <form
            className="flex flex-col sm:flex-row gap-2"
            onSubmit={handleSearch}
          >
            <div className="flex-1 flex items-center px-4 gap-3">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search where to eat in Berlin (e.g. cozy place in Kreuzberg)..."
                className="w-full py-3 bg-transparent focus:outline-none text-slate-100 placeholder-slate-500 font-medium text-base font-sans"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md shadow-indigo-500/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0B0F19]"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-mono">
            No restaurants found matching "{query}"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {restaurants.map((item) => (
              <div
                key={item.id}
                className="group bg-[#111827] rounded-2xl overflow-hidden border border-slate-800/85 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image container */}
                <div className="h-48 bg-[#0B0F19]/60 flex items-center justify-center relative border-b border-slate-800/80 overflow-hidden">
                  <img
                    src={item.image_path}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="text-[11px] bg-[#0B0F19]/80 text-indigo-300 border border-indigo-500/30 font-mono font-semibold px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1">
                      {item.name}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Location Footer */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-slate-300 font-bold group-hover:text-cyan-400 transition-colors duration-200">
                      {item.neighborhood}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <footer className="mt-24 mb-8 text-center text-slate-600 text-xs font-mono">
        © 2026 Berlin AI Gastronomy Guide. Coded with <span className="text-red-500/60">♥</span> using Antigravity.
      </footer>
    </div>
  );
}