import { useState, useEffect } from 'react';
import { getForumPosts } from '../helpers/api';

const useForumPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const fetchedPosts = await getForumPosts();
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Failed to load forum posts', error);
            }
        };

        fetchPosts();
    }, []);

    return posts;
};

export default useForumPosts;
