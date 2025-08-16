//import { getStatusLabel } from "../utils/helpers";
import { getStatusLabel } from "../utils/helpers";
import { Link } from 'react-router-dom'; // Добавить импорт
import DropdownMenu from "./DropdownMenu";

function BookCard({ book,  currentStatus, onStatusChange, onDelete, isInCollection = false }) {
  const bookInfo = book.volumeInfo;
  const bookId = book.id;

  const statusOptions = [
    { value: 'planned', label: 'Запланировано' },
    { value: 'reading', label: 'Читаю' },
    { value: 'finished', label: 'Прочитано' },
    { value: 'favourites', label: 'Избранное' }
  ];

   const handleChange = (e) => {
    onStatusChange(bookId, e.target.value); // Вызываем функцию обновления статуса
  };

  const handleDelete = () => {
    if(window.confirm("Вы уверены, что хотите удалить книгу из коллекции?")) {
      onDelete(bookId);
    }
  };

  return (
    <div className="book-card">
      {isInCollection && (
        <div className="card-header">
          <DropdownMenu
            trigger={<span className="menu-dots">⋮</span>}
          >
            <button 
              className="menu-item delete"
              onClick={handleDelete}
            >
              Удалить
            </button>
          </DropdownMenu>
        </div>
      )}
       {/* Обернуть кликабельную область в Link */}
      <Link to={`/books/${bookId}`} className="book-card-content">
        <div className="book-cover">
          {bookInfo.imageLinks?.thumbnail ? (
            <img 
              src={bookInfo.imageLinks.thumbnail.replace("http://", "https://")} 
              alt={bookInfo.title}
            />
          ) : (
            <div className="no-cover">Обложка отсутствует</div>
          )}
        </div>
        
        <div className="book-details">
          <h3 className="book-title">{bookInfo.title}</h3>
          <p className="book-authors">
            {bookInfo.authors?.join(", ") }
          </p>
          <p className="book-rating">
            {bookInfo.averageRating 
              ? `★ ${bookInfo.averageRating}/5` 
              : ""}
          </p>
        </div>
      </Link>

      <div className="status-control">
        <select
          value={currentStatus}
          onChange={handleChange}
          className="status-select"
        >
          <option value="">Выберите статус</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default BookCard;