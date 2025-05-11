import { Table, Button, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaBook } from 'react-icons/fa';

export const CoursesTable = ({
    courses,
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
                <h4><FaBook className="me-2" />Courses</h4>
                <span className="text-muted">
                    Showing {paginate(courses, currentPage).length} of {courses.length} course{courses.length !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="table-responsive mb-3">
                <Table striped bordered hover className="bg-white shadow-sm">
                    <thead className="table-primary">
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Duration</th>
                            <th>Modules</th>
                            <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginate(courses, currentPage).map((course) => (
                            <tr key={course.id}>
                                <td>{course.title}</td>
                                <td>{course.category}</td>
                                <td>${course.price}</td>
                                <td>{course.duration}</td>
                                <td>{course.modulesCount}</td>
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => onView(course.id, 'course')}
                                            title="View"
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => onEdit(course.id, 'course')}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => onDelete(course.id, 'course')}
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
                {[...Array(Math.ceil(courses.length / itemsPerPage)).keys()].map(number => (
                    <Pagination.Item
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => onPageChange(number + 1)}
                    >
                        {number + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() =>
                        onPageChange(Math.min(currentPage + 1, Math.ceil(courses.length / itemsPerPage)))
                    }
                    disabled={currentPage === Math.ceil(courses.length / itemsPerPage)}
                />
            </Pagination>
        </div>
    );
};