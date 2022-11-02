import React, { useState } from 'react';
import Account from './pages/Account';
import Forums from './pages/Forums';
import Home from './pages/Home';
import LFG from './pages/LFG';
import Lobby from './pages/Lobby';

export default function PortfolioContainer() {
  const [currentPage, setCurrentPage] = useState('Home');

  const renderPage = () => {
    if (currentPage === 'Contact') {
      return <Contact />;
    }
    if (currentPage === 'Front') {
      return <Front />;
    }
    if (currentPage === 'Back') {
      return <Back />;
    }
    if (currentPage === 'Full') {
      return <Full />;
    }
    if (currentPage === 'Resume') {
      return <Resume />;
    }
    return <Home />;
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div>
      <NavTabs currentPage={currentPage} handlePageChange={handlePageChange} />
      {renderPage()}
      <Footer />
    </div>
  );
}
