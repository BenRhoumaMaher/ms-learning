import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserEnrollements } from '../../helpers/api';
import '../../styles/styles.css';

const UserEnrollments = () => {
    const { id } = useParams();
    const [enrollments, setEnrollments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserEnrollements(id);
                setEnrollments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="text-center my-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;
    if (!enrollments) return <div className="alert alert-info">No enrollments found</div>;

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">Enrolled Courses</h2>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-5">
                {enrollments.course_titles.map((title, index) => (
                    <div className="col" key={enrollments.enrollment_ids[index]}>
                        <div className="enrcard h-100">
                            <img
                                src={`http://localhost:8080/${enrollments.course_images[index]}`}
                                className="enrcard-img-top"
                                alt={title}
                                style={{ height: '180px', objectFit: 'cover' }}
                            />
                            <div className="enrcard-body">
                                <h5 className="enrcard-title">{title}</h5>
                            </div>
                            <div className="card-footer bg-transparent">
                                <a
                                    href={`/registered-courses/${enrollments.course_ids[index]}`}
                                    className="btn btn-primary w-100"
                                >
                                    View Course
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserEnrollments;