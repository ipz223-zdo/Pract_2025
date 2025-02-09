import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Додаємо токен авторизації до кожного запиту
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Запити до API
export const fetchBooks = () => API.get('/books'); // Отримати список книг
export const fetchBookDetails = (bookId) => API.get(`/books/${bookId}`); // Отримати деталі книги
export const addBook = (bookData) => API.post('/books', bookData); // Додати нову книгу
export const getDownloadUrl = (bookId) => API.get(`/books/${bookId}/download`); // Завантаження книги
export const getReadingData = (bookId) => API.get(`/books/${bookId}/read`); // Дані для читання


export const registerUser = (userData) => API.post('/users/register', userData);
export const loginUser = (userData) => API.post('/users/login', userData);
export const fetchLibrary = () => API.get('/users/library');
export const addToLibrary = (bookId) => API.post('/users/library', { bookId });

// Перевіряє, чи книга є в бібліотеці користувача
export const checkIfBookInLibrary = async (bookId) => {
    try {
        const { data } = await fetchLibrary();
        return data.some((book) => book._id === bookId);
    } catch (error) {
        console.error('Error checking library:', error);
        return false;
    }
};
