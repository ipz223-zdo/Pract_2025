import React, { useEffect, useState } from 'react';
import { fetchBooks } from '../utils/api';
import AddToLibraryButton from '../components/AddToLibraryButton';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';


const HomePage = () => {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const { data } = await fetchBooks();
                setBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        loadBooks();
    }, []);

    return (
        <div className="container mt-4">
            <NavBar />

            {/* Список книг */}
            <div className="row">
                {books.map((book) => (
                    <div key={book._id} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5
                                    className="card-title text-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/book/${book._id}`)}
                                >
                                    {book.title}
                                </h5>
                                <p className="card-text text-muted">{book.author}</p>
                                <AddToLibraryButton bookId={book._id} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
