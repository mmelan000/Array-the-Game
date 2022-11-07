import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import { Link } from 'react-router-dom';

const Signup = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [signUp, { error, data }] = useMutation(ADD_USER);

  const signUpFormHandler = async (event) => {
    event.preventDefault();

    setFormState({
      email: '',
      password: '',
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div>
      {data ? (
        <p>
          Success! You may now head <Link to='/'> back to the homepage.</Link>
        </p>
      ) : (
        <form onSubmit={signUpFormHandler} className='form signup-form'>
          <div className='form-group'>
            <label for='email-signup'>Email:</label>
            <input
              className='form-input'
              name='email'
              type='email'
              value={formState.email}
              id='email-signup'
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <label for='password-signup'>Password:</label>
            <input
              className='form-input'
              name='password'
              type='password'
              value={formState.password}
              id='password-signup'
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <button className='signup-form btn btn-primary' type='submit'>
              Sign Up
            </button>
          </div>
        </form>
      )}
      {error && (
        <div className='my-3 p-3 bg-danger text-white'>{error.message}</div>
      )}
    </div>
  );
};

export default Signup;
