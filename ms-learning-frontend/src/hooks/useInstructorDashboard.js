import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    getUserCoursesModules,
    getInstructorForumPosts,
    getInstructorCourses,
    getInstructorContent
} from '../helpers/api';

export const useInstructorDashboard = () => {
    const { id } = useParams();
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [forumPosts, setForumPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [instructorStats, setInstructorStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalReviews: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [coursesResponse, forumPostsResponse, instructorCourses, instructorContent] = await Promise.all([
                    getUserCoursesModules(),
                    getInstructorForumPosts(id),
                    getInstructorCourses(id),
                    getInstructorContent(id)
                ]);

                const totalStudents = instructorCourses.courses.reduce((acc, course) => {
                    return acc + (course.students ? course.students.length : 0);
                }, 0);

                const totalReviews = (instructorContent.reviews.analytics.total_reviews || 0) +
                    (instructorContent.posts.analytics.total_posts || 0);

                setInstructorStats({
                    totalCourses: instructorCourses.courses.length,
                    totalStudents,
                    totalReviews
                });

                const coursesData = coursesResponse.courses.map(course => ({
                    id: course.id,
                    title: course.title,
                    category: course.category,
                    price: course.price,
                    duration: course.duration,
                    modulesCount: course.modules.length
                }));

                const modulesData = coursesResponse.courses.flatMap(course =>
                    course.modules.map(module => ({
                        id: module.id,
                        title: module.title,
                        courseTitle: course.title,
                        position: module.position,
                        lessonsCount: module.lessons.length
                    }))
                );

                const lessonsData = coursesResponse.courses.flatMap(course =>
                    course.modules.flatMap(module =>
                        module.lessons.map(lesson => ({
                            id: lesson.id,
                            title: lesson.title,
                            moduleTitle: module.title,
                            courseTitle: course.title,
                            type: lesson.type,
                            duration: lesson.duration,
                            views: lesson.analytics?.totalViews || 0,
                            completion: lesson.analytics?.averageCompletion || 0
                        }))
                    )
                );

                setCourses(coursesData);
                setModules(modulesData);
                setLessons(lessonsData);
                setForumPosts(forumPostsResponse);
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return {
        courses,
        modules,
        lessons,
        forumPosts,
        loading,
        error,
        instructorStats
    };
};