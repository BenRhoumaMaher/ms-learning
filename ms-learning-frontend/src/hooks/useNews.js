import { useEffect, useState } from 'react';
import { getLatestCourses, getLatestLiveLessons } from '../helpers/api';

const useNews = () => {
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [courseIndex, setCourseIndex] = useState(0);
    const [lessonIndex, setLessonIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseData, lessonData] = await Promise.all([
                    getLatestCourses(),
                    getLatestLiveLessons()
                ]);
                setCourses(courseData);
                setLessons(lessonData);
            } catch (err) {
                console.error('Failed to fetch courses or lessons:', err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCourseIndex(prev => (courses.length ? (prev + 1) % courses.length : 0));
            setLessonIndex(prev => (lessons.length ? (prev + 1) % lessons.length : 0));
        }, 30000);
        return () => clearInterval(interval);
    }, [courses, lessons]);

    return {
        currentCourse: courses[courseIndex],
        currentLesson: lessons[lessonIndex],
    };
};

export default useNews;
