import React, { useState } from 'react';
import logo from '../images/Logo.png';
import Login from '../pages/Login';

function Navbar({ currentPage, handlePageChange }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <nav className='navbar navbar-expand-lg fs-1 text-light'>
      <div className='container-fluid'>
        <div
          id='array-brand'
          onClick={() => handlePageChange('Home')}
          className={currentPage === 'Home'}
          href='#home'
        >
          [
          <img
            className='logo'
            src={logo}
            alt="Array the game logo a diamond shape with 4 colors (yellow at the top, green to the right, blue to the bottom, red to the left) and the letter 'A' in front"
          />
          RRAY ]
        </div>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div
          className='collapse navbar-collapse justify-content-end'
          id='navbarNav'
        >
          <ul className='navbar-nav d-flex justify-content-center align-items-end'>
            <li className='nav-item'>
              <button type='button' className='btn btn-dark mx-2'>
                <div
                  onClick={() => handlePageChange('Forums')}
                  className={currentPage === 'Forums'}
                  href='#Forums'
                >
                  Forums
                </div>
              </button>
            </li>
            <li className='nav-item'>
              <button type='button' className='btn btn-dark mx-2'>
                <div
                  onClick={() => handlePageChange('Lobby')}
                  className={currentPage === 'Lobby'}
                  href='#Lobby'
                >
                  Lobby
                </div>
              </button>
            </li>
            <li className='nav-item'>
              <button type='button' className='btn btn-dark mx-2'>
                <div
                  onClick={() => handleShow()}
                  className={currentPage === 'Login'}
                  href='#Login'
                  data-bs-toggle='modal'
                  data-bs-target='#login'
                >
                  Login / Sign Up
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Login show={show} handleClose={handleClose} />
    </nav>
  );
}

export default Navbar;
