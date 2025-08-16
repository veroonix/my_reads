import useUserBooks from '../hooks/useUserBooks';
import BookShelf from '../components/BookShelf';

function MyBooksPage() {
  const { userBooks, loading, error, updateBookStatus, deleteBook } = useUserBooks();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="page-container">
      <h2>Мои книги</h2>
      <BookShelf 
        books={userBooks}
        onStatusChange={updateBookStatus} 
        onDelete={deleteBook}
      />
    </div>
  );
}

export default MyBooksPage;