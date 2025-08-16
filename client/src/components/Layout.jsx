import { Link } from 'react-router-dom';
import SearchForm from './SearchForm';

function Layout({ children }) {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1><Link to="/">Book Finder</Link></h1>
        <nav>
          <Link to="/">Поиск</Link>
          <Link to="/my-books">Мои книги</Link>
        </nav>
        <SearchForm />
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;