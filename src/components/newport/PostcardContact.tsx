import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { contactInfo } from '../../data/contact';
import { contactIconFor } from './contactIcons';
import { LIFT, REVEAL } from './motion';

export const PostcardContact: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <section id="kontak" className="px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={REVEAL}
        className="border border-zine-rule bg-zine-card px-6 py-8 shadow-[0_5px_0_rgba(31,30,28,0.06)] dark:border-zine-rule-dark dark:bg-zine-card-dark dark:shadow-[0_5px_0_rgba(0,0,0,0.25)] sm:px-10 sm:py-11"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <h2 className="np-hand text-[26px] text-zine-ink dark:text-zine-ink-dark sm:text-[32px]">
                Kontak
              </h2>
              <p className="mt-3 max-w-[42ch] text-[14px] leading-relaxed text-zine-ink-soft dark:text-zine-ink-soft-dark">
                Punya sistem yang perlu dibangun atau diperbaiki? Kirim pesan lewat salah satu kontak berikut. Biasanya saya balas dalam satu hari kerja.
              </p>
            </div>

            {/* Same portrait the main portfolio uses, taped in like a print. */}
            <motion.figure
              animate={{ rotate: reduce ? 0 : -2.2 }}
              whileHover={reduce ? undefined : { rotate: 0, scale: 1.02 }}
              transition={LIFT}
              className="relative m-0 w-[132px] self-start border border-zine-rule bg-zine-paper p-2 pb-7 shadow-[0_4px_0_rgba(31,30,28,0.07)] dark:border-zine-rule-dark dark:bg-zine-paper-dark dark:shadow-[0_4px_0_rgba(0,0,0,0.3)] sm:w-[150px]"
            >
              <span className="np-tape" aria-hidden="true" />
              <img
                src="/my.png"
                alt="Adi Rakhmatullah Ma'arif"
                draggable={false}
                className="block aspect-[3/4] w-full object-cover"
              />
              <figcaption className="np-hand absolute inset-x-0 bottom-1.5 text-center text-[12.5px] text-zine-ink-soft dark:text-zine-ink-soft-dark">
                Adi R. Ma'arif
              </figcaption>
            </motion.figure>
          </div>

          <div className="divide-y divide-zine-rule dark:divide-zine-rule-dark">
            {contactInfo.map((contact, i) => {
              const Icon = contactIconFor(contact.label);
              return (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={contact.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group flex items-center gap-3.5 py-3.5"
                >
                  <motion.span
                    whileHover={reduce ? undefined : { scale: 1.12 }}
                    transition={LIFT}
                    className="text-zine-pen dark:text-zine-pen-dark"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-zine-ink-soft dark:text-zine-ink-soft-dark">
                      {contact.label}
                    </span>
                    <span className="block truncate text-[13.5px] text-zine-ink dark:text-zine-ink-dark">
                      {contact.text}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 flex-none text-zine-ink-soft transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-zine-ink-soft-dark" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
