import React, { useState } from 'react';

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
