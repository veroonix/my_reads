import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

//const API_URL = 'http://localhost:1337';

function LoginPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.status === 'ok') {
        sessionStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setIsAuthenticated(true);
        navigate('/');
      //  navigate('/search');
      } else {
        setError(data.error || 'Please check your email and password');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      <AuthForm type="login" onSubmit={handleLogin} />
      <p className="auth-switch">
        Нет аккаунта?  <Link to="/auth/register" style={{ color: '#4f46e5', fontWeight: '500' }}>Зарегистрируйтесь</Link>
      </p>
    </>
  );
}

export default LoginPage;