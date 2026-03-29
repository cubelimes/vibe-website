'use client';

/**
 * ✨ FEATURES STARTER - Secțiunea "De ce Vibe Coffee?"
 * Layout Bento Grid: 1 card mare stânga + 2 carduri mici dreapta
 */

import { useEffect, useRef, useState } from 'react';

const cards = [
  {
    emoji: '☕',
    title: 'Cafea de Specialitate',
    description: 'Boabe selectate din cele mai renumite regiuni ale lumii, prăjite artizanal și preparate cu grijă de baristele noastre. Fiecare ceașcă este o experiență în sine.',
    image: 'https://images.unsplash.com/photo-1622240644058-86d737f0b3ce?w=800&auto=format&fit=crop&q=80',
  },
  {
    emoji: '🥐',
    title: 'Patiserie Artizanală',
    description: 'Preparate proaspete în fiecare dimineață, cu ingrediente naturale și rețete tradiționale. Perfecte alături de cafeaua ta preferată.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80',
  },
  {
    emoji: '🌿',
    title: 'Ambient Relaxant',
    description: 'Un spațiu gândit pentru confort și liniște, unde timpul pare să stea pe loc. Locul perfect pentru o pauză bine meritată.',
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2070&auto=format&fit=crop',
  },
];

export default function FeaturesStarter() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleCards(prev => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }, index * 200);
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(ref);
      return observer;
    });

    return () => observers.forEach(o => o?.disconnect());
  }, []);

  return (
    <section id="features" className="py-12 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* TITLU SECȚIUNE */}
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            De ce <span className="text-amber-700">Vibe Coffee?</span>
          </h2>
          <p className="text-xl text-gray-600">
            Experiență unică, ingrediente premium, atmosferă perfectă
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CARD MARE - stânga (card 0) */}
          <div
            ref={el => { cardRefs.current[0] = el; }}
            className={`group bg-white rounded-3xl shadow-sm overflow-hidden cursor-pointer hover:shadow-xl flex flex-col
              ${visibleCards[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ height: '1050px', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease' }}
          >
            {/* Imagine (40%) */}
            <div style={{ height: '45%' }} className="overflow-hidden flex-shrink-0">
              <img
                src={cards[0].image}
                alt={cards[0].title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {/* Text (55%) */}
            <div className="p-6 flex flex-col justify-center flex-1">
              <div className="text-3xl mb-2">{cards[0].emoji}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{cards[0].title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{cards[0].description}</p>
            </div>
          </div>

          {/* COLOANA DREAPTA - 2 carduri mici */}
          <div className="flex flex-col gap-4">

            {/* CARD MIC - sus (card 1) */}
            <div
              ref={el => { cardRefs.current[1] = el; }}
              className={`group bg-white rounded-3xl shadow-sm overflow-hidden cursor-pointer hover:shadow-xl flex flex-col
                ${visibleCards[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ height: '517px', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease' }}
            >
              {/* Imagine (45%) */}
              <div style={{ height: '45%' }} className="overflow-hidden flex-shrink-0">
                <img
                  src={cards[1].image}
                  alt={cards[1].title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              {/* Text (55%) */}
              <div className="px-5 py-3 flex flex-col justify-center flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cards[1].emoji} {cards[1].title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{cards[1].description}</p>
              </div>
            </div>

            {/* CARD MIC - jos (card 2) */}
            <div
              ref={el => { cardRefs.current[2] = el; }}
              className={`group bg-white rounded-3xl shadow-sm overflow-hidden cursor-pointer hover:shadow-xl flex flex-col
                ${visibleCards[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ height: '517px', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease' }}
            >
              {/* Imagine (45%) */}
              <div style={{ height: '45%' }} className="overflow-hidden flex-shrink-0">
                <img
                  src={cards[2].image}
                  alt={cards[2].title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              {/* Text (55%) */}
              <div className="px-5 py-3 flex flex-col justify-center flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cards[2].emoji} {cards[2].title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{cards[2].description}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
