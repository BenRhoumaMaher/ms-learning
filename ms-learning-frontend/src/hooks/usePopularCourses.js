import { useEffect, useState } from 'react';
import { getCourses } from '../helpers/api';

const usePopularCourses = () => {
    const [popularCourses, setPopularCourses] = useState([]);

    useEffect(() => {
        const loadPopularCourses = async () => {
            try {
                const courses = await getCourses();

                const freeCourses = courses.filter(course => parseFloat(course.price) === 0);
                const premiumCourses = courses.filter(course => parseFloat(course.price) > 0);

                const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

                const selected = [];
                if (freeCourses.length) selected.push({ ...pickRandom(freeCourses), tag: 'Free' });
                if (premiumCourses.length) selected.push({ ...pickRandom(premiumCourses), tag: 'Premium' });

                setPopularCourses(selected);
            } catch (error) {
                console.error('Failed to load popular courses:', error);
            }
        };

        loadPopularCourses();
    }, []);

    return popularCourses;
};

export default usePopularCourses;
