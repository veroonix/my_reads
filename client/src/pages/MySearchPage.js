import {fetchWithAuth } from "../utils/authFetch";
import { useState, useEffect } from "react";
import BookSearchForm from "../components/BookSearchForm";
import BookGrid from "../components/BookGrid";
import "../styles/BookCard.css";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {
    async function fetchUserBooks() {
      try {
        const response = await fetchWithAuth("/api/books/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        if (response) {
          setUserBooks(response);
        }
      } catch (error) {
        console.error("Ошибка загрузки книг пользователя:", error);
      }
    }
    fetchUserBooks();
  }, []);

  async function searchBooks(searchTerm) {    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWithAuth(`/api/books/search?title=${searchTerm}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (data.items) {
        const mergedResults = data.items.map(item => {
          const userBook = userBooks.find(book => book.bookId === item.id);
          return {
            ...item,
            status: userBook ? userBook.status : null
          };
        });
        
        setSearchResults(mergedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Ошибка поиска книги:", error);
      setError("Не удалось загрузить книги. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }

  async function addToList(bookId, status) {
    try {
      const bookToAdd = searchResults.find(book => book.id === bookId);
      if (!bookToAdd) return;

      const authors = bookToAdd.volumeInfo.authors ? bookToAdd.volumeInfo.authors.join(', ') : 'Unknown Author';


      const response = await fetchWithAuth("/api/books/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          bookId,
          title: bookToAdd.volumeInfo.title,
          author: authors,
          cover: bookToAdd.volumeInfo.imageLinks?.thumbnail,
          status: status
        })
      });
      
      if (response.message === "Книга успешно добавлена!") {
        const updatedUserBooks = [...userBooks];
        const existingBookIndex = updatedUserBooks.findIndex(b => b.bookId === bookId);
        
        if (existingBookIndex >= 0) {
          updatedUserBooks[existingBookIndex].status = status;
        } else {
          updatedUserBooks.push({
            bookId,
            title: bookToAdd.volumeInfo.title,
            author: bookToAdd.volumeInfo.authors,
            cover: bookToAdd.volumeInfo.imageLinks?.thumbnail,
            status
          });
        }
        
        setUserBooks(updatedUserBooks);
        
        setSearchResults(prevResults => 
          prevResults.map(book => 
            book.id === bookId 
              ? { ...book, status } 
              : book
          )
        );
      }
    } catch (error) {
      console.error("Ошибка добавления книги:", error);
    }
  }

  return (
    <div className="book-app">
      <header className="app-header">
     
        <BookSearchForm 
          loading={loading} 
          onSearch={searchBooks} 
        />
      </header>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="search-results">
        {searchResults.length > 0 ? (
          <BookGrid 
            books={searchResults} 
            onStatusChange={addToList} 
          />
        ) : (
          !loading && <div className="no-results">Книги не найдены. Попробуйте другой запрос.</div>
        )}
        
        {loading && <div className="loading-spinner"></div>}
      </div>
    </div>
  );
}

export default App; 