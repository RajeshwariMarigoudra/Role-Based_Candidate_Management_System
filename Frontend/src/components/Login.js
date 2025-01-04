import React, { useState } from 'react';
import { login } from '../utils/api';
// import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
//   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      console.log('Login successful, data:', data);
      localStorage.setItem('token', data.token);
      console.log('Token stored:', data.token);
  
      if (data.user.role === 'user') {
        console.log('Redirecting to /profile');
        window.location.href = '/profile'; // Force full page reload
      } else {
        console.log('Redirecting to /dashboard');
        window.location.href = '/dashboard'; // Force full page reload
      }
    } catch (err) {
      setError('Invalid credentials');
      console.error('Login Error:', err);
    }
  };
  

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>} {/* Display error */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Handle email input change
            placeholder="Enter email"
          />
        </Form.Group>
        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Handle password input change
            placeholder="Enter password"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">Login</Button> {/* Login button */}
      </Form>
    </div>
  );
};

export default Login;
