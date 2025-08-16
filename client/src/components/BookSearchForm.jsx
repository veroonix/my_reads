function BookSearchForm({ loading, onSearch }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const searchTerm = event.target.bookSearch.value.trim();
    if (searchTerm) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input 
        type="text" 
        name="bookSearch"
        placeholder="Введите название книги" 
        className="search-input"
      />
      <button type="submit" className="search-button">
        {loading ? "Идет поиск..." : "Найти"}
      </button>
    </form>
  );
}

export default BookSearchForm;