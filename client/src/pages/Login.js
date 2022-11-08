import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Login = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);
  const [toggleState, setToggleState] = useState(false);

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
        <Modal show={props.show} onHide={props.handleClose}>
          {toggleState ? (
            <>
              <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={loginFormHandler}>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      name='email'
                      type='email'
                      value={formState.email}
                      // controlid='email-login'
                      onChange={handleChange}
                      placeholder='Enter email'
                    />
                  </Form.Group>

                  <Form.Group className='mb-3' controlId='formBasicPassword'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name='password'
                      type='password'
                      value={formState.password}
                      // controlid='password-login'
                      onChange={handleChange}
                      placeholder='Password'
                    />
                  </Form.Group>
                  <Button variant='primary' type='submit'>
                    Sign Up
                  </Button>
                </Form>

                <a
                  href=''
                  data-bs-toggle='modal'
                  data-bs-target='#signup'
                  onClick={() => {
                    setToggleState(false);
                  }}
                >
                  Already have an account? Click here to Login!
                </a>
              </Modal.Body>
            </>
          ) : (
            <>
              <Modal.Header closeButton>
                <Modal.Title>Log In</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={loginFormHandler}>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      name='email'
                      type='email'
                      value={formState.email}
                      // controlid='email-login'
                      onChange={handleChange}
                      placeholder='Enter email'
                    />
                  </Form.Group>

                  <Form.Group className='mb-3' controlId='formBasicPassword'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name='password'
                      type='password'
                      value={formState.password}
                      // controlid='password-login'
                      onChange={handleChange}
                      placeholder='Password'
                    />
                  </Form.Group>
                  <Button variant='primary' type='submit'>
                    Log In
                  </Button>
                </Form>

                <a
                  href=''
                  data-bs-toggle='modal'
                  data-bs-target='#signup'
                  onClick={() => {
                    setToggleState(true);
                  }}
                >
                  Need an account? Click here to sign up!
                </a>
              </Modal.Body>
            </>
          )}
        </Modal>
      )}
      {error && (
        <div className='my-3 p-3 bg-danger text-white'>{error.message}</div>
      )}
    </div>
  );
};

export default Login;
