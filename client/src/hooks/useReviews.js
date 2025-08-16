// hooks/useReviews.js
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/authFetch';

export default function useReviews(bookId) {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  // Основная функция загрузки данных
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Параллельная загрузка данных
      const [reviewsResponse, userReviewResponse] = await Promise.all([
        fetchWithAuth(`/api/books/raiting?bookId=${bookId}`),
        fetchWithAuth(`/api/books/user-review?bookId=${bookId}`)
      ]);

      // Обрабатываем ответ с рейтингом и отзывами
      if (reviewsResponse) {
        setReviews(reviewsResponse.reviews || []);
        setAverageRating(reviewsResponse.averageRating || 0);
      }

      // Обрабатываем пользовательский отзыв
      setUserReview(userReviewResponse);
    } catch (error) {
      setError(error.message || 'Ошибка загрузки отзывов');
    } finally {
      setLoading(false);
    }
  };

  // Эффект для первичной загрузки данных
  useEffect(() => {
    if (bookId) loadData();
  }, [bookId]);

  // Отправка/обновление отзыва
  const submitReview = async (reviewData) => {
    try {
      const response = await fetchWithAuth('/api/books/review/add', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: bookId,
          reviewText: reviewData.reviewText,
          userRating: reviewData.userRating,
          createdAt: new Date().toISOString()
        })
      });

      await loadData(); // Перезагружаем данные после изменения
      return response;
    } catch (error) {
      throw new Error(error.message || 'Ошибка сохранения отзыва');
    }
  };

  // Удаление отзыва
  const deleteReview = async () => {
    try {
      await fetchWithAuth('/api/books/review/delete', {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId })
      });

      await loadData(); // Перезагружаем данные после удаления
    } catch (error) {
      throw new Error(error.message || 'Ошибка удаления отзыва');
    }
  };

  return {
    reviews,
    userReview,
    loading,
    error,
    averageRating,
    submitReview,
    deleteReview,
    refreshReviews: loadData
  };
}