import React from 'react';
import { Link } from 'react-router-dom';
import usePopularCourses from '../../../../../hooks/usePopularCourses';
import { useTranslation } from 'react-i18next';

const PopularCoursesWidget = () => {
    const { t } = useTranslation();
    const popularCourses = usePopularCourses();

    return (
        <div className="widget">
            <h4 className="widget-title">
                <i className="icofont-flame-torch"></i> {t("Popular Courses")}
            </h4>

            <ul className="premium-course">
                {popularCourses.map((course) => (
                    <li key={course.id}>
                        <figure>
                            <img
                                src={`http://localhost:8080/${course.image}`}
                                alt={course.title}
                                style={{ width: '100%', borderRadius: '8px' }}
                            />
                            <span className="tag">{course.tag}</span>
                        </figure>
                        <div className="vid-course">
                            <h5>
                                <Link to={`/registered-courses/${course.id}`} className="text-info" title={course.title}>
                                    {course.title}
                                </Link>
                            </h5>
                            <ins className="price mt-2">
                                {course.tag === 'Free' ? t("Free") : `$${course.price}/M`}
                            </ins>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PopularCoursesWidget;
