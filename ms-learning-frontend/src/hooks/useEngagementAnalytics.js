import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserCoursesModules } from '../helpers/api';

export const useEngagementAnalytics = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEngagementData = async () => {
            try {
                setLoading(true);
                const response = await getUserCoursesModules();

                if (response.videoAnalytics) {
                    setData(response);
                    setError(null);
                } else {
                    throw new Error('No video analytics data available');
                }
            } catch (err) {
                console.error('Error fetching engagement data:', err);
                setError(err.message || 'Failed to load engagement analytics');
            } finally {
                setLoading(false);
            }
        };

        fetchEngagementData();
    }, [id]);

    const getTopInteractiveLessons = () => {
        if (!data) return [];

        const allLessons = [];
        data.courses.forEach(course => {
            course.modules.forEach(module => {
                module.lessons.forEach(lesson => {
                    if (lesson.type === 'registered' && lesson.analytics) {
                        allLessons.push({
                            id: lesson.id,
                            title: lesson.title,
                            pauses: lesson.analytics.totalPauses,
                            replays: lesson.analytics.totalReplays,
                            totalInteractions: lesson.analytics.totalPauses + lesson.analytics.totalReplays
                        });
                    }
                });
            });
        });

        return allLessons.sort((a, b) => b.totalInteractions - a.totalInteractions).slice(0, 2);
    };

    return {
        data,
        loading,
        error,
        getTopInteractiveLessons
    };
};