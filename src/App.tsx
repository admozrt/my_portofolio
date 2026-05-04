import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioPage } from './pages/PortfolioPage';
import { WeddingPageAjie } from './pages/WeddingPageAjie';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Portfolio (halaman utama) */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Undangan Pernikahan: /ajie&alya?to=NamaPengunjung */}
        <Route path="/ajie&alya" element={<WeddingPageAjie />} />
      </Routes>
    </Router>
  );
};

export default App;