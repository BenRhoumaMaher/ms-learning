import { Table, Button, Image, Alert } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';

export const StudentsTable = ({ students, onSendMessage }) => {
    if (students.length === 0) {
        return (
            <Alert variant="info">
                No students enrolled in your courses yet.
            </Alert>
        );
    }

    return (
        <div className="table-responsive">
            <Table striped bordered hover className="bg-white shadow-sm">
                <thead className="table-primary">
                    <tr>
                        <th style={{ width: '60px' }}>Profile</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Quiz Attempts</th>
                        <th>Average Score</th>
                        <th style={{ width: '150px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td className="align-middle text-center">
                                <Image
                                    src={student.image.startsWith('http')
                                        ? student.image
                                        : `http://localhost:8080${student.image}`}
                                    roundedCircle
                                    width={40}
                                    height={40}
                                    className="border border-primary object-fit-cover"
                                    alt={`${student.name}'s profile`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/default-avatar.png';
                                    }}
                                />
                            </td>
                            <td className="align-middle">{student.name}</td>
                            <td className="align-middle">
                                <a href={`mailto:${student.email}`}>
                                    {student.email}
                                </a>
                            </td>
                            <td className="align-middle text-center">
                                {student.quizAttempts}
                            </td>
                            <td className="align-middle text-center">
                                {student.quizAverage ? `${student.quizAverage.toFixed(1)}%` : 'N/A'}
                            </td>
                            <td className="align-middle">
                                <div className="d-flex gap-2 justify-content-center">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => onSendMessage(student.id)}
                                        title="Send message"
                                        aria-label="Send message"
                                    >
                                        <FaPaperPlane />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};