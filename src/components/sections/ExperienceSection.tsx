import React from 'react';
import { experiences } from '../../data/experience';
import { Calendar, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="pengalaman" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Pengalaman</h2>
          <p className="text-gray-600 dark:text-gray-300">Perjalanan saya sebagai software engineer</p>
        </motion.div>

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical line (md+) */}
          <motion.div
            className="hidden md:block absolute left-8 top-6 bottom-6 w-0.5"
            style={{
              background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
            }}
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="relative md:pl-20"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Timeline dot (md+) */}
                <motion.div
                  className="hidden md:flex absolute left-5 top-8 w-6 h-6 rounded-full bg-blue-500 items-center justify-center ring-4 ring-gray-50 dark:ring-gray-800 z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </motion.div>

                {/* Card */}
                <motion.div
                  className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-xl shadow-lg"
                  whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.12)', y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-5">
                    {/* Left: Meta */}
                    <div className="md:w-2/5">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {exp.title}
                      </h3>
                      <h4 className="text-blue-600 dark:text-blue-400 font-semibold mb-3">
                        {exp.company}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{exp.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                    {/* Right: Details */}
                    <div className="md:w-3/5">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                        {exp.description}
                      </p>

                      <div className="mb-4">
                        <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                          Pencapaian
                        </h5>
                        <ul className="space-y-1.5">
                          {exp.achievements.map((achievement, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                            >
                              <Star className="w-3.5 h-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                          Teknologi
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.map((tech, idx) => (
                            <motion.span
                              key={idx}
                              className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                              whileHover={{ scale: 1.05 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
