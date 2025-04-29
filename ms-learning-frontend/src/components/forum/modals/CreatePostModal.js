import React, { useState } from 'react';
import { createForumPost } from '../../../helpers/api';
import useCategories from '../../../hooks/useCategories';

const CreatePostModal = ({ isOpen, onClose, onPostCreated, userId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const categories = useCategories();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('data', JSON.stringify({
            title,
            content,
            user_id: userId,
            categories: selectedCategories
        }));

        try {
            await createForumPost(formData);
            onPostCreated();
            onClose();
        } catch (error) {
            console.error('Post creation failed', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show" style={{ display: 'block', backgroundColor: '#00000099' }}>
            <div className="modal-dialog">
                <form className="modal-content" onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h5 className="modal-title">Create Forum Post</h5>
                        <button type="button" className="close" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <textarea
                            className="form-control mb-2"
                            placeholder="Content (use #tags)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            required
                        />
                        <input
                            type="file"
                            className="form-control mb-2"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <select
                            className="form-control mb-2"
                            multiple
                            value={selectedCategories}
                            onChange={(e) =>
                                setSelectedCategories([...e.target.selectedOptions].map(opt => opt.value))
                            }
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
