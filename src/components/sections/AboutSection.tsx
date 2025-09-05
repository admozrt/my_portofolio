import React from 'react';
import { Github, Linkedin, Mail, MessageCircle, Phone } from 'lucide-react';
import { skills } from '../../data/skill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 max-w-8xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tentang Saya</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Kenali lebih jauh latar belakang dan keahlian saya</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Gambaran Profesional</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Saya adalah Pengembang Full Stack yang bersemangat dengan lebih dari 4 tahun pengalaman dalam 
              menciptakan aplikasi web yang robust dan scalable. Keahlian saya mencakup teknologi web modern, 
              dengan fokus khusus pada ekosistem Laravel dan React.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Saya percaya dalam menulis kode yang bersih dan mudah dipelihara serta menciptakan pengalaman 
              pengguna yang tidak hanya tampak hebat tetapi juga berkinerja luar biasa. Pendekatan saya 
              menggabungkan keunggulan teknis dengan pemecahan masalah kreatif untuk memberikan solusi 
              yang melampaui harapan.
            </p>
            
            <div id="kontak" className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Informasi Kontak
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Mail className="w-5 h-5 text-blue-500" />, text: 'admozart996@gmail.com', href: 'mailto:admozart996@gmail.com', label: 'Email' },
                  { icon: <Phone className="w-5 h-5 text-green-500" />, text: '+62 895-3622-60101', href: 'https://wa.me/62895362260101', label: 'WhatsApp' },
                  { icon: <Linkedin className="w-5 h-5 text-blue-600" />, text: 'Adi Rakhmatullah Ma\'arif', href: 'https://www.linkedin.com/in/adi-rakhmatullah-ma-arif-145b3723b', label: 'LinkedIn' },
                  { icon: <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />, text: 'admozart', href: 'https://github.com/admozrt', label: 'GitHub' }
                ].map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 group"
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      {contact.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{contact.label}</div>
                      <div className="text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {contact.text}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Keahlian Teknis</h3>
            <div className="space-y-4">
              {['Frontend', 'Backend', 'Database', 'Tools'].map((category) => (
                <div key={category} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{category}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {skills
                      .filter(skill => skill.category === category)
                      .map((skill, index) => (
                        <div key={index} className="group">
                          <div className="flex items-center gap-2 mb-2 w-full">
                            {skill.icon && (
                              <div className={`text-xl ${skill.color}`}>
                                {typeof skill.icon === 'object' && 'iconName' in skill.icon ? (
                                  <FontAwesomeIcon icon={skill.icon} />
                                ) : (
                                  skill.icon
                                )}
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{skill.name}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 group-hover:animate-pulse`}
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{skill.level}%</div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};