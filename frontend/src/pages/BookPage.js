import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookDetails, checkIfBookInLibrary, getDownloadUrl } from '../utils/api';
import NavBar from '../components/NavBar';

const BookPage = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [isInLibrary, setIsInLibrary] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);

    useEffect(() => {
        const loadBookData = async () => {
            try {
                // Отримуємо деталі книги
                const { data } = await fetchBookDetails(bookId);
                setBook(data);

                // Перевіряємо, чи книга є в бібліотеці
                const inLibrary = await checkIfBookInLibrary(bookId);
                setIsInLibrary(inLibrary);

                // Отримуємо посилання на PDF, якщо книга в бібліотеці
                if (inLibrary) {
                    const { data: downloadData } = await getDownloadUrl(bookId);
                    // Завжди додаємо абсолютний шлях до файлу
                    setDownloadUrl(downloadData.downloadUrl);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Помилка завантаження книги');
            } finally {
                setLoading(false);
            }
        };

        loadBookData();
    }, [bookId]);

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>Помилка: {error}</p>;
    if (!book) return <p>Книгу не знайдено</p>;

    return (
        <div className="container mt-4">
            <NavBar />
            <div className="card p-4 shadow" style={{ maxWidth: '600px', width: '100%' }}>
                <h1 className="text-primary">{book.title}</h1>
                <p className="text-muted">Автор: {book.author}</p>
                <p>{book.description}</p>

                <div className="d-flex justify-content-between mt-4">
                    {isInLibrary && downloadUrl && (
                        <a href={downloadUrl} download>
                            <button className="btn btn-success">Завантажити PDF</button>
                        </a>
                    )}
                    <button className="btn btn-outline-secondary" disabled>
                        Читати онлайн
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookPage;
