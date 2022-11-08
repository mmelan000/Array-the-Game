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
    } catch {}

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
          Success! You may now head <Link to="/"> back to the homepage.</Link>
        </p>
      ) : (
        <form onSubmit={loginFormHandler} className="form login-form">
          <div className="form-group">
            <label for="email-login">Email:</label>
            <input
              className="form-input"
              name="email"
              type="email"
              value={formState.email}
              id="username-login"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label for="password-login">Password:</label>
            <input
              className="form-input"
              name="password"
              type="password"
              value={formState.password}
              id="password-login"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <button className="login-form btn btn-primary" type="submit">
              Login
            </button>
          </div>
        </form>
      )}
      {error && (
        <div className="my-3 p-3 bg-danger text-white">{error.message}</div>
      )}
    </div>
  );
};

export default Login;
