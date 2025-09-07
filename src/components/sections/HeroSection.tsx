import React, { useState, useEffect } from 'react';
import { Code, Mail } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const roles = ['Pengembang Full Stack', 'Spesialis Laravel', 'Pengembang React', 'Sofware Engineer','IT Konsultan'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-grey-50 dark:from-gray-900 dark:via-gray-800 dark:to-grey-900">
      <div className="container mx-auto px-6 max-w-8xl">
        <div className="text-center mb-16">
          <div className="w-40 h-40 mx-auto mb-6 rounded-lg bg-gradient-to-br from-blue-500 to-grey-600 p-1">
            <div className="w-full h-full rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <img
                src="/my.jpg"
                alt="Adi Rakhmatullah"
                className="w-36 h-36 rounded-lg object-cover"
                />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-grey-600 to-cyan-600 bg-clip-text text-transparent">
              Adi Rakhmatullah
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Ma'arif</span>
          </h1>
          
          <div className="h-8 mb-6">
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
              {roles[currentRole]}
            </p>
          </div>
          
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Menghadirkan solusi inovatif dengan teknologi terkini. 
            Berfokus pada pengembangan aplikasi yang efisien dan mudah digunakan untuk mendukung pertumbuhan bisnis Anda.
            </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => document.getElementById('proyek')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-gradient-to-l from-blue-400 to-grey-600 dark:from-blue-500 to-blue-800 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Code className="w-5 h-5" />
              Lihat Karya Saya
            </button>
            <button 
              onClick={() => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-gradient-to-r from-blue-400 to-grey-600 dark:from-blue-500 to-blue-800 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Hubungi Saya
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">4+</div>
            <div className="text-gray-600 dark:text-gray-300">Tahun Pengalaman</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">20+</div>
            <div className="text-gray-600 dark:text-gray-300">Proyek Diselesaikan</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">6</div>
            <div className="text-gray-600 dark:text-gray-300">Klien Senang</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-red-500 mb-2">98%</div>
            <div className="text-gray-600 dark:text-gray-300">Tingkat Keberhasilan</div>
          </div>
        </div>
      </div>
    </section>
  );
};