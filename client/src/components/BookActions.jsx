function BookActions({ onStatusChange }) {
  return (
    <div className="book-actions">
      <button 
        onClick={() => onStatusChange("planned")}
        className="action-btn planned"
      >
        Хочу прочитать
      </button>
      <button 
        onClick={() => onStatusChange("reading")}
        className="action-btn reading"
      >
        Читаю
      </button>
      <button 
        onClick={() => onStatusChange("finished")}
        className="action-btn finished"
      >
        Прочитано
      </button>
    </div>
  );
}

export default BookActions