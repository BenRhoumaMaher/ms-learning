import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { getInstructorCoursesWithoutQuizes, createQuiz as createQuizApi } from '../../../helpers/api';

export const CreateQuizForm = ({ instructorId, onQuizCreated, onCancel }) => {
    const [coursesWithoutQuiz, setCoursesWithoutQuiz] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [errorCourses, setErrorCourses] = useState('');

    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [timeLimit, setTimeLimit] = useState(30);
    const [passingScore, setPassingScore] = useState(70);

    const [questions, setQuestions] = useState([]);
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState('');

    useEffect(() => {
        if (instructorId) {
            setLoadingCourses(true);
            getInstructorCoursesWithoutQuizes(instructorId)
                .then(data => {
                    setCoursesWithoutQuiz(data || []);
                })
                .catch(err => {
                    setErrorCourses('Failed to load courses: ' + (err.response?.data?.error || err.message));
                })
                .finally(() => setLoadingCourses(false));
        }
    }, [instructorId]);

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            { text: '', type: 'single_choice', answers: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] }
        ]);
    };

    const handleRemoveQuestion = (qIndex) => {
        setQuestions(questions.filter((_, index) => index !== qIndex));
    };

    const handleQuestionChange = (qIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex][field] = value;
        // If type changes to true_false, set default answers
        if (field === 'type' && value === 'true_false') {
            newQuestions[qIndex].answers = [
                { text: 'True', isCorrect: true },
                { text: 'False', isCorrect: false }
            ];
        } else if (field === 'type' && (value === 'single_choice' || value === 'multiple_choice') && newQuestions[qIndex].answers.length < 2) {
            newQuestions[qIndex].answers = [{ text: '', isCorrect: true }, { text: '', isCorrect: false }];
        }
        setQuestions(newQuestions);
    };

    const handleAddAnswer = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers.push({ text: '', isCorrect: false });
        setQuestions(newQuestions);
    };

    const handleRemoveAnswer = (qIndex, aIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].answers.length > 2) { // Keep at least two answers for mcq/single_choice
            newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, index) => index !== aIndex);
            setQuestions(newQuestions);
        }
    };

    const handleAnswerChange = (qIndex, aIndex, field, value) => {
        const newQuestions = [...questions];
        const currentQuestion = newQuestions[qIndex];
        const currentAnswer = currentQuestion.answers[aIndex];

        if (field === 'isCorrect') {
            currentAnswer.isCorrect = value;
            if (value && (currentQuestion.type === 'single_choice' || currentQuestion.type === 'true_false')) {
                // Uncheck other answers for single choice or true/false
                currentQuestion.answers.forEach((ans, idx) => {
                    if (idx !== aIndex) {
                        ans.isCorrect = false;
                    }
                });
            }
        } else {
            currentAnswer[field] = value;
        }
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionError('');
        if (!selectedCourseId) {
            setSubmissionError('Please select a course.');
            return;
        }
        if (!quizTitle.trim()) {
            setSubmissionError('Quiz title is required.');
            return;
        }
        if (questions.length === 0) {
            setSubmissionError('Please add at least one question.');
            return;
        }
        for (const q of questions) {
            if (!q.text.trim()) {
                setSubmissionError(`Question text is required for all questions.`);
                return;
            }
            if (q.answers.some(a => !a.text.trim() && q.type !== 'true_false')) {
                setSubmissionError(`Answer text is required for all options in question: "${q.text.substring(0, 20)}...".`);
                return;
            }
            if (!q.answers.some(a => a.isCorrect)) {
                setSubmissionError(`At least one answer must be marked as correct for question: "${q.text.substring(0, 20)}...".`);
                return;
            }
        }


        setSubmissionLoading(true);
        const quizData = {
            courseId: parseInt(selectedCourseId),
            instructorId: parseInt(instructorId), // Ensure backend uses authenticated user or validates this
            title: quizTitle,
            description: quizDescription,
            timeLimit: parseInt(timeLimit),
            passingScore: parseInt(passingScore),
            questions: questions.map((q, index) => ({
                text: q.text,
                type: q.type,
                position: index + 1,
                answers: q.answers.map(a => ({ text: a.text, isCorrect: !!a.isCorrect }))
            }))
        };

        try {
            await createQuizApi(quizData);
            onQuizCreated();
        } catch (err) {
            setSubmissionError('Failed to create quiz: ' + (err.response?.data?.message || err.response?.data?.error || err.message));
        } finally {
            setSubmissionLoading(false);
        }
    };

    if (loadingCourses) return <div className="text-center p-3"><Spinner animation="border" /> Loading courses...</div>;
    if (errorCourses) return <Alert variant="danger">{errorCourses}</Alert>;

    return (
        <Form onSubmit={handleSubmit}>
            {submissionError && <Alert variant="danger" onClose={() => setSubmissionError('')} dismissible>{submissionError}</Alert>}

            <Form.Group as={Row} className="mb-3" controlId="courseSelect">
                <Form.Label column sm={3}>Course for Quiz</Form.Label>
                <Col sm={9}>
                    {coursesWithoutQuiz.length > 0 ? (
                        <Form.Select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} required>
                            <option value="">-- Select a Course --</option>
                            {coursesWithoutQuiz.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </Form.Select>
                    ) : (
                        <Alert variant="info" className="mb-0">No courses available to add a quiz to (either no courses exist or all have quizzes).</Alert>
                    )}
                </Col>
            </Form.Group>

            {selectedCourseId && (
                <>
                    <hr />
                    <h5>Quiz Details</h5>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="quizTitle">
                                <Form.Label>Quiz Title</Form.Label>
                                <Form.Control type="text" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="quizDescription">
                                <Form.Label>Description (Optional)</Form.Label>
                                <Form.Control as="textarea" rows={1} value={quizDescription} onChange={e => setQuizDescription(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="timeLimit">
                                <Form.Label>Time Limit (minutes)</Form.Label>
                                <Form.Control type="number" value={timeLimit} onChange={e => setTimeLimit(parseInt(e.target.value))} required min="1" />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="passingScore">
                                <Form.Label>Passing Score (%)</Form.Label>
                                <Form.Control type="number" value={passingScore} onChange={e => setPassingScore(parseInt(e.target.value))} required min="0" max="100" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <hr />
                    <h5>Questions</h5>
                    {questions.map((q, qIndex) => (
                        <Card key={qIndex} className="mb-3 bg-light">
                            <Card.Header className="d-flex justify-content-between align-items-center py-2">
                                <span>Question {qIndex + 1}</span>
                                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveQuestion(qIndex)}>
                                    <FaTrash /> Remove
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Question Text</Form.Label>
                                    <Form.Control as="textarea" rows={2} value={q.text} onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Question Type</Form.Label>
                                    <Form.Select value={q.type} onChange={e => handleQuestionChange(qIndex, 'type', e.target.value)}>
                                        <option value="single_choice">Single Choice (Radio buttons)</option>
                                        <option value="multiple_choice">Multiple Choice (Checkboxes)</option>
                                        <option value="true_false">True/False</option>
                                    </Form.Select>
                                </Form.Group>

                                <h6 className="mt-3 mb-2">Answers</h6>
                                {q.answers.map((ans, aIndex) => (
                                    <Row key={aIndex} className="mb-2 align-items-center">
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder={`Answer Option ${aIndex + 1}`}
                                                value={ans.text}
                                                onChange={e => handleAnswerChange(qIndex, aIndex, 'text', e.target.value)}
                                                required={q.type !== 'true_false'}
                                                disabled={q.type === 'true_false'}
                                            />
                                        </Col>
                                        <Col xs="auto">
                                            <Form.Check
                                                type={(q.type === 'single_choice' || q.type === 'true_false') ? 'radio' : 'checkbox'}
                                                label="Correct"
                                                name={`question-${qIndex}-correctAnswer`}
                                                checked={ans.isCorrect}
                                                onChange={e => handleAnswerChange(qIndex, aIndex, 'isCorrect', e.target.checked)}
                                            />
                                        </Col>
                                        {q.type !== 'true_false' && q.answers.length > 2 && (
                                            <Col xs="auto">
                                                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveAnswer(qIndex, aIndex)} title="Remove Answer Option">
                                                    <FaTrash />
                                                </Button>
                                            </Col>
                                        )}
                                    </Row>
                                ))}
                                {q.type !== 'true_false' && (
                                    <Button variant="outline-secondary" size="sm" onClick={() => handleAddAnswer(qIndex)} className="mt-1">
                                        <FaPlus /> Add Answer Option
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    ))}
                    <Button variant="info" onClick={handleAddQuestion} className="mb-3 text-white">
                        <FaPlus /> Add Question
                    </Button>
                </>
            )}

            <div className="mt-4 d-flex justify-content-end">
                <Button variant="secondary" onClick={onCancel} className="me-2" disabled={submissionLoading}>
                    Cancel
                </Button>
                <Button type="submit" variant="success" disabled={submissionLoading || !selectedCourseId || questions.length === 0}>
                    {submissionLoading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Creating...</> : 'Create Quiz'}
                </Button>
            </div>
        </Form>
    );
};