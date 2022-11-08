import React, { useState } from 'react';
import Account from './pages/Account';
import Forums from './pages/Forums';
import Home from './pages/Home';
import LFG from './pages/LFG';
import Lobby from './pages/Lobby';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
    if (currentPage === 'Account') {
      return <Account />;
    }
    if (currentPage === 'Forums') {
      return <Forums />;
    }
    if (currentPage === 'LFG') {
      return <LFG />;
    }
    if (currentPage === 'Lobby') {
      return <Lobby />;
    }
    if (currentPage === 'Login') {
      return <Login />;
    }
    if (currentPage === 'Signup') {
      return <Signup />;
    }
    return <Home />;
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
