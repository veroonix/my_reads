import { useState } from 'react';
import BookCard from './BookCard';

const STATUSES = {
  planned: 'Запланировано',
  reading: 'Читаю',
  finished: 'Прочитано',
  favourites: 'Избранное'
};

function BookShelf({ books, onStatusChange, onDelete }) {
  return (
    <div className="books-grid">
      {books.map(book => (
        <BookCard
          key={book.bookId}
          book={{
            id: book.bookId,
            volumeInfo: {
              title: book.title,
              authors: book.authors?.split(', '),
              imageLinks: { thumbnail: book.cover }
            }
          }}
          currentStatus={book.status}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          isInCollection={true}
        />
      ))}
    </div>
  );
}

export default BookShelf;