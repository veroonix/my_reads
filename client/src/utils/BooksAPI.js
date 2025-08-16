import { fetchWithAuth } from "../utils/authFetch"
const api = "http://localhost:1337"; 


const headers = {
  //Accept: "application/json",
  "Content-Type": "application/json"
};

const renderBookStatus = (book) => {
  if (book.source === "google") {
    return "Добавить в...";
  } else if (book.source === "database") {
    return book.status; // Например, "Читаю", "Прочитана"
  } else {
    return "Неизвестный источник";
  }
};

//Поиск книги
export const searchBook = async (title) => {
  try {
    const response = await fetchWithAuth(`/api/books/search?title=${encodeURIComponent(title)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // Парсинг JSON-ответа
    const data = await response.json();

    // Применяем renderBookStatus для установки поля status, сохраняя все остальные свойства
    const modifiedResult = data.items.map((book) => ({
      ...book,
      status: renderBookStatus(book),
    }));

    return modifiedResult;
  } catch (error) {
    console.error("Ошибка поиска книги:", error);
    throw error;
  }
};


