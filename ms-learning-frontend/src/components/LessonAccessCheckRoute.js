import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getLessonInfo, getUserEnrCourses } from '../helpers/api';

const LessonAccessCheckRoute = ({ children }) => {
    const { id: lessonId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyAccess = async () => {
            try {

                const [lessonInfo, enrollments] = await Promise.all([
                    getLessonInfo(lessonId),
                    getUserEnrCourses()
                ]);

                if (!lessonInfo || !lessonInfo.course?.id) {
                    throw new Error("Impossible de trouver le cours associé à cette leçon.");
                }
                const courseId = lessonInfo.course.id;

                if (!enrollments || !enrollments.course_ids) {
                    throw new Error("Impossible de récupérer les inscriptions de l'étudiant.");
                }

                const isEnrolled = enrollments.course_ids.includes(courseId);
                setIsAllowed(isEnrolled);

                if (!isEnrolled) {
                    console.warn(`Accès refusé : L'étudiant n'est pas inscrit au cours ${courseId} pour voir la leçon ${lessonId}.`);
                }

            } catch (err) {
                console.error("Échec de la vérification de l'accès à la leçon :", err);
                setError(err);
                setIsAllowed(false);
            } finally {
                setIsLoading(false);
            }
        };

        if (lessonId) {
            verifyAccess();
        }
    }, [lessonId]);

    if (isLoading) {
        return <div>Chargement de la leçon...</div>;
    }

    if (error) {
        return <div>Erreur : Impossible de charger le contenu.</div>;
    }

    if (isAllowed) {
        return children;
    }

    return <Navigate to="/" replace />;
};

export default LessonAccessCheckRoute;