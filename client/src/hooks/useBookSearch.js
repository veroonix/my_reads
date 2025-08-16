import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchWithAuth } from '../utils/authFetch';

function useBookSearch() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Автоматический поиск при открытии URL с параметром ?q=
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      searchBooks(query);
    }
  }, [location.search]);

  const searchBooks = async (searchTerm, userBooks = []) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWithAuth(`/api/books/search?title=${encodeURIComponent(searchTerm)}`);
      
      if (data.items) {
        const mergedResults = data.items.map(item => ({
          ...item,
          status: userBooks.find(book => book.bookId === item.id)?.status || null
        }));
        setSearchResults(mergedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setError("Не удалось загрузить книги. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return { searchResults, loading, error, searchBooks };
}

export default useBookSearch;