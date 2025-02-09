import React, { useEffect, useState } from 'react';
import { fetchLibrary } from '../utils/api';
import NavBar from '../components/NavBar';
import {useNavigate} from "react-router-dom";

const LibraryPage = () => {
    const [library, setLibrary] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadLibrary = async () => {
            try {
                const { data } = await fetchLibrary();
                setLibrary(data);
            } catch (error) {
                console.error('Error fetching library:', error);
            }
        };

        loadLibrary();
    }, []);

    return (
        <div className="container mt-4">
            <NavBar />
            <div className="card p-4 shadow" style={{ maxWidth: '800px', width: '100%' }}>
                <h1 className="text-primary mb-4">My Library</h1>
                <ul className="list-unstyled">
                    {library.map((book) => (
                        <li key={book._id} className="mb-3">
                            <div className="card p-3 shadow-sm">
                                <h3
                                    className="text-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/book/${book._id}`)}
                                >
                                    {book.title}
                                </h3>
                                <p className="text-muted">{book.author}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LibraryPage;
