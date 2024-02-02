// SignupForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send a POST request to your backend to handle user registration
      const response = await axios.post('/api/signup', {
        username,
        password,
        gender,
      });

      // Assuming your backend returns a success message
      alert(response.data.message);

      // Redirect to the login page
      history.push('/login');
    } catch (err) {
      setError('Error during registration');
    }
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h1 className="title">Signup</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input" placeholder="Username" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="Password" required />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" placeholder="Confirm Password" required />
          <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} className="input" placeholder="Gender" required />

          <div align="center">
            <button type="submit" className="button">
              <span>Signup</span>
            </button>
          </div>
        </form>
        <h1>{error}</h1>
      </div>
    </div>
  );
};

export default SignupForm;
