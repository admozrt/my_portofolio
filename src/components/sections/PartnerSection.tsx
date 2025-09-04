import React from "react";
import { partners} from "../../data/partner";

export const PartnersSection: React.FC = () => (
  <section id="mitra" className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="container mx-auto px-6 max-w-8xl">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Mitra & Klien</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{partner.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{partner.relationship}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);