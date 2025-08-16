const api = 'https://www.googleapis.com';
const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;


export const search = (searchTerm) => {
    return fetch(`${api}/books/v1/volumes?q=${searchTerm}&langRestrict=ru&key=${apiKey}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Ошибка:", error);
      return null;
    });
}
  

