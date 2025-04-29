import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserProfileNav from './../reused/UserProfileNav';
import { getForumPosts } from '../../../../helpers/api';

const UserForumSection = () => {
    const [forumTopics, setForumTopics] = useState([]);
    const { id: userIdFromUrl } = useParams();

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const data = await getForumPosts();
                setForumTopics(data);
            } catch (error) {
                console.error('Error loading forum posts:', error);
            }
        };
        fetchTopics();
    }, []);

    const filteredTopics = forumTopics.filter(
        topic => String(topic.user?.id) === String(userIdFromUrl)
    );

    return (
        <div className="topics--list">
            <UserProfileNav />
            {filteredTopics.length > 0 ? (
                <table className="table">
                    <thead className="ff--primary fs--14 text-darkest">
                        <tr>
                            <th>Topics</th>
                            <th>Views</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTopics.map((topic, index) => (
                            <tr key={index} className={topic.pinned ? 'pinned' : ''}>
                                <td>
                                    <h4 className="h6 fw--500 text-darkest">
                                        <Link to={`/forum-post/${topic.id}`} className="btn-link">
                                            {topic.title}
                                        </Link>
                                    </h4>
                                    <p>
                                        Categories:
                                        {topic.category && topic.category.map((cat, i) => (
                                            <span key={i}>
                                                {' '}
                                                <Link to="/msconnect/profile/activity">{cat}</Link>
                                                {i < topic.category.length - 1 ? ',' : ''}
                                            </span>
                                        ))}
                                    </p>
                                </td>
                                <td>
                                    <p className="ff--primary fw--500 fs--14 text-darkest">
                                        {String(topic.views).padStart(2, '0')}
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="ff--primary fs--14 text-darkest">No forum posts for this user.</p>
            )}
        </div>
    );
};

export default UserForumSection;
