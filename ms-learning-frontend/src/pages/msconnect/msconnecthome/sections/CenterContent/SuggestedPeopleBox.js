import React, { useRef, useEffect, useState } from 'react';
import { fetchSuggestedUsers, followUser, unfollowUser } from '../../../../../helpers/api';
import { useTranslation } from 'react-i18next';

const SuggestedPeopleBox = ({ currentUserId }) => {
    const { t } = useTranslation();
    const scrollRef = useRef(null);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [followingIds, setFollowingIds] = useState([]);

    useEffect(() => {
        const loadSuggestions = async () => {
            try {
                const users = await fetchSuggestedUsers(currentUserId);
                setSuggestedUsers(users);
            } catch (err) {
                console.error('Failed to fetch suggestions', err);
            }
        };

        loadSuggestions();
    }, [currentUserId]);

    const handleFollowToggle = async (targetId) => {
        try {
            if (followingIds.includes(targetId)) {
                await unfollowUser(currentUserId, targetId);
                setFollowingIds((prev) => prev.filter(id => id !== targetId));
            } else {
                await followUser(currentUserId, targetId);
                setFollowingIds((prev) => [...prev, targetId]);
            }
        } catch (err) {
            console.error('Error during follow/unfollow', err);
        }
    };

    const scrollLeft = () => scrollRef.current.scrollLeft -= 180;
    const scrollRight = () => scrollRef.current.scrollLeft += 180;

    return (
        <div className="user-post">
            <div className="friend-info">
                <figure><i className="fa fa-users"></i></figure>
                <div className="friend-name">
                    <ins><a href="/" title="Suggested">{t("Suggested")}</a></ins>
                    <span><i className="fa fa-globe"></i> {t("Our MS-LEARNING Family")}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={scrollLeft} className="scroll-btn" title="Previous">
                        <i className="fa fa-arrow-left"></i>
                    </button>

                    <ul
                        className="suggested-caro"
                        ref={scrollRef}
                        style={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: '20px',
                            paddingTop: '10px',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            width: '100%',
                        }}
                    >
                        {suggestedUsers.map((user) => (
                            <li key={user.id} style={{ flex: '0 0 auto', textAlign: 'center', width: '160px' }}>
                                <figure>
                                    <img
                                        src={`http://localhost:8080/${user.picture}`}
                                        alt={user.username}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </figure>
                                <span className='text-danger-50'>{user.firstname} {user.lastname}</span>
                                {/* <ins>{user.email}</ins> */}
                                <button
                                    onClick={() => handleFollowToggle(user.id)}
                                    className={`btn ${followingIds.includes(user.id) ? 'btn-sm btn-danger' : 'btn-primary'}`}
                                    style={{ fontSize: '12px', padding: '4px 10px', marginTop: '2px' }}
                                >
                                    <i className={`fa ${followingIds.includes(user.id) ? 'fa-minus' : 'fa-plus'}`}></i>{' '}
                                    {followingIds.includes(user.id) ? t("Unfollow") :  t("Follow")}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <button onClick={scrollRight} className="scroll-btn" title="Next">
                        <i className="fa fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuggestedPeopleBox;
