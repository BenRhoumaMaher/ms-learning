import React, { useState } from 'react';
import { createPost } from '../../../../../helpers/api';
import photoIcon from '../../../../../assets/image.png';
import feelingIcon from '../../../../../assets/activity.png';
import Picker from 'emoji-picker-react';
import useNotification from '../../../../../hooks/useNotification';
import useFileUpload from '../../../../../hooks/useFileUpload';
import useEmojiPicker from '../../../../../hooks/useEmojiPicker';
import { useTranslation } from 'react-i18next';

const CreatePostBox = () => {
    const { t } = useTranslation();
    const [content, setContent] = useState('');
    const { notification, showNotification } = useNotification();
    const { fileInputRef, selectedFile, handlePhotoClick, handleFileChange, setSelectedFile } = useFileUpload();
    const { showEmojiPicker, toggleEmojiPicker, handleEmojiClick } = useEmojiPicker(setContent);

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(atob(token.split('.')[1]));
    const userId = user.user_id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        const formData = new FormData();
        const payload = {
            title: 'New post',
            content,
            user_id: userId
        };

        formData.append('data', JSON.stringify(payload));
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            const response = await createPost(formData);
            console.log('Post created:', response);
            setContent('');
            setSelectedFile(null);
            showNotification('success', 'Post created successfully!');
        } catch (error) {
            showNotification('error', 'Failed to create post.');
        }
    };

    return (
        <div>
            <span className="new-title">{t("Create New Post")}</span>
            <div className="new-post">

                {notification.message && (
                    <div
                        style={{
                            backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da',
                            color: notification.type === 'success' ? '#155724' : '#721c24',
                            padding: '10px 16px',
                            borderRadius: '5px',
                            marginBottom: '15px',
                            border: `1px solid ${notification.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                        }}
                    >
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input
                        type="text"
                        placeholder={t("What's on your mind?")}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {selectedFile && (
                        <div style={{ marginTop: '10px' }}>
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Preview"
                                width="100"
                            />
                        </div>
                    )}

                    {showEmojiPicker && (
                        <Picker onEmojiClick={handleEmojiClick} height={300} />
                    )}

                    <div className="post-actions" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <ul className="upload-media" style={{ display: 'flex', gap: '10px', padding: 0, margin: 0 }}>
                            <li style={{ listStyle: 'none' }}>
                                <a href="/" title="" onClick={handlePhotoClick}>
                                    <i><img src={photoIcon} alt="Media" /></i>
                                    <span>Photo</span>
                                </a>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                            </li>

                            <li style={{ listStyle: 'none' }}>
                                <a href="/" title="" onClick={toggleEmojiPicker}>
                                    <i><img src={feelingIcon} alt="Activity" /></i>
                                    <span>{t("Feeling/Activity")}</span>
                                </a>
                            </li>
                        </ul>

                        <button type="submit" className="btn btn-primary" disabled={!content.trim()}>
                            {t("Publish")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostBox;
