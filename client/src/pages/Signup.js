import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

const Signup = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [signUp, { error, data }] = useMutation(ADD_USER);

  const signUpFormHandler = async (event) => {
    event.preventDefault();

    try {
      const { data } = await signUp({
        variables: { ...formState },
      });

      console.log(data);

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

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
        <div
          className='modal'
          id='signUp'
          tabIndex='-1'
          aria-labelledby='staticBackdropLabel'
          aria-hidden='false'
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-body'>
                <form onSubmit={signUpFormHandler} className='form login-form'>
                  <div className='d-flex flex-row justify-content-between'>
                    <h1 className='d-inline h3 mb-3 fw-normal'>Log In</h1>
                    <button
                      type='button'
                      className='btn-close'
                      data-bs-dismiss='modal'
                      aria-label='Close'
                    ></button>
                  </div>

                  <div className='form-floating mb-3'>
                    <input
                      className='form-input'
                      name='email'
                      type='email'
                      value={formState.email}
                      id='email-signUp'
                      onChange={handleChange}
                    />
                    <label htmlFor='email-signUp'>Email</label>
                  </div>
                  <div className='form-floating mb-3'>
                    <input
                      className='form-input'
                      name='password'
                      type='password'
                      value={formState.password}
                      id='password-signUp'
                      onChange={handleChange}
                    />
                    <label htmlFor='password-signUp'>Password</label>
                  </div>

                  <button
                    className='w-100 btn btn-lg btn-primary mb-3 signUp-form'
                    type='submit'
                  >
                    Log In
                  </button>

                  <a href='' data-bs-toggle='modal' data-bs-target='#login'>
                    Need an account? Click here to sign up!
                  </a>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className='my-3 p-3 bg-danger text-white'>{error.message}</div>
      )}
    </div>
  );
};

export default Signup;
