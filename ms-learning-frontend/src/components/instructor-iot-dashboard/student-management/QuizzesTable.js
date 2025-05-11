import { Table, Button } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export const QuizzesTable = ({ quizzes, onEditQuiz, onDeleteQuiz }) => {
    return (
        <div className="table-responsive">
            <Table striped bordered hover className="bg-white shadow-sm">
                <thead className="table-primary">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Course</th>
                        <th>Time Limit (min)</th>
                        <th>Passing Score</th>
                        <th>Questions</th>
                        <th>Created At</th>
                        <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes.length > 0 ? (
                        quizzes.map(quiz => (
                            <tr key={quiz.id}>
                                <td>{quiz.id}</td>
                                <td>{quiz.title}</td>
                                <td>{quiz.courseTitle}</td>
                                <td>{quiz.timeLimit}</td>
                                <td>{quiz.passingScore}%</td>
                                <td>{quiz.questions.length}</td>
                                <td>{quiz.createdAt}</td>
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            title="View"
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => onEditQuiz(quiz.id)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => onDeleteQuiz(quiz.id)}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-4">
                                No quizzes found in your courses
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};