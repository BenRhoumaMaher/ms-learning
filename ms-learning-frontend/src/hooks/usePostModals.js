import { useState } from 'react';
import { updatePost, deletePost, getPosts } from '../helpers/api';

const usePostModals = (setPosts) => {
    const [editModal, setEditModal] = useState({ isOpen: false, post: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null });
    const [editInputs, setEditInputs] = useState({ title: '', content: '' });

    const openEditModal = (post) => {
        setEditInputs({ title: post.title, content: post.content });
        setEditModal({ isOpen: true, post });
    };

    const handleEditSubmit = async () => {
        try {
            await updatePost(editModal.post.id, editInputs);
            setEditModal({ isOpen: false, post: null });
            const refreshedPosts = await getPosts();
            setPosts(refreshedPosts);
        } catch (err) {
            console.error('Edit failed:', err);
        }
    };

    const openDeleteModal = (postId) => {
        setDeleteModal({ isOpen: true, postId });
    };

    const confirmDelete = async () => {
        try {
            await deletePost(deleteModal.postId);
            setDeleteModal({ isOpen: false, postId: null });
            const refreshedPosts = await getPosts();
            setPosts(refreshedPosts);
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    return {
        editModal,
        setEditModal,
        setDeleteModal,
        deleteModal,
        editInputs,
        setEditInputs,
        openEditModal,
        openDeleteModal,
        handleEditSubmit,
        confirmDelete
    };
};

export default usePostModals;
