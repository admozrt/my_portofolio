import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioPage } from './pages/PortfolioPage';
import { WeddingPageAjie } from './pages/wedding/WeddingPageAjie';
import { WeddingPageBahranFatimatul } from './pages/wedding/WeddingPageBahranFatimatul';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Portfolio (halaman utama) */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Undangan Pernikahan: /ajie-alya?to=NamaPengunjung */}
        <Route path="/ajie-alya" element={<WeddingPageAjie />} />

        {/* Undangan Pernikahan: /bahran-fatimatul?to=NamaPengunjung */}
        <Route path="/ilmi-zahro" element={<WeddingPageBahranFatimatul />} />
      </Routes>
    </Router>
  );
};

export default App;