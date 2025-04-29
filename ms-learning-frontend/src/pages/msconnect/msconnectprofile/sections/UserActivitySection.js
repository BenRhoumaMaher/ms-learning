import React, { useEffect, useState } from 'react';
import UserProfileNav from './../reused/UserProfileNav';
import { Link, useParams } from 'react-router-dom';
import { fetchUserPostsWithComments, fetchUserFollowings } from '../../../../helpers/api';

const UserActivitySection = () => {
    const [posts, setPosts] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const currentUserId = token ? JSON.parse(atob(token.split('.')[1]))?.user_id : null;

    const isCurrentUser = currentUserId && currentUserId.toString() === id;

    useEffect(() => {
        if (!isCurrentUser) return;

        const loadData = async () => {
            try {
                const [postsData, followingsData] = await Promise.all([
                    fetchUserPostsWithComments(currentUserId),
                    fetchUserFollowings(currentUserId)
                ]);

                setPosts(postsData);
                setFollowings(followingsData);
            } catch (error) {
                console.error('Error loading user activity:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isCurrentUser, currentUserId]);

    if (!isCurrentUser) {
        return (
            <div className="main--content col-md-12 pb--60">
                <UserProfileNav />
                <div className="alert alert-warning">
                    Activity section is only available for your own profile.
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="main--content col-md-12 pb--60">
                <UserProfileNav />
                <div className="text-center">Loading activity...</div>
            </div>
        );
    }

    return (
        <div className="">
            <div className="drop--shadow">
                <div className="main--content col-md-12 pb--60" data-trigger="stickyScroll">
                    <UserProfileNav />
                    <div className="activity--list">
                        <ul className="activity--items nav">
                            {posts.map(post => (
                                <li key={post.id}>
                                    <div className="activity--item">
                                        <div className="activity--avatar">
                                            <Link to="#">
                                                <img
                                                    src={`http://localhost:8080/${post.userpicture}`}
                                                    alt="User profile"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/default-avatar.jpg'
                                                    }}
                                                />
                                            </Link>
                                        </div>
                                        <div className="activity--info fs--14">
                                            <div className="activity--header">
                                                <p>You posted an update</p>
                                            </div>
                                            <div className="activity--meta fs--12">
                                                <p><i className="fa mr--8 fa-clock-o"></i>{post.created_at}</p>
                                            </div>
                                            <div className="activity--content">
                                                <p>{post.content}</p>
                                            </div>
                                            {post.comments.length > 0 && (
                                                <div className="activity--comments fs--12" style={{ marginTop: '10px' }}>
                                                    <ul className="acomment--items" style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '10px',
                                                        paddingLeft: '0',
                                                        listStyle: 'none'
                                                    }}>
                                                        {post.comments.map((comment, index) => (
                                                            <li key={index} style={{
                                                                paddingTop: '10px'
                                                            }}>
                                                                <div className="acomment--item clearfix">
                                                                    <div className="acomment--avatar">
                                                                        <Link to="#">
                                                                            <img
                                                                                src={`http://localhost:8080/${comment.commentorpicture}`}
                                                                                alt="Commenter profile"
                                                                            />
                                                                        </Link>
                                                                    </div>
                                                                    <div className="acomment--info">
                                                                        <div className="acomment--header">
                                                                            <p><Link to="#">{comment.author}</Link> Replied</p>
                                                                        </div>
                                                                        <div className="acomment--meta">
                                                                            <p><i className="fa mr--8 fa-clock-o"></i>{comment.created_at}</p>
                                                                        </div>
                                                                        <div className="acomment--content">
                                                                            <p>{comment.content}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}

                            {followings.map(friend => (
                                <li key={friend.id}>
                                    <div className="activity--item">
                                        <div className="activity--avatar">
                                            <Link to="#">
                                                <img
                                                    src={`http://localhost:8080/${friend.picture}`}
                                                    alt="Friend profile"
                                                />
                                            </Link>
                                        </div>
                                        <div className="activity--info fs--14">
                                            <div className="activity--header">
                                                <p>You and <Link to="#">{friend.firstname} {friend.lastname}</Link> are now friends</p>
                                            </div>
                                            <div className="activity--meta fs--12">
                                                <p><i className="fa mr--8 fa-envelope"></i>{friend.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserActivitySection;