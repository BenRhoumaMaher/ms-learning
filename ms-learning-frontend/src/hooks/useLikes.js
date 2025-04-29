import { useState } from 'react';
import { toggleLike } from '../helpers/api';

const useLikes = (userId) => {
    const [likesState, setLikesState] = useState({});

    const handleToggleLike = async (postId) => {
        try {
            const res = await toggleLike(postId, userId);
            setLikesState(prev => ({
                ...prev,
                [postId]: {
                    liked: res.liked,
                    count: res.likesCount
                }
            }));
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    return { likesState, handleToggleLike };
};

export default useLikes;
