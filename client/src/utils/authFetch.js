//const API_URL = 'http://localhost:1337';

// Функция для получения нового accessToken
async function getAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch(`/api/token`, {
        method: 'POST',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refreshToken })
        
    });

    if (!response.ok) {
       // throw new Error('Не удалось обновить токен');
        window.location.href = '/login' //поменять на свою
    }

    const data = await response.json();
    console.log("✅ Получен новый accessToken:", data.accessToken);
    return data.accessToken;
}

// Проверка, истёк ли accessToken
function isTokenExpired(token) {
    if (!token) return true; // Если токена нет, считаем его истекшим

    try {
        const { exp } = JSON.parse(atob(token.split('.')[1])); // Извлекаем время истечения
        return Date.now() >= exp * 1000; // ✅ Проверяем, истёк ли токен
    } catch (error) {
        console.error(" Ошибка проверки токена:", error);
        return true;
    }
}

// Обёртка для API-запросов
async function fetchWithAuth(url, options = {}) {
    let accessToken = sessionStorage.getItem('accessToken'); // 🔹 Получаем токен после логина
    //console.log(" Текущий accessToken:", accessToken);
    if (isTokenExpired(accessToken)) {
        console.log("🔄 AccessToken истёк! Обновляем...");
        accessToken = await getAccessToken();
        sessionStorage.setItem("accessToken", accessToken);
    }
    console.log("Используем токен:", accessToken);

    let response = await fetch(`${url}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
    });

    if (response.status === 204) {
        console.log("Ответ без контента (204), данные отсутствуют.");
        return null; 
    }

    if (!response.ok) {
        console.error("❌ Ошибка запроса:", response.status);
        throw new Error("Ошибка запроса");
    }

    console.log(" Запрос успешно выполнен!");
    return response.json();
}

export { fetchWithAuth };
