import React from 'react';
import { Github, Linkedin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { skills } from '../../data/skill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GithubActivity } from '../ui/GithubActivity';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const contactItems = [
  { icon: <Mail className="w-4 h-4" />, text: 'admozart996@gmail.com', href: 'mailto:admozart996@gmail.com', label: 'Email' },
  { icon: <Phone className="w-4 h-4" />, text: '+62 895-3622-60101', href: 'https://wa.me/62895362260101', label: 'WhatsApp' },
  { icon: <Linkedin className="w-4 h-4" />, text: "Adi Rakhmatullah Ma'arif", href: 'https://www.linkedin.com/in/adi-rakhmatullah-ma-arif-145b3723b', label: 'LinkedIn' },
  { icon: <Github className="w-4 h-4" />, text: 'admozart', href: 'https://github.com/admozrt', label: 'GitHub' },
];

const categories = ['Frontend', 'Backend', 'Database', 'Tools'] as const;

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Left-aligned header */}
        <motion.div
          className="mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Tentang Saya
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Latar belakang, keahlian, dan cara menghubungi saya.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Narrative + contact */}
          <motion.div
            className="lg:col-span-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.p variants={itemVariants} className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
              Saya Software Engineer dengan pengalaman lebih dari 4 tahun membangun aplikasi web
              yang tangguh dan skalabel, dengan keahlian utama pada ekosistem Laravel dan React.
            </motion.p>
            <motion.p variants={itemVariants} className="text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed">
              Saya berkomitmen menulis kode yang bersih dan mudah dipelihara, serta menciptakan
              pengalaman pengguna yang intuitif dan berkinerja tinggi.
            </motion.p>

            <motion.div variants={itemVariants} id="kontak" className="border-t border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800">
              {contactItems.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-3.5"
                >
                  <span className="text-zinc-400 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                    {contact.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs text-zinc-400 dark:text-zinc-500">{contact.label}</span>
                    <span className="block text-sm text-zinc-900 dark:text-white truncate">{contact.text}</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-accent-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Skills — grouped via dividers, no nested cards */}
          <div className="lg:col-span-7">
            <div className="space-y-8">
              {categories.map((category, catIdx) => {
                const items = skills.filter((s) => s.category === category);
                if (items.length === 0) return null;
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: catIdx * 0.08, ease: EASE }}
                  >
                    <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{category}</h3>
                      <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">{items.length}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                      {items.map((skill, index) => (
                        <SkillItem key={index} skill={skill} delay={index * 0.04} />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <GithubActivity />
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
      <div className="flex items-center gap-2 mb-2">
        {skill.icon && (
          <span className={`text-base ${skill.color}`}>
            {typeof skill.icon === 'object' && 'iconName' in skill.icon ? (
              <FontAwesomeIcon icon={skill.icon} />
            ) : (
              skill.icon
            )}
          </span>
        )}
        <span className="text-xs font-medium text-zinc-900 dark:text-white">{skill.name}</span>
        <span className="ml-auto text-[10px] font-mono text-zinc-400 dark:text-zinc-500">{skill.level}</span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          className="h-full rounded-full bg-accent-500"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay, ease: EASE }}
        />
      </div>
    </motion.div>
  );
};
