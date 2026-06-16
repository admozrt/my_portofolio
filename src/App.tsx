import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioPage } from './pages/PortfolioPage';
import { WeddingPageAjie } from './pages/wedding/WeddingPageAjie';
import { WeddingPageBahranFatimatul } from './pages/wedding/WeddingPageBahranFatimatul';
import { WeddingPageAnggi } from './pages/wedding/WeddingPageAnggi';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Portfolio (halaman utama) */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Undangan Pernikahan: /ajie-alya?to=NamaPengunjung */}
        <Route path="/ajie-alya" element={<WeddingPageAjie />} />

        {/* Undangan Pernikahan: /ilmi-zahro?to=NamaPengunjung (ayah mempelai wanita: Rahmatullah) */}
        <Route path="/ilmi-zahra" element={<WeddingPageBahranFatimatul brideFather="Rohim" />} />

        {/* Undangan Pernikahan: /zahra-ilmi?to=NamaPengunjung (ayah mempelai wanita: Rohim) */}
        <Route path="/zahra-ilmi" element={<WeddingPageBahranFatimatul brideFather="Rohim" brideFirst />} />

        {/* Undangan Pernikahan: /anggi-rezza?to=NamaPengunjung */}
        <Route path="/anggi-rezza" element={<WeddingPageAnggi />} />
      </Routes>
    </Router>
  );
};

export default App;