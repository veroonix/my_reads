import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function RegisterPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRegister = async ({ name, email, password }) => {
    try {
      const response = await fetch(`/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (data.status === 'ok') {
        sessionStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setIsAuthenticated(true);
        navigate('/search');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      <AuthForm type="register" onSubmit={handleRegister} />
    </>
  );
}

export default RegisterPage;