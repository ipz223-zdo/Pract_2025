import { useState } from "react";
import { addBook } from "../utils/api";
import { useNavigate } from "react-router-dom";
import NavBar from '../components/NavBar';

const AddBookPage = () => {
    const [bookData, setBookData] = useState({
        title: "",
        author: "",
        description: "",
        pdfFile: null
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setBookData({
            ...bookData,
            [name]: type === "file" ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Створення форми для надсилання файлів
        const formData = new FormData();
        formData.append("title", bookData.title);
        formData.append("author", bookData.author);
        formData.append("description", bookData.description);
        formData.append("pdfFile", bookData.pdfFile);

        try {
            await addBook(formData);  // За умови, що addBook підтримує FormData
            navigate("/");
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container d-flex justify-content-center align-items-center my-5">
                <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
                    <h2 className="text-center mb-4">Додати книгу</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Назва книги</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="Назва книги"
                                value={bookData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Автор</label>
                            <input
                                type="text"
                                name="author"
                                className="form-control"
                                placeholder="Автор"
                                value={bookData.author}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Опис книги</label>
                            <textarea
                                name="description"
                                className="form-control"
                                placeholder="Опис книги"
                                value={bookData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Завантажте PDF</label>
                            <input
                                type="file"
                                name="pdfFile"
                                className="form-control"
                                accept=".pdf"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Додати книгу</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBookPage;
