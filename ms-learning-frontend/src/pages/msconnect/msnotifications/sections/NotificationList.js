import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import {
    getPosts,
    getPostById,
    fetchUserFollowers,
    getForumPosts
} from '../../../../helpers/api';

const NotificationList = () => {
    const { id } = useParams();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAvatarUrl = (imagePath) =>
        imagePath ? `http://localhost:8080${imagePath}` : '';

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = parseInt(id);
                const [allPosts, followers, forumPosts] = await Promise.all([
                    getPosts(),
                    fetchUserFollowers(userId),
                    getForumPosts()
                ]);

                const notifs = [];

                const userPosts = allPosts.filter(post => post.user_id === userId);
                for (const post of userPosts) {
                    const detailedPost = await getPostById(post.id);

                    detailedPost.likes.forEach(like => {
                        notifs.push({
                            avatar: getAvatarUrl(like.picture),
                            message: `${like.username} liked your post "${detailedPost.title}"`,
                            iconClass: 'fa fa-thumbs-up',
                            time: detailedPost.createdAt
                        });
                    });

                    detailedPost.comments.forEach(comment => {
                        notifs.push({
                            avatar: getAvatarUrl(comment.picture),
                            message: `${comment.author} commented: "${comment.content}" on your post "${detailedPost.title}"`,
                            iconClass: 'fa fa-comment',
                            time: comment.createdAt
                        });
                    });
                }

                followers.forEach(follower => {
                    notifs.push({
                        avatar: getAvatarUrl(follower.picture),
                        message: `${follower.firstname} ${follower.lastname} started following you.`,
                        iconClass: 'fa fa-user',
                        time: follower.createdAt
                    });
                });

                forumPosts.forEach(post => {
                    notifs.push({
                        avatar: getAvatarUrl(post.user?.picture),
                        message: `${post.user?.username} created a new forum post "${post.title}"`,
                        iconClass: 'fa fa-bullhorn',
                        time: post.createdAt
                    });
                });

                notifs.sort((a, b) => new Date(b.time) - new Date(a.time));
                setNotifications(notifs);
            } catch (error) {
                console.error('Error loading notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [id]);

    useEffect(() => {
        const handleRemove = (e) => {
            setNotifications(prev =>
                prev.filter(n => n.message !== e.detail)
            );
        };

        window.addEventListener('removeNotification', handleRemove);
        return () => window.removeEventListener('removeNotification', handleRemove);
    }, []);

    if (loading) {
        return (
            <div className="main-wraper">
                <h3>Loading notifications...</h3>
            </div>
        );
    }

    return (
        <div className="main-wraper">
            <h3 className="main-title">All Notifications</h3>
            <div className="editing-interest w-100">
                <div className="notification-box w-100">
                    <ul className="w-100">
                        {notifications.length > 0 ? (
                            notifications.map((notif, idx) => (
                                <NotificationItem key={idx} {...notif} />
                            ))
                        ) : (
                            <li>No notifications found.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NotificationList;
