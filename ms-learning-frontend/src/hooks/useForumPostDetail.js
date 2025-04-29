import { useState, useEffect } from 'react';
import { getForumPostById, getSiblingsById } from '../helpers/api';

const useForumPostDetail = (postId) => {
    const [post, setPost] = useState(null);
    const [siblings, setSiblings] = useState({ previous: null, next: null });

    useEffect(() => {
        if (!postId) return;

        const fetchData = async () => {
            try {
                const postData = await getForumPostById(postId);
                setPost(postData);

                const siblingsData = await getSiblingsById(postId);
                setSiblings(siblingsData);
            } catch (error) {
                console.error('Failed to load forum post details', error);
            }
        };

        fetchData();
    }, [postId]);

    return { post, siblings };
};

export default useForumPostDetail;
