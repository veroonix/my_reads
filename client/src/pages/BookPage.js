// pages/BookPage.js
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import useReviews from '../hooks/useReviews';
import useUserBooks from '../hooks/useUserBooks';
import "../styles/BookPage.css";

function BookPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { userBooks, deleteBook } = useUserBooks();
  const { 
    reviews, 
    userReview, 
    loading, 
    error, 
    averageRating,
    submitReview, 
    deleteReview 
  } = useReviews(bookId);

  const [formData, setFormData] = useState({
    text: '',
    rating: 0
  });

  // Заполнение формы при наличии отзыва
  useEffect(() => {
    if (userReview) {
      setFormData({
        text: userReview.reviewText,
        rating: userReview.userRating
      });
    }
  }, [userReview]);

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitReview({
        reviewText: formData.text,
        userRating: formData.rating
      });
    } catch (error) {
      alert(error.message);
    }
  };

  // Получение информации о книге
  const currentBook = userBooks.find(b => b.bookId === bookId);



  if (!currentBook) return <div>Книга не найдена в вашей коллекции</div>;

  return (
    <div className="book-page">
         <button 
        className="back-button"
        onClick={() => navigate(-1)} // Возврат на предыдущую страницу
      >
        ← Назад
      </button>

      <div className="book-header">
        <img src={currentBook.cover} alt={currentBook.title} />
        <div className="book-info">
        <h1>{currentBook.title}</h1>
        <p className="authors">{currentBook.author}</p>
        <div className="rating-container">
          <span className="average-rating">
            Средняя оценка: {typeof averageRating === 'number' ? averageRating.toFixed(1) : '0.0'} ★
          </span>
          <span className="status">Статус: {currentBook.status}</span>
        </div>
      </div>
      </div>

      <div className="reviews-section">
        <h2>Отзывы ({reviews ? reviews.length : 0})</h2>

        {!loading && (
          <>
            <form onSubmit={handleSubmit} className="review-form">
              <div className="rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={formData.rating >= star ? 'active' : ''}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      rating: star
                    }))}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                value={formData.text}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  text: e.target.value
                }))}
                placeholder="Ваш отзыв..."
              />

              <div className="form-actions">
                <button type="submit" 
                  className="submit-review-btn" 
                >
                  {userReview ? 'Обновить' : 'Опубликовать'}
                </button>
                {userReview && (
                  <button
                    type="button"
                    className="delete"
                    onClick={deleteReview}
                  >
                    Удалить отзыв
                  </button>
                )}
              </div>
            </form>

            <div className="reviews-list">
              {(reviews || []).map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <span className="user">{review.userId?.name || 'Аноним'}</span>
                    <div className="stars">
                      {'★'.repeat(review.userRating)}
                    </div>
                  </div>
                  <p className="review-text">{review.reviewText}</p>
                  <time>{new Date(review.createdAt).toLocaleDateString()}</time>
                </div>
              ))}
            </div>
          </>
        )}

        {loading && <div>Загрузка отзывов...</div>}
        {error && <div className="error">{error}</div>}
      </div>

      <button 
        className="delete-book"
        onClick={() => {
          if (window.confirm('Удалить книгу из коллекции?')) {
            deleteBook(bookId);
          }
        }}
      >
        Удалить книгу из коллекции
      </button>
    </div>
  );
}

export default BookPage;