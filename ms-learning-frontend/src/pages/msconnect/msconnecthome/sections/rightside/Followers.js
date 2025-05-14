import React, { useEffect, useState } from 'react';
import { fetchUserFollowers } from '../../../../../helpers/api';
import { useTranslation } from 'react-i18next';

const Followers = ({ currentUserId }) => {
    const [followers, setFollowers] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const loadFollowers = async () => {
            try {
                const data = await fetchUserFollowers(currentUserId);
                setFollowers(data);
            } catch (err) {
                console.error('Failed to load followers', err);
            }
        };

        if (currentUserId) {
            loadFollowers();
        }
    }, [currentUserId]);

    return (
        <div className="widget">
            <h4 className="widget-title">{t("Followers")}</h4>
            <ul className="followers">
                {followers.map((follower) => (
                    <li key={follower.id} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <figure>
                            <img
                                src={`http://localhost:8080/${follower.picture}`}
                                alt={follower.firstname}
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        </figure>
                        <div className="friend-meta">
                            <h4>
                                <a href={`/msconnect-profile/${follower.id}`} title="">{follower.firstname} {follower.lastname}</a>
                            </h4>
                            <a className="underline" href={`/msconnect-profile/${follower.id}`} title="View Profile">{t("View")}</a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Followers;
