import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserProfileNav from './../reused/UserProfileNav';
import { fetchUserFollowings } from '../../../../helpers/api';

const UserFriendsSection = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchFollowings = async () => {
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (!token) return;

                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload?.user_id;

                if (userId) {
                    const followings = await fetchUserFollowings(userId);
                    setMembers(followings);
                }
            } catch (err) {
                console.error('Error fetching followings:', err);
            }
        };

        fetchFollowings();
    }, []);

    return (
        <div className="member--items">
            <div className="main--content col-md-12 pb--60" data-trigger="stickyScroll">
                <UserProfileNav />
                <div className="row gutter--15 AdjustRow">
                    {members.map((member, index) => (
                        <div className="col-md-3 col-xs-6 col-xxs-12" key={index}>
                            <div className="member--item online">
                                <div className="img img-circle">
                                    <Link to={`/user/${member.id}`} className="btn-link">
                                        <img src={`http://localhost:8080/${member.picture}`} alt={member.firstname} />
                                    </Link>
                                </div>

                                <div className="name">
                                    <h3 className="h6 fs--12">
                                        <Link to={`/user/${member.id}`} className="btn-link">{member.firstname} {member.lastname}</Link>
                                    </h3>
                                </div>

                                <div className="actions">
                                    <ul className="nav">
                                        <li>
                                            <Link to="/msconnect-message" title="Send Message" className="btn-link">
                                                <i className="fa fa-envelope-o"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserFriendsSection;
