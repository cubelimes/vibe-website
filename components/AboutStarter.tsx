'use client';

/**
 * 🏡 ABOUT STARTER - Secțiunea "Despre noi"
 * Layout: imagine stânga + text dreapta (2 coloane pe desktop)
 */

import { useEffect, useRef, useState } from 'react';

export default function AboutStarter() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="despre" className="py-20 px-6 bg-white">
      <div
        ref={sectionRef}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >

        {/* IMAGINE */}
        <div
          className={`rounded-3xl overflow-hidden shadow-lg transition-all duration-700 ${
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          <img
            src="https://images.unsplash.com/photo-1667038408487-e1c0abb5aca8?q=80&w=1170&auto=format&fit=crop"
            alt="Interior Vibe Caffè"
            className="w-full h-full object-cover aspect-[4/3]"
          />
        </div>

        {/* TEXT */}
        <div
          className={`transition-all duration-700 delay-200 ${
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Povestea <span className="text-amber-700">noastră</span>
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-5">
            Vibe Caffè s-a născut dintr-o dragoste sinceră pentru cafea bună și locuri cu suflet. Am deschis ușile într-un colțișor liniștit al orașului, cu un singur gând: să creăm un spațiu unde fiecare vizitator să se simtă acasă.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mb-5">
            Fiecare ceașcă pe care o pregătim poartă în ea munca și pasiunea baristelor noștri — oameni care cred că o cafea bună poate schimba tonul unei întregi zile. Boabele noastre sunt selectate cu grijă din origine, prăjite artizanal și preparate după rețete rafinate în timp.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed">
            Nu suntem doar o cafenea. Suntem locul unde se nasc conversații, se termină cărți și încep idei noi. Vino să ne cunoști — te așteptăm cu o cafea caldă și un zâmbet sincer.
          </p>

          <div className="mt-8 flex gap-8">
            <div>
              <p className="text-4xl font-bold text-amber-700">3+</p>
              <p className="text-gray-500 text-sm mt-1">Ani de experiență</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-amber-700">12+</p>
              <p className="text-gray-500 text-sm mt-1">Tipuri de cafea</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-amber-700">∞</p>
              <p className="text-gray-500 text-sm mt-1">Momente speciale</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
