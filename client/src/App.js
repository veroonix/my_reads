import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/MySearchPage';
import HomePage from './pages/HomePage';
import MyBooksPage from './pages/MyBooksPage';
import BookPage from './pages/BookPage';
import { useState, useEffect } from 'react';
import "./styles/App.css";

// Компонент шапки с навигацией
function Header({ isAuthenticated, logout }) {
  const location = useLocation();
  
  // Не показывать шапку на страницах входа/регистрации
  if (['/login', '/register', '/auth'].includes(location.pathname)) {
    return null;
  }

  return (
    <header className="app-header">
      <h1 className="logo">
        <Link to="/" className="logo-link">My reads</Link>
      </h1>
      <nav className="main-nav">
        <div className="nav-links">
          <Link to="/search" className="nav-link">Поиск</Link>
          <Link to="/my-books" className="nav-link">Мои книги</Link>
        </div>
        {isAuthenticated && (
          <button onClick={logout} className="auth-button logout">Выйти</button>
        )}
      </nav>
    </header>
  );
}

// Функция проверки аутентификации
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  return { isAuthenticated, setIsAuthenticated };
}

function AuthPage({ setIsAuthenticated }) {
  return (
    <div className="auth-container">
      
      
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  // Функция выхода
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} logout={logout} />
      
      <Routes>
        <Route path="/auth/*" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage setIsAuthenticated={setIsAuthenticated} />} />

        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage setIsAuthenticated={setIsAuthenticated} />} />

        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/auth/login" replace />} />
        <Route path="/search" element={isAuthenticated ? <SearchPage /> : <Navigate to="/auth/login" replace />} />
        <Route path="/my-books" element={isAuthenticated ? <MyBooksPage /> : <Navigate to="/auth/login" replace />} />
        <Route path="/books/:bookId" element={isAuthenticated ? <BookPage /> : <Navigate to="/auth/login" replace />} />

        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
