import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getUserEnrollements } from '../helpers/api';

const EnrollmentCheckRoute = ({ children }) => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkEnrollment = async () => {
            try {
                const enrollments = await getUserEnrollements();

                const courseId = Number(id);
                if (enrollments && enrollments.course_ids?.includes(courseId)) {
                    setIsAllowed(true);
                } else {
                    setIsAllowed(false);
                }
            } catch (err) {
                console.error("Erreur lors de la vérification de l'inscription :", err);
                setError(err);
                setIsAllowed(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkEnrollment();
    }, [id]);

    if (isLoading) {
        return <div>Vérification de votre inscription...</div>;
    }

    if (error) {
        return <div>Erreur : Impossible de vérifier vos droits d'accès.</div>;
    }

    if (isAllowed) {
        return children;
    }

    return <Navigate to="/" replace />;
};

export default EnrollmentCheckRoute;