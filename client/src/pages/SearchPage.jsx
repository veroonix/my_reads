import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import  useBookSearch  from '../hooks/useBookSearch';
import BookList from '../components/BookList';

function SearchPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');
  const { searchResults, loading, error, searchBooks } = useBookSearch();

  useEffect(() => {
    if (query) {
      searchBooks(query);
    }
  }, [query]);

  return (
    <div className="search-page">
      {error && <div className="error-message">{error}</div>}
      <BookList books={searchResults} loading={loading} />
    </div>
  );
}

export default SearchPage;