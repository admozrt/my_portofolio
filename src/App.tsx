import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioPage } from './pages/PortfolioPage';
import { WeddingPageAjie } from './pages/wedding/WeddingPageAjie';
import { WeddingPageBahranFatimatul } from './pages/wedding/WeddingPageBahranFatimatul';
import { WeddingPageAnggi } from './pages/wedding/WeddingPageAnggi';
import { WeddingPageTito } from './pages/wedding/WeddingPageTito';
import { WeddingPageDimasLaila } from './pages/wedding/WeddingPageDimasLaila';
import { WeddingPageAryaSekar } from './pages/wedding/WeddingPageAryaSekar';
import { WeddingPageRezaKirana } from './pages/wedding/WeddingPageRezaKirana';
import { WeddingProjectsPage } from './pages/WeddingProjectsPage';
import { InstitutionalSolutionsPage } from './pages/InstitutionalSolutionsPage';

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

        {/* Undangan Pernikahan: /tito-wina?to=NamaPengunjung */}
        <Route path="/tito-wina" element={<WeddingPageTito />} />

        {/* Undangan Pernikahan (Smartphone Simulation): /dimas-laila?to=NamaPengunjung */}
        <Route path="/dimas-laila" element={<WeddingPageDimasLaila />} />

        {/* Undangan Pernikahan (Elegan & Personal): /arya-sekar?to=NamaPengunjung */}
        <Route path="/arya-sekar" element={<WeddingPageAryaSekar />} />

        {/* Undangan Pernikahan (Duo Content Creator): /reza-kirana?to=NamaPengunjung */}
        <Route path="/reza-kirana" element={<WeddingPageRezaKirana />} />

        {/* Showcase proyek undangan pernikahan */}
        <Route path="/project-wedding" element={<WeddingProjectsPage />} />

        {/* Halaman solusi untuk klien institusional */}
        <Route path="/solusi-digital" element={<InstitutionalSolutionsPage />} />
      </Routes>
    </Router>
  );
};

export default App;