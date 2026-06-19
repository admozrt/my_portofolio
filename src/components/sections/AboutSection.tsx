import React from 'react';
import { Github, Linkedin, Mail, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { skills } from '../../data/skill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const contactItems = [
  {
    icon: <Mail className="w-5 h-5 text-blue-500" />,
    text: 'admozart996@gmail.com',
    href: 'mailto:admozart996@gmail.com',
    label: 'Email',
  },
  {
    icon: <Phone className="w-5 h-5 text-green-500" />,
    text: '+62 895-3622-60101',
    href: 'https://wa.me/62895362260101',
    label: 'WhatsApp',
  },
  {
    icon: <Linkedin className="w-5 h-5 text-blue-600" />,
    text: "Adi Rakhmatullah Ma'arif",
    href: 'https://www.linkedin.com/in/adi-rakhmatullah-ma-arif-145b3723b',
    label: 'LinkedIn',
  },
  {
    icon: <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
    text: 'admozart',
    href: 'https://github.com/admozrt',
    label: 'GitHub',
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Tentang Saya</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Kenali lebih jauh latar belakang dan keahlian saya
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Left: About text + Contact */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h3
              variants={itemVariants}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Gambaran
            </motion.h3>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"
            >
              Saya adalah seorang Software Engineer berpengalaman lebih dari 4 tahun dalam
              mengembangkan aplikasi web yang tangguh dan skalabel. Saya menguasai berbagai teknologi
              web modern, dengan keahlian utama pada ekosistem Laravel dan React.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
            >
              Saya berkomitmen untuk menulis kode yang bersih, efisien, dan mudah dipelihara, serta
              menciptakan pengalaman pengguna yang intuitif dan berkinerja tinggi.
            </motion.p>

            <motion.div
              variants={itemVariants}
              id="kontak"
              className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl"
            >
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Informasi Kontak
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contactItems.map((contact, index) => (
                  <motion.a
                    key={index}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 group"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {contact.icon}
                    </motion.div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{contact.label}</div>
                      <div className="text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {contact.text}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Skills */}
          <div>
            <motion.h3
              className="text-2xl font-bold text-gray-900 dark:text-white mb-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Keahlian
            </motion.h3>

            <div className="space-y-4">
              {(['Frontend', 'Backend', 'Database', 'Tools'] as const).map(
                (category, catIdx) => (
                  <motion.div
                    key={category}
                    className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: catIdx * 0.1 }}
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide">
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {skills
                        .filter((skill) => skill.category === category)
                        .map((skill, index) => (
                          <SkillItem key={index} skill={skill} delay={index * 0.05} />
                        ))}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillItem: React.FC<{ skill: any; delay: number }> = ({ skill, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
    >
      <motion.div
        className="flex items-center gap-2 mb-2"
        whileHover={{ x: 2 }}
      >
        {skill.icon && (
          <motion.div
            className={`text-lg ${skill.color}`}
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.4 }}
          >
            {typeof skill.icon === 'object' && 'iconName' in skill.icon ? (
              <FontAwesomeIcon icon={skill.icon} />
            ) : (
              skill.icon
            )}
          </motion.div>
        )}
        <span className="text-xs font-medium text-gray-900 dark:text-white">{skill.name}</span>
      </motion.div>

      <div className="skill-bar-track">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay, ease: 'easeOut' }}
        />
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{skill.level}%</div>
    </motion.div>
  );
};
