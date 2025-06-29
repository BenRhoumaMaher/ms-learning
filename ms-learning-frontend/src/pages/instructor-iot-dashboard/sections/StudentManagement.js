import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Spinner, Alert, Card } from 'react-bootstrap';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useStudentManagement } from '../../../hooks/useStudentManagement';
import { StudentsTable } from '../../../components/instructor-iot-dashboard/student-management/StudentsTable';
import { QuizzesTable } from '../../../components/instructor-iot-dashboard/student-management/QuizzesTable';
import { QuestionsTable } from '../../../components/instructor-iot-dashboard/student-management/QuestionsTable';
import { QuizPerformanceChart } from '../../../components/instructor-iot-dashboard/student-management/QuizPerformanceChart';
import { QuizStatsSummary } from '../../../components/instructor-iot-dashboard/student-management/QuizStatsSummary';
import { getInstructorCoursesWithoutQuizes } from '../../../helpers/api';
import { CreateQuizForm } from '../../../components/instructor-iot-dashboard/student-management/CreateQuizForm';

const StudentManagement = () => {
    const navigate = useNavigate();
    const { id: instructorId } = useParams();
    const {
        students,
        quizzes,
        questions,
        quizStats,
        loading,
        error
    } = useStudentManagement(instructorId);

    const [showCreateQuizForm, setShowCreateQuizForm] = useState(false);

    const handleSendMessage = (studentId) => {
        navigate(`/messages/compose?to=${studentId}`);
    };

    const handleEditQuiz = (quizId) => {
        navigate(`/quizzes/edit/${quizId}`);
    };

    const handleDeleteQuiz = (quizId) => {
        console.log('Delete quiz:', quizId);
    };

    const handleQuizCreated = () => {
        setShowCreateQuizForm(false);
    };

    if (!instructorId) {
        return (
            <div className="p-4">
                <Alert variant="danger">
                    Instructor ID not specified. Redirecting...
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#0077b6' }}>Student Management</h2>
                <Button
                    variant="outline-primary"
                    onClick={() => navigate(-1)}
                    className="d-flex align-items-center"
                >
                    <FaArrowLeft className="me-2" />
                    Back to Dashboard
                </Button>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <Spinner animation="border" variant="primary" />
                    <span className="ms-3">Loading data...</span>
                </div>
            ) : error ? (
                <Alert variant="danger" className="mt-3">
                    {error}
                    <div className="mt-2">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </div>
                </Alert>
            ) : (
                <>
                    <div className="mb-5">
                        <h4 className="mb-3" style={{ color: '#0077b6' }}>Students</h4>
                        <StudentsTable
                            students={students}
                            onSendMessage={handleSendMessage}
                        />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 style={{ color: '#0077b6' }}>Quizzes</h4>
                        <Button variant="primary" onClick={() => setShowCreateQuizForm(!showCreateQuizForm)}>
                            <FaPlus className="me-2" />
                            {showCreateQuizForm ? 'Cancel Creation' : 'Create New Quiz'}
                        </Button>
                    </div>

                    {showCreateQuizForm && (
                        <Card className="mb-4 shadow-sm">
                            <Card.Body>
                                <CreateQuizForm
                                    instructorId={instructorId}
                                    onQuizCreated={handleQuizCreated}
                                    onCancel={() => setShowCreateQuizForm(false)}
                                />
                            </Card.Body>
                        </Card>
                    )}

                    <div className="mb-5">
                        <QuizzesTable
                            quizzes={quizzes}
                            onEditQuiz={handleEditQuiz}
                            onDeleteQuiz={handleDeleteQuiz}
                        />
                    </div>

                    <div className="mb-5">
                        <h4 className="mb-3" style={{ color: '#0077b6' }}>Questions</h4>
                        <QuestionsTable questions={questions} />
                    </div>

                    {quizStats && (
                        <QuizStatsSummary quizStats={quizStats}>
                            <QuizPerformanceChart quizStats={quizStats} />
                        </QuizStatsSummary>
                    )}
                </>
            )}
        </div>
    );
};

export default StudentManagement;