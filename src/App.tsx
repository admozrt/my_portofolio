import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioPage } from './pages/PortfolioPage';
import { WeddingPage } from './pages/WeddingPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Portfolio (halaman utama) */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Undangan Pernikahan: /ajie&alyato?to=NamaPengunjung */}
        <Route path="/ajie&alya" element={<WeddingPage />} />
      </Routes>
    </Router>
  );
};

export default App;