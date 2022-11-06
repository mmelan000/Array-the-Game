import React from 'react';

export default function Home() {
  console.log('Home.js');
  return (
    <div className='about-wrapper'>
      <div className='about-section fw-semibold'>
        <ul>
          <li className='list-group-item pt-4'>Welcome to [ ARRAY ]!</li>
          <li className='list-group-item pt-4'>
            A simple and fun game for all ages!
          </li>
          <li className='list-group-item pt-4'>
            Learn how to play below or start your own game!
          </li>
        </ul>
        <div className='button-container pt-5'>
          <button type='button' class='btn btn-success shadow fs-3 mx-2'>
            PLAY
          </button>
          <button type='button' class='btn btn-light shadow fs-3 mx-2'>
            LEARN
          </button>
        </div>
      </div>
    </div>
  );
}
