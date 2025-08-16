import BookCard from './BookCard';

function BookList({ books, userBooks, onStatusChange, loading }) {
  if (loading) return <div className="loading">Загрузка...</div>;
  if (!books.length) return <div className="no-results">Начните поиск книг</div>;

  return (
    <div className="book-list">
      {books.map(book => (
        <BookCard
          key={book.id}
          book={book}
          currentStatus={userBooks.find(b => b.bookId === book.id)?.status}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}

export default BookList;