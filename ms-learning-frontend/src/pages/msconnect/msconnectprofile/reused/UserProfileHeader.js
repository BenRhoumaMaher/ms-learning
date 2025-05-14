import React, { useEffect, useState } from 'react';
import bgImage from '../../../../assets/bg-01.png';
import { getUserInfos } from '../../../../helpers/api';
import { useTranslation } from 'react-i18next';

const UserProfileHeader = ({ userId }) => {
    const { t } = useTranslation();
    const [userInfo, setUserInfo] = useState({
        username: '',
        expertise: '',
        x: '',
        linkedin: '',
        facebook: '',
        instagram: '',
        role: [],
        image: ''
    });

    useEffect(() => {
        if (userId) {
            getUserInfos(userId)
                .then(data => {
                    setUserInfo({
                        username: data.username || 'Guest',
                        expertise: data.expertise || '',
                        x: data.x || '',
                        linkedin: data.linkedin || '',
                        facebook: data.facebook || '',
                        instagram: data.instagram || '',
                        role: data.role || [],
                        image: data.image || ''
                    });
                })
                .catch(console.error);
        }
    }, [userId]);

    const isInstructor = userInfo.role.includes('ROLE_INSTRUCTOR');

    return (
        <div className="user-profile-header">
            <div
                className="cover-image"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '300px',
                    position: 'relative',
                }}
            ></div>

            <div className="profile-info text-center d-flex flex-column align-items-center mt-5">
                <div className="avatar-wrapper">
                    <img
                        src={`http://localhost:8080/${userInfo.image}`}
                        alt="User Avatar"
                        className="avatar-img"
                    />
                </div>

                <div className="user-text">
                    <h2 className="user-name">{userInfo.username}</h2>
                    <p className="user-activity">
                        <i className="fa fa-clock-o mr-2"></i> {t('Active recently')}
                    </p>
                    <p className="user-desc">
                        <em>
                            {isInstructor && userInfo.expertise
                                ? userInfo.expertise
                                : t('Welcome message')}
                        </em>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserProfileHeader;
