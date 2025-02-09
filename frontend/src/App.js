import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LibraryPage from './pages/LibraryPage';
import HomePage from './pages/HomePage';
import BookPage from "./pages/BookPage";
import AddBookPage from "./pages/AddBookPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/book/:bookId" element={<BookPage />} />
                <Route path="/add-book" element={<AddBookPage />} />
            </Routes>
        </Router>
    );
};

export default App;
