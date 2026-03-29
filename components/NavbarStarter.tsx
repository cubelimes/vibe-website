'use client'

import { useState, useEffect } from 'react'

export default function NavbarStarter() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.querySelector(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          {/* Monogramă VC */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill={scrolled ? '#b45309' : 'rgba(255,255,255,0.15)'}/>
            {/* Abur stilizat */}
            <path d="M13 10 Q14 7 13 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"/>
            <path d="M18 10 Q19 7 18 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"/>
            <path d="M23 10 Q24 7 23 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"/>
            {/* Ceașcă simplă */}
            <path d="M10 12h16l-2 12H12L10 12Z" fill="white" fillOpacity="0.9"/>
            <path d="M26 15h2.5a2.5 2.5 0 0 1 0 5H26" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <rect x="8" y="25" width="20" height="2" rx="1" fill="white" fillOpacity="0.6"/>
          </svg>
          {/* Text logo */}
          <span className={`font-extrabold text-xl tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
            vibe<span className={`transition-colors ${scrolled ? 'text-amber-700' : 'text-amber-300'}`}>.</span>coffee
          </span>
        </a>

        {/* Links + Buton */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => scrollTo('#meniu')}
            className={`text-sm font-semibold transition-colors hover:opacity-70 ${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            Meniu
          </button>
          <button
            onClick={() => scrollTo('#despre')}
            className={`text-sm font-semibold transition-colors hover:opacity-70 ${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            Despre noi
          </button>
          <button
            onClick={() => scrollTo('#contact')}
            className={`text-sm font-semibold transition-colors hover:opacity-70 ${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            Locație
          </button>

          <a
            href="/rezervari"
            className="px-5 py-2 rounded-full text-sm font-semibold bg-amber-700 hover:bg-amber-600 text-white transition-all duration-300 hover:scale-105"
          >
            Rezervă Masă
          </a>
        </div>

      </div>
    </nav>
  )
}
