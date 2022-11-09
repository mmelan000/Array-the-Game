import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Forums from './pages/Forums';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import SingleThought from './pages/SingleThought';
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
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className='main-body'>
          <Navbar />
          <div className='main-display'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/lobby/:id' element={<Lobby />} />
              <Route path='/forums' element={<Forums />} />
              <Route path='/thoughts/:thoughtId' element={<SingleThought />} />
            </Routes>
          </div>
          <Footer year={new Date().getFullYear()} />
        </div>
      </Router>
    </ApolloProvider>
  );
}
