import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getInstructorCourses } from '../helpers/api';

export const useStudentManagement = () => {
    const { id } = useParams();
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [quizStats, setQuizStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await getInstructorCourses(id);

                const allStudents = response.courses.flatMap(course => course.students);
                const studentMap = new Map();

                allStudents.forEach(student => {
                    const existing = studentMap.get(student.id);
                    if (existing) {
                        existing.quizScores = [...existing.quizScores, ...student.quizScores];
                    } else {
                        studentMap.set(student.id, {
                            ...student,
                            quizScores: [...student.quizScores]
                        });
                    }
                });

                const uniqueStudents = Array.from(studentMap.values()).map(student => ({
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    image: student.image || '/default-avatar.png',
                    quizAttempts: student.quizScores.length,
                    quizAverage: student.quizScores.length > 0
                        ? (student.quizScores.reduce((sum, score) => sum + score.percentage, 0) / student.quizScores.length)
                        : null
                }));

                if (response.analytics) {
                    setQuizStats({
                        average: response.analytics.averageScore,
                        min: response.analytics.lowestScore,
                        max: response.analytics.highestScore,
                        count: response.analytics.totalAttempts,
                        totalAttempts: response.analytics.totalAttempts
                    });
                }

                setStudents(uniqueStudents);
                setCourses(response.courses);
                setError(null);
            } catch (err) {
                console.error('Error fetching students:', err);
                setError(err.message || 'Failed to load students');
                setStudents([]);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStudents();
        } else {
            setError('Invalid instructor ID');
            setLoading(false);
        }
    }, [id]);

    const quizzes = courses.flatMap(course => course.quiz ? [{
        ...course.quiz,
        courseTitle: course.title,
        courseId: course.id
    }] : []);

    const questions = quizzes.flatMap(quiz =>
        quiz.questions.map(question => ({
            ...question,
            quizTitle: quiz.title,
            quizId: quiz.id,
            courseTitle: quiz.courseTitle
        })));

    return {
        students,
        quizzes,
        questions,
        quizStats,
        loading,
        error
    };
};