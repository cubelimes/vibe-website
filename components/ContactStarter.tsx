/**
 * 📍 CONTACT STARTER - Secțiunea Contact + Hartă
 * Date de contact + embed Google Maps Deva
 */

export default function ContactStarter() {
  return (
    <section id="contact" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* TITLU SECȚIUNE */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Găsește-ne <span className="text-amber-700">în Deva</span>
          </h2>
          <p className="text-xl text-gray-600">Vino să ne vizitezi — te așteptăm cu o cafea caldă</p>
        </div>

        {/* GRID: DATE CONTACT + HARTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

          {/* DATE DE CONTACT */}
          <div className="bg-white rounded-3xl p-10 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Informații utile</h3>

              <div className="space-y-6">
                {/* Adresă */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Adresă</p>
                    <p className="text-gray-600">Strada Exemplu, Nr. 10<br />Deva, județul Hunedoara</p>
                  </div>
                </div>

                {/* Program */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🕐</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Program</p>
                    <p className="text-gray-600">Luni – Duminică: 10:00 – 22:00</p>
                  </div>
                </div>

                {/* Telefon */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Telefon</p>
                    <a href="tel:+40740000000" className="text-amber-700 hover:text-amber-600 transition-colors">
                      +40 740 000 000
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Email</p>
                    <a href="mailto:rezervari@vibecoffee.ro" className="text-amber-700 hover:text-amber-600 transition-colors">
                      rezervari@vibecoffee.ro
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-4">Ne găsești și pe:</p>
              <div className="flex gap-4">
                <a href="#" className="px-5 py-2.5 bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                  Instagram
                </a>
                <a href="#" className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* GOOGLE MAPS */}
          <div className="rounded-3xl overflow-hidden shadow-sm h-full min-h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22291.37742837554!2d22.88968!3d45.88371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4748703a52b1dcf1%3A0x3af46e0d1124d2e8!2sDeva!5e0!3m2!1sro!2sro!4v1700000000000!5m2!1sro!2sro"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '500px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
