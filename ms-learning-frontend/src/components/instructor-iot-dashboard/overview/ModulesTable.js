import { Table, Button, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaList } from 'react-icons/fa';

export const ModulesTable = ({
    modules,
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
                <h4><FaList className="me-2" />Modules</h4>
                <span className="text-muted">
                    Showing {paginate(modules, currentPage).length} of {modules.length} module{modules.length !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="table-responsive mb-3">
                <Table striped bordered hover className="bg-white shadow-sm">
                    <thead className="table-primary">
                        <tr>
                            <th>Title</th>
                            <th>Course</th>
                            <th>Position</th>
                            <th>Lessons</th>
                            <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginate(modules, currentPage).map((module) => (
                            <tr key={module.id}>
                                <td>{module.title}</td>
                                <td>{module.courseTitle}</td>
                                <td>{module.position}</td>
                                <td>{module.lessonsCount}</td>
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => onView(module.id, 'module')}
                                            title="View"
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => onEdit(module.id, 'module')}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => onDelete(module.id, 'module')}
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
                {[...Array(Math.ceil(modules.length / itemsPerPage)).keys()].map(number => (
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
                        onPageChange(Math.min(currentPage + 1, Math.ceil(modules.length / itemsPerPage)))
                    }
                    disabled={currentPage === Math.ceil(modules.length / itemsPerPage)}
                />
            </Pagination>
        </div>
    );
};