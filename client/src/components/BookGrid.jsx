import BookCard from "./BookCard";
function BookGrid({ books, onStatusChange }) {
  return (
    <div className="books-grid">
      {books.map((item) => (
        <BookCard 
          key={item.id || item.volumeInfo.title}
          book={item}
          currentStatus={item.status}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}

export default BookGrid;