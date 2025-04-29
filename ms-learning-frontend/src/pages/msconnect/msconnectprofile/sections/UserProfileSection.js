import React, { useEffect, useState } from 'react';
import UserProfileNav from '../reused/UserProfileNav';
import { getUserInfos, getUserCourses, getUserEnrollements } from '../../../../helpers/api';
import { useParams } from 'react-router-dom';
const UserProfileSection = () => {
    const { id: userId } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUserInfos(userId);
                setUserInfo(user);

                const roles = user.role || [];
                let loadedCourses = [];

                if (roles.includes('ROLE_INSTRUCTOR')) {
                    const res = await getUserCourses(userId);
                    loadedCourses = res.courses || [];
                } else {
                    const res = await getUserEnrollements(userId);
                    loadedCourses = res.course_titles || [];
                }

                setCourses(loadedCourses);
            } catch (err) {
                console.error('Error loading user profile:', err);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);



    const isInstructor = userInfo?.role?.includes('ROLE_INSTRUCTOR');

    return (
        <section className="page--wrapper pt--80 pb--20">
            <div className="main--content col-md-12 pb--60" data-trigger="stickyScroll">
                <div className="main--content-inner drop--shadow">
                    <UserProfileNav />

                    <div className="profile--details fs--14">
                        <div className="profile--item">
                            <div className="profile--heading">
                                <h3 className="h4 fw--700">
                                    <span className="mr--4">About Me</span>
                                    <i className="ml--10 text-primary fa fa-caret-right"></i>
                                </h3>
                            </div>
                            <div className="profile--info">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th className="fw--700 text-darkest">Full Name</th>
                                            <td>{userInfo?.username}</td>
                                        </tr>
                                        <tr>
                                            <th className="fw--700 text-darkest">
                                                {isInstructor ? 'My Courses' : 'My Enrollments'}
                                            </th>
                                            <td>
                                                <ul className='list-unstyled'>
                                                    {courses.length > 0 ? (
                                                        courses.map((course, index) => (
                                                            <li key={index}>
                                                                {isInstructor ? course.title : course}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>No courses available</li>
                                                    )}
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="fw--700 text-darkest">Member Since</th>
                                            <td>{new Date(userInfo?.member_since).toLocaleDateString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {isInstructor && (
                            <div className="profile--item">
                                <div className="profile--heading">
                                    <h3 className="h4 fw--700">
                                        <span className="mr--4">Biography</span>
                                        <i className="ml--10 text-primary fa fa-caret-right"></i>
                                    </h3>
                                </div>
                                <div className="profile--info">
                                    <p>Hello! I’m <strong>{userInfo.firstname} {userInfo.lastname}</strong>. {userInfo.occupation}.</p>
                                </div>
                            </div>
                        )}

                        {isInstructor && (
                            <div className="profile--item">
                                <div className="profile--heading">
                                    <h3 className="h4 fw--700">
                                        <span className="mr--4">Experience</span>
                                        <i className="ml--10 text-primary fa fa-caret-right"></i>
                                    </h3>
                                </div>
                                <div className="profile--info">
                                <p>{userInfo.expertise}.</p>
                                </div>
                            </div>
                        )}

                        <div className="profile--item">
                            <div className="profile--heading">
                                <h3 className="h4 fw--700">
                                    <span className="mr--4">Contact</span>
                                    <i className="ml--10 text-primary fa fa-caret-right"></i>
                                </h3>
                            </div>
                            <div className="profile--info">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th className="fw--700 text-darkest">Phone</th>
                                            <td><a href={`tel:${userInfo?.phone}`}>{userInfo?.phone}</a></td>
                                        </tr>
                                        <tr>
                                            <th className="fw--700 text-darkest">E-mail</th>
                                            <td><a href={`mailto:${userInfo?.email}`}>{userInfo?.email}</a></td>
                                        </tr>
                                        <tr>
                                            <th className="fw--700 text-darkest">LinkedIn</th>
                                            <td><a href={userInfo?.linkedin} target="_blank" rel="noopener noreferrer">{userInfo?.linkedin}</a></td>
                                        </tr>
                                        <tr>
                                            <th className="fw--700 text-darkest">Address</th>
                                            <td>{userInfo?.address}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserProfileSection;
