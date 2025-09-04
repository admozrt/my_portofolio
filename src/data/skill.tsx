import React from 'react';
import {
  faLaravel,
  faReact,
  faPhp,
  faJs,
  faDocker,
  faHtml5,
  faCss3Alt,
  faGitAlt,
  faNpm,
  faBootstrap,
  faJsSquare,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { Skill } from '../types';

// TypeScript Icon component (since react-icons isn't available)
const TypeScriptIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="currentColor"
    width="1em" 
    height="1em"
  >
    <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.496.502 24 1.125 24h21.75c.623 0 1.125-.504 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
  </svg>
);

// TailwindCSS Icon component
const TailwindIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="currentColor"
    width="1em" 
    height="1em"
  >
    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C7.666,17.818,9.027,19.2,12.001,19.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
  </svg>
);

export const skills: Skill[] = [
  { icon: faLaravel, name: 'Laravel', color: 'text-red-500', level: 92, category: 'Backend' },
  { icon: faReact, name: 'React', color: 'text-cyan-500', level: 88, category: 'Frontend' },
  { icon: faPhp, name: 'PHP', color: 'text-indigo-500', level: 95, category: 'Backend' },
  { icon: faPhp, name: 'Laminas', color: 'text-orange-500', level: 80, category: 'Backend' },
  { icon: faPhp, name: 'CodeIgniter', color: 'text-green-500', level: 80, category: 'Backend' },
  
  { icon: faDatabase, name: 'MySQL', color: 'text-blue-700', level: 95, category: 'Database' },
  { icon: faDatabase, name: 'Oracle', color: 'text-orange-600', level: 70, category: 'Database' },
  { icon: faHtml5, name: 'HTML5', color: 'text-orange-500', level: 95, category: 'Frontend' },
  { icon: faCss3Alt, name: 'CSS3', color: 'text-blue-500', level: 92, category: 'Frontend' },
  { icon: faBootstrap, name: 'Bootstrap', color: 'text-purple-500', level: 88, category: 'Frontend' },
  { icon: faJs, name: 'JavaScript', color: 'text-yellow-500', level: 85, category: 'Frontend' },
  { icon: faJsSquare, name: 'JQuery', color: 'text-yellow-500', level: 87, category: 'Frontend' },
  { 
    icon: <TypeScriptIcon className="text-lg" />, 
    name: 'TypeScript', 
    color: 'text-blue-600', 
    level: 80, 
    category: 'Frontend' 
  },
  { 
    icon: <TailwindIcon className="text-lg" />, 
    name: 'TailwindCSS', 
    color: 'text-sky-500', 
    level: 90, 
    category: 'Frontend' 
  },
  { icon: faDocker, name: 'Docker', color: 'text-blue-600', level: 78, category: 'Tools' },
  { icon: faGitAlt, name: 'Git', color: 'text-orange-600', level: 75, category: 'Tools' },
  { icon: faGithub, name: 'Github', color: 'text-red-600', level: 88, category: 'Tools' },
  { icon: faNpm, name: 'NPM', color: 'text-red-600', level: 85, category: 'Tools' },
];