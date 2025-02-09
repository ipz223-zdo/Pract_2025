import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-primary">Online Library</h1>
                <div>
                    <Link to="/" className="btn btn-outline-primary me-2">Home</Link>
                    <Link to="/library" className="btn btn-outline-primary me-2">Library</Link>
                    <Link to="/add-book" className="btn btn-success mx-3">Add Book</Link>
                    <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
                    <Link to="/register" className="btn btn-primary">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
