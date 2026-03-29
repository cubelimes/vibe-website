'use client';

/**
 * 🍵 MENU STARTER - Secțiunea "Meniul Nostru"
 * Tab-uri categorii + grid produse 3 coloane cu imagini
 */

import { useState, useEffect } from 'react';

const menuData = {
  Espresso: [
    { name: 'Espresso', price: 12, description: 'Shot dublu de espresso intens', image: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=600&auto=format&fit=crop&q=80' },
    { name: 'Americano', price: 14, description: 'Espresso diluat cu apă caldă', image: 'https://images.unsplash.com/photo-1580661869408-55ab23f2ca6e?w=600&auto=format&fit=crop&q=80' },
    { name: 'Cappuccino', price: 16, description: 'Espresso cu lapte spumat', image: 'https://images.unsplash.com/photo-1572097459836-9ba0b73bca31?w=600&auto=format&fit=crop&q=80' },
    { name: 'Flat White', price: 17, description: 'Microfoam mătăsos peste espresso', image: 'https://images.unsplash.com/photo-1574914629385-46448b767aec?w=600&auto=format&fit=crop&q=80' },
    { name: 'Latte', price: 17, description: 'Espresso cu lapte abundent', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80' },
  ],
  Specialty: [
    { name: 'Matcha Latte', price: 19, description: 'Ceai matcha japonez cu lapte cremos', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&auto=format&fit=crop&q=80' },
    { name: 'Turmeric Latte', price: 18, description: 'Lapte auriu cu turmeric și scorțișoară', image: 'https://images.unsplash.com/photo-1597792503334-92af8c97890b?w=600&auto=format&fit=crop&q=80' },
    { name: 'Cortado', price: 15, description: 'Espresso cu lapte în proporții egale', image: 'https://images.unsplash.com/photo-1519532059956-a63a37af5deb?w=600&auto=format&fit=crop&q=80' },
    { name: 'Latte Macchiato', price: 20, description: 'Aromă complexă, cremos', image: 'https://images.unsplash.com/photo-1689358931339-cf2ccd39e7b1?w=600&auto=format&fit=crop&q=80' },
    { name: 'AeroPress', price: 18, description: 'Extracție lentă, gust curat și pur', image: 'https://images.unsplash.com/photo-1712664436444-746b20ec5d8f?w=600&auto=format&fit=crop&q=80' },
    { name: 'Cold Latte', price: 19, description: 'Espresso răcit cu lapte și gheață', image: 'https://images.unsplash.com/photo-1653122025505-eb23942cf527?w=600&auto=format&fit=crop&q=80' },
  ],
  'Cold Brew': [
    { name: 'Cold Classic', price: 16, description: 'Infuzie la rece 24h, gust fin și răcoritor', image: 'https://images.unsplash.com/photo-1495221521568-8b714b2cb6fd?w=600&auto=format&fit=crop&q=80' },
    { name: 'Cold Brew Tonic', price: 18, description: 'Cold brew cu apă tonică și lămâie', image: 'https://images.unsplash.com/photo-1596323855852-6c6201ab1e9a?w=600&auto=format&fit=crop&q=80' },
    { name: 'Nitro Cold Brew', price: 20, description: 'Cold brew cu azot, textură cremoasă', image: 'https://images.unsplash.com/photo-1527156231393-7023794f363c?w=600&auto=format&fit=crop&q=80' },
    { name: 'Cold Brew Latte', price: 18, description: 'Cold brew cu lapte de ovăz și gheață', image: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?w=600&auto=format&fit=crop&q=80' },
    { name: 'Cold Caramel', price: 19, description: 'Cold brew cu sos de caramel artizanal', image: 'https://images.unsplash.com/photo-1658057542688-e32ef3883c85?w=600&auto=format&fit=crop&q=80' },
  ],
  Patiserie: [
    { name: 'Croissant', price: 12, description: 'Croissant cu unt, crocant și fraged', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80' },
    { name: 'Brioșe', price: 14, description: 'Brioșe cu ciocolată', image: 'https://images.unsplash.com/photo-1652284918792-fcc4d2e85de2?w=600&auto=format&fit=crop&q=80' },
    { name: 'Cookies', price: 10, description: 'Biscuiți cu ciocolată, copți în fiecare zi', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80' },
    { name: 'Cheesecake', price: 18, description: 'Cheesecake cremos cu fructe de pădure', image: 'https://images.unsplash.com/photo-1756550641128-ced5a4cf3e90?w=600&auto=format&fit=crop&q=80' },
    { name: 'Banana Bread', price: 14, description: 'Pâine cu banane, nuci și scorțișoară', image: 'https://images.unsplash.com/photo-1602483289282-f9c08b1f9992?w=600&auto=format&fit=crop&q=80' },
    { name: 'Brownie', price: 13, description: 'Brownie umed cu ciocolată și nuci pecan', image: 'https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?w=600&auto=format&fit=crop&q=80' },
  ],
};

type Category = keyof typeof menuData;
const categories: Category[] = ['Espresso', 'Specialty', 'Cold Brew', 'Patiserie'];

export default function MenuStarter() {
  const [activeTab, setActiveTab] = useState<Category>('Espresso');
  const [visible, setVisible] = useState(true);

  const handleTabChange = (category: Category) => {
    if (category === activeTab) return;
    setVisible(false);
    setTimeout(() => {
      setActiveTab(category);
      setVisible(true);
    }, 200);
  };

  return (
    <section id="meniu" className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* TITLU SECȚIUNE */}
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Meniul <span className="text-amber-700">Nostru</span>
          </h2>
          <p className="text-xl text-gray-600">Preparate cu grijă, servite cu drag</p>
        </div>

        {/* TAB-URI CATEGORII */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleTabChange(category)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                activeTab === category
                  ? 'bg-amber-700 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* GRID PRODUSE */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
        >
          {menuData[activeTab].map((product) => (
            <div
              key={product.name}
              className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Imagine 4:3 */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                />
              </div>
              {/* Text */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <span className="text-amber-700 font-bold text-lg ml-2 whitespace-nowrap">{product.price} RON</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
