import React from "react";
import { contactInfo } from "../../data/contact";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="container mx-auto px-6 max-w-8xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Adi Rakhmatullah Ma'arif
            </h3>
            <p className="text-gray-400 mb-4">
              Pengembang Full Stack yang bersemangat menciptakan solusi web inovatif dengan teknologi modern.
            </p>
            <div className="flex gap-4">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {contact.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Tentang</button></li>
              <li><button onClick={() => document.getElementById('pengalaman')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Pengalaman</button></li>
              <li><button onClick={() => document.getElementById('proyek')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Proyek</button></li>
              <li><button onClick={() => document.getElementById('mitra')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Mitra</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Teknologi</h4>
            <div className="flex flex-wrap gap-2">
              {['Laravel', 'React', 'PHP', 'JavaScript', 'MySQL', 'Docker'].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Adi Rakhmatullah Ma'arif, S.Kom</p>
        </div>
      </div>
    </footer>
  );
};