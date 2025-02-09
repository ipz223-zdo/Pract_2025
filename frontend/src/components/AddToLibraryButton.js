import React from 'react';
import { addToLibrary } from '../utils/api';

const AddToLibraryButton = ({ bookId }) => {
    const handleAdd = async () => {
        try {
            await addToLibrary(bookId);
            alert('Book added to library!');
        } catch (error) {
            alert('Error adding book to library');
        }
    };

    return <button className="btn btn-success" onClick={handleAdd}>Add to Library</button>;
};

export default AddToLibraryButton;
