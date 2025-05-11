import { Table, Button, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaVideo } from 'react-icons/fa';

export const LessonsTable = ({
    lessons,
    currentPage,
    itemsPerPage,
    onPageChange,
    onView,
    onEdit,
    onDelete
}) => {
    const paginate = (array, page) => {
        return array.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    };

    return (
        <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4><FaVideo className="me-2" />Lessons</h4>
                <span className="text-muted">
                    Showing {paginate(lessons, currentPage).length} of {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="table-responsive mb-3">
                <Table striped bordered hover className="bg-white shadow-sm">
                    <thead className="table-primary">
                        <tr>
                            <th>Title</th>
                            <th>Module</th>
                            <th>Course</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Views</th>
                            <th>Completion</th>
                            <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginate(lessons, currentPage).map((lesson) => (
                            <tr key={lesson.id}>
                                <td>{lesson.title}</td>
                                <td>{lesson.moduleTitle}</td>
                                <td>{lesson.courseTitle}</td>
                                <td>{lesson.type}</td>
                                <td>{lesson.duration} min</td>
                                <td>{lesson.views}</td>
                                <td>{lesson.completion.toFixed(1)}%</td>
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => onView(lesson.id, 'lesson')}
                                            title="View"
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => onEdit(lesson.id, 'lesson')}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => onDelete(lesson.id, 'lesson')}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <Pagination className="justify-content-center">
                <Pagination.Prev
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                />
                {[...Array(Math.ceil(lessons.length / itemsPerPage)).keys()].map(number => (
                    <Pagination.Item
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => onPageChange(number + 1)}
                    >
                        {number + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => onPageChange(Math.min(currentPage + 1, Math.ceil(lessons.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(lessons.length / itemsPerPage)}
                />
            </Pagination>
        </div>
    );
};