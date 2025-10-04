// Create a new file: src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate with backend (e.g., POST to /login or /signup on FastAPI)
    // For now, simulate success and redirect to dashboard
    if (isLogin) {
      alert('Logged in successfully!'); // Replace with auth logic
    } else {
      alert('Signed up successfully!'); // Replace with auth logic
    }
    navigate('/'); // Redirect to dashboard
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              className="login-input"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="submit-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <p className="toggle-link">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="toggle-btn"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;