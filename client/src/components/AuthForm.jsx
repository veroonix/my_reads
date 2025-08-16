import { useState } from 'react';

function AuthForm({ type, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = type === 'login' 
      ? { email, password }
      : { name, email, password };
    onSubmit(formData);
  };

  return (
    <div className="auth-container">
      <h1>{type === 'login' ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit}>
        {type === 'register' && (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              required
            />
            <br />
          </>
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          
        />
        <br />
        <button 
  type="submit" 
  style={{
    backgroundColor: '#4f46e5', // цвет
    color: 'white',
    padding: '7px',
   
    borderRadius: '4px',
    
  }}
>
  {type === 'login' ? 'Войти' : 'Зарегистрироваться'}
</button>
      </form>
    </div>
  );
}

export default AuthForm;