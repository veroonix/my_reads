import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/authFetch';

function useUserBooks() {
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка книг
  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuth("/api/books/get");
        if (response) setUserBooks(response);
      } catch (error) {
        setError("Не удалось загрузить ваши книги");
        console.error("Ошибка загрузки книг пользователя:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserBooks();
  }, []);

  // Добавление/обновление книги
  const addBook = async (bookId, bookData, status) => {
    try {
      await fetchWithAuth("/api/books/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          bookId,
          title: bookData.title,
          cover: bookData.imageLinks?.thumbnail,
          status
        })
      });
      
      setUserBooks(prev => updateLocalBooks(prev, bookId, bookData, status));
    } catch (error) {
      console.error("Ошибка добавления книги:", error);
      throw error;
    }
  };

  // Обновление статуса книги
  const updateBookStatus = async (bookId, newStatus) => {
    try {
      await fetchWithAuth("/api/books/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, status: newStatus })
      });
      
      setUserBooks(prev => 
        prev.map(book => 
          book.bookId === bookId ? { ...book, status: newStatus } : book
        )
      );
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
      throw error;
    }
  };

  // Вспомогательная функция для обновления локального состояния
  const updateLocalBooks = (prevBooks, bookId, bookData, status) => {
    const existingIndex = prevBooks.findIndex(b => b.bookId === bookId);
    return existingIndex >= 0
      ? prevBooks.map(b => b.bookId === bookId ? { ...b, status } : b)
      : [...prevBooks, { 
          bookId, 
          title: bookData.title,
          cover: bookData.imageLinks?.thumbnail,
          authors: bookData.authors?.join(', '),
          status 
        }];
  };

 // 📌 Добавьте в хук useUserBooks
  const deleteBook = async (bookId) => {
    try {
      await fetchWithAuth("/api/books/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId })
      });
    
      setUserBooks(prev => 
      prev.filter(book => book.bookId !== bookId)
    );
    } catch (error) {
      console.error("Ошибка удаления книги:", error);
      throw error;
    }
};

  return { 
    userBooks, 
    loading, 
    error, 
    addBook, 
    updateBookStatus,
    deleteBook // Добавляем в экспорт
  };
}

export default useUserBooks;