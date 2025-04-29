import { useState } from 'react';
import { createComment, createReply, getCommentsByPost, getRepliesByComment } from '../helpers/api';

const useComments = (userId, replies, setComments, setReplies) => {
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});
    const [replyInputs, setReplyInputs] = useState({});
    const [replyingTo, setReplyingTo] = useState({});

    const toggleCommentBox = (postId) => {
        setActiveCommentPostId(prev => (prev === postId ? null : postId));
    };

    const toggleReplyBox = (commentId) => {
        setReplyingTo(prev => ({
            ...prev,
            [commentId]: prev[commentId] ? null : true
        }));
    };

    const handleCommentChange = (postId, value) => {
        setCommentInputs(prev => ({ ...prev, [postId]: value }));
    };

    const handleReplyChange = (commentId, value) => {
        setReplyInputs(prev => ({ ...prev, [commentId]: value }));
    };

    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        const content = commentInputs[postId];
        if (!content?.trim()) return;

        try {
            await createComment({ post_id: postId, user_id: userId, content });
            setCommentInputs(prev => ({ ...prev, [postId]: '' }));

            const updatedComments = await getCommentsByPost(postId);
            setComments(prev => ({ ...prev, [postId]: updatedComments }));

            const newReplies = { ...replies };
            for (const comment of updatedComments) {
                newReplies[comment.id] = await getRepliesByComment(comment.id);
            }
            setReplies(newReplies);
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();
        const content = replyInputs[commentId];
        if (!content?.trim()) return;

        try {
            await createReply(commentId, { user_id: userId, content });
            setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
            setReplyingTo(prev => ({ ...prev, [commentId]: null }));

            const updatedReplies = await getRepliesByComment(commentId);
            setReplies(prev => ({ ...prev, [commentId]: updatedReplies }));
        } catch (error) {
            console.error('Error creating reply:', error);
        }
    };

    return {
        activeCommentPostId,
        commentInputs,
        replyInputs,
        replyingTo,
        toggleCommentBox,
        toggleReplyBox,
        handleCommentChange,
        handleReplyChange,
        handleCommentSubmit,
        handleReplySubmit
    };
};

export default useComments;
