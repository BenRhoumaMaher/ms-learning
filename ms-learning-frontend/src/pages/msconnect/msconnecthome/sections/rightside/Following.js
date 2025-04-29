import React, { useEffect, useState } from 'react';
import { fetchUserFollowings } from '../../../../../helpers/api';

const Following = ({ currentUserId }) => {
    const [followings, setFollowings] = useState([]);

    useEffect(() => {
        const loadFollowings = async () => {
            try {
                const data = await fetchUserFollowings(currentUserId);
                setFollowings(data);
            } catch (err) {
                console.error('Failed to load followings', err);
            }
        };

        if (currentUserId) {
            loadFollowings();
        }
    }, [currentUserId]);

    return (
        <div className="widget">
            <h4 className="widget-title">Followings</h4>
            <ul className="followers">
                {followings.map((user) => (
                    <li key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <figure>
                            <img
                                src={`http://localhost:8080/${user.picture}` || '/default-profile.jpg'}
                                alt={user.firstname}
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        </figure>
                        <div className="friend-meta">
                            <h4>
                                <a href={`/msconnect-profile/${user.id}`} title="">{user.firstname} {user.lastname}</a>
                            </h4>
                            <a className="underline" href={`/msconnect-profile/${user.id}`} title="View Profile">View</a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Following;
