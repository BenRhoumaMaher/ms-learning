import { Table, Button } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export const QuestionsTable = ({ questions }) => {
    return (
        <div className="table-responsive">
            <Table striped bordered hover className="bg-white shadow-sm">
                <thead className="table-primary">
                    <tr>
                        <th>ID</th>
                        <th>Question</th>
                        <th>Type</th>
                        <th>Quiz</th>
                        <th>Course</th>
                        <th>Position</th>
                        <th>Created At</th>
                        <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.length > 0 ? (
                        questions.map(question => (
                            <tr key={`${question.quizId}-${question.id}`}>
                                <td>{question.id}</td>
                                <td>{question.text}</td>
                                <td>{question.type}</td>
                                <td>{question.quizTitle}</td>
                                <td>{question.courseTitle}</td>
                                <td>{question.position}</td>
                                <td>{question.createdAt}</td>
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
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
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
                                No questions found in your quizzes
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};