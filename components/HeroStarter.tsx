'use client';

/**
 * 🎯 HERO STARTER - Versiunea simplă pentru cursanți
 *
 * Aceasta este versiunea MINIMALISTĂ de la care plecăm în curs.
 * Fără animații, fără video, fără JavaScript complex.
 * Doar HTML + Tailwind CSS = fundația de bază.
 */

export default function HeroStarter() {
  const scrollToFeatures = () => {
    const features = document.querySelector('#features');
    if (features) {
      const y = features.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const menu = document.querySelector('#meniu');
    if (menu) {
      const y = menu.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* VIDEO FUNDAL */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://videos.pexels.com/video-files/6769796/6769796-uhd_2560_1440_24fps.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY semi-transparent */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        {/* TITLU PRINCIPAL */}
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-white leading-tight"
          style={{
            textShadow: "0 4px 24px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.8)",
            animation: "fadeInUp 0.8s ease-out 0.5s both",
          }}
        >
          Aroma care te cheamă
        </h1>

        {/* SUBTITLU */}
        <p
          className="text-xl md:text-3xl lg:text-4xl mb-8 text-white/90"
          style={{
            textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            animation: "fadeInUp 0.8s ease-out 0.8s both",
          }}
        >
          O cafea, o poveste, un loc al tău
        </p>

        {/* BUTOANE CTA */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: "fadeInUp 0.8s ease-out 1.1s both" }}
        >
          {/* Buton Primary */}
          <a
            href="#meniu"
            onClick={scrollToMenu}
            className="inline-block px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Vezi Meniul
          </a>

          {/* Buton Secondary */}
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/10"
          >
            Vizitează-ne
          </a>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <button
        onClick={scrollToFeatures}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/75 hover:text-white transition-colors duration-300"
        style={{ animation: "fadeInUp 0.8s ease-out 1.5s both, bounce 1s ease-in-out 2.3s infinite" }}
        aria-label="Scroll în jos"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </section>
  );
}

