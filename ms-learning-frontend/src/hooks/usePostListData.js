import { useState, useEffect } from 'react';
import { getPosts, getCommentsByPost, getRepliesByComment } from '../helpers/api';

const usePostListData = () => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({});
    const [replies, setReplies] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postData = await getPosts();
                setPosts(postData);

                const commentData = {};
                const repliesData = {};

                for (const post of postData) {
                    const postComments = await getCommentsByPost(post.id);
                    commentData[post.id] = postComments;

                    for (const comment of postComments) {
                        const commentReplies = await getRepliesByComment(comment.id);
                        repliesData[comment.id] = commentReplies;
                    }
                }

                setComments(commentData);
                setReplies(repliesData);
            } catch (error) {
                console.error('Error loading posts/comments/replies:', error);
            }
        };

        fetchData();
    }, []);

    return { posts, setPosts, comments, setComments, replies, setReplies };
};

export default usePostListData;
