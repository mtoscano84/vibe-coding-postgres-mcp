'use client'

import React, { useState } from 'react';

// Mock data for State 0 (Berlin)
const mockRestaurants = [
  {
    id: 1,
    name: "Burgermeister Schlesisches Tor (MOCK)",
    neighborhood: "Kreuzberg",
    description: "An authentic spot in the heart of Kreuzberg, ideal to grab a burger or kebab after a night out.",
    category: "Restaurant"
  },
  {
    id: 2,
    name: "Cafe Zeit für Brot (MOCK)",
    neighborhood: "Mitte",
    description: "Famous for its warm cinnamon buns and its cozy vibe. A must-visit in Mitte.",
    category: "Cafe"
  },
  {
    id: 3,
    name: "Mustafa's Gemüse Kebab (MOCK)",
    neighborhood: "Kreuzberg",
    description: "The best option in Kreuzberg to enjoy döner kebab with garlic sauce with friends.",
    category: "Bistro"
  }
];

export default function Home() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2C2523] flex flex-col items-center p-8 font-sans">

      <header className="w-full max-w-4xl text-center mb-12 mt-8">
        {/* Logo Castizo traditional de azulejo pintado */}
        <div className="w-44 h-44 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#c59b27]/80 p-1">
          <img
            src="/logo.png"
            alt="Berlin AI Gastronomy Guide Logo"
            className="w-40 h-40 object-contain rounded-full"
          />
        </div>
        <h1 className="text-5xl font-serif font-extrabold mb-4 text-[#8c1c2b] tracking-tight">
          Berlin AI Gastronomy Guide
        </h1>
        <p className="text-xl text-[#c59b27] font-serif italic font-bold">
          Less algorithm, more currywurst
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-10">

        {/* Search Input con Botón - Estilo Castizo */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#c59b27]/30 backdrop-blur-sm relative">
          
          <form
            className="flex gap-4 relative z-10"
            onSubmit={(e) => {
              e.preventDefault(); // Evita recargar la página en el mock
              console.log("Mock Search Triggered:", query);
            }}
          >
            <input
              type="text"
              placeholder="Search where to eat in Berlin..."
              className="flex-1 p-4 border border-[#c59b27]/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c1c2b] focus:border-transparent text-[#2C2523] bg-[#FCFBF9] transition-all placeholder-gray-600 font-bold shadow-inner font-sans"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* Botón de Búsqueda tradicional */}
            <button
              type="submit"
              className="px-8 py-4 bg-[#8c1c2b] hover:bg-[#701622] text-white font-serif font-extrabold rounded-xl transition-colors shadow-md border border-[#c59b27]/50 focus:outline-none focus:ring-2 focus:ring-[#c59b27] focus:ring-offset-2 focus:ring-offset-[#FAF6F0]"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results Grid con MOCK Data - Estilo Castizo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockRestaurants.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#c59b27]/25 hover:border-[#8c1c2b]/70 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-sm"
            >
              <div className="h-48 bg-[#FAF6F0] flex items-center justify-center relative border-b border-[#c59b27]/20">
                {/* Logo en cuadrado blanco (Placeholder de la tarjeta) */}
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center border border-[#c59b27]/40 shadow-sm p-1">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-16 h-16 object-contain rounded-full"
                  />
                </div>
                {/* Etiqueta Categoría estilo Badge Castizo */}
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-[#F9F6F0] text-[#8c1c2b] border-2 border-[#8c1c2b]/60 font-serif font-extrabold px-3 py-1 rounded-full shadow-sm">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <h2 className="text-2xl font-serif font-extrabold text-[#2C2523] mb-2 group-hover:text-[#8c1c2b] transition-colors">
                    {item.name}
                  </h2>
                  <p className="text-[#2C2523] text-sm font-semibold mb-4 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
                <div className="text-sm text-[#8c1c2b] flex items-center gap-2 font-extrabold">
                  <span>📍</span>
                  <span className="text-[#2C2523] font-bold group-hover:text-[#8c1c2b] transition-colors font-sans">
                    {item.neighborhood}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      <footer className="mt-20 mb-10 text-center text-gray-600 text-sm font-serif font-bold italic">
        © 2026 Berlin AI Gastronomy Guide. Coded with Vibe.
      </footer>
    </div>
  );
}