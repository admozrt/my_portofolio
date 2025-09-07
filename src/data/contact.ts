import React from 'react';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import type { ContactInfo } from '../types';

export const contactInfo: ContactInfo[] = [
  {
    icon: React.createElement(Mail, { className: "w-5 h-5 text-blue-500" }),
    text: 'adrakhmat996@gmail.com',
    href: 'mailto:admozart996@gmail.com',
    label: 'Email'
  },
  {
    icon: React.createElement(Phone, { className: "w-5 h-5 text-green-500" }),
    text: '+62 895-3622-60101',
    href: 'https://wa.me/62895362260101',
    label: 'WhatsApp'
  },
  {
    icon: React.createElement(Linkedin, { className: "w-5 h-5 text-blue-600" }),
    text: 'Adi Rakhmatullah Ma\'arif',
    href: 'https://www.linkedin.com/in/adi-rakhmatullah-ma-arif-145b3723b',
    label: 'LinkedIn'
  },
  {
    icon: React.createElement(Github, { className: "w-5 h-5 text-gray-700 dark:text-gray-300" }),
    text: 'admozart',
    href: 'https://github.com/admozrt',
    label: 'GitHub'
  }
];