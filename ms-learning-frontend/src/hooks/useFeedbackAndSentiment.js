import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getInstructorContent } from '../helpers/api';

export const useFeedbackAndSentiment = () => {
    const { id } = useParams();
    const [contentData, setContentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const response = await getInstructorContent(id);
                setContentData(response);
                setError(null);
            } catch (err) {
                console.error('Error fetching content:', err);
                setError(err.message || 'Failed to load feedback data');
                setContentData(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchContent();
        } else {
            setError('Invalid instructor ID');
            setLoading(false);
        }
    }, [id]);

    return {
        contentData,
        loading,
        error
    };
};