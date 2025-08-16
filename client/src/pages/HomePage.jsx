import  useBookSearch  from '../hooks/useBookSearch';
import  useUserBooks  from '../hooks/useUserBooks';
import BookList from '../components/BookList';

function HomePage() {
  const { searchResults, loading, error } = useBookSearch();
  const { userBooks, addBook } = useUserBooks();

  return (
    <div className="page-container">
      {error && <div className="error">{error}</div>}
      <BookList 
        books={searchResults}
        userBooks={userBooks}
        onStatusChange={addBook}
        loading={loading}
      />
    </div>
  );
}

export default HomePage;