import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

const Login = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  const loginFormHandler = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
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

  // Collect values from the login form
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
          id='login'
          tabIndex='-1'
          aria-labelledby='staticBackdropLabel'
          aria-hidden='false'
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-body'>
                <form onSubmit={loginFormHandler} className='form login-form'>
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
                      id='email-login'
                      onChange={handleChange}
                    />
                    <label htmlFor='email-login'>Email</label>
                  </div>
                  <div className='form-floating mb-3'>
                    <input
                      className='form-input'
                      name='password'
                      type='password'
                      value={formState.password}
                      id='password-login'
                      onChange={handleChange}
                    />
                    <label htmlFor='password-login'>Password</label>
                  </div>

                  <button
                    className='w-100 btn btn-lg btn-primary mb-3 login-form'
                    type='submit'
                  >
                    Log In
                  </button>

                  <a href='' data-bs-toggle='modal' data-bs-target='/Signup'>
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

export default Login;
