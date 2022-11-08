import React, { useState } from 'react';
import Forums from './pages/Forums';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

import { setContext } from '@apollo/client/link/context';

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');

  const renderPage = () => {
    if (currentPage === 'Forums') {
      return <Forums />;
    }
    if (currentPage === 'Lobby') {
      return <Lobby />;
    }
    return (
      <Home currentPage={currentPage} handlePageChange={handlePageChange} />
    );
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <ApolloProvider client={client}>
      <div>
        <Navbar currentPage={currentPage} handlePageChange={handlePageChange} />
        {renderPage()}
        <Footer />
      </div>
    </ApolloProvider>
  );
}
