// src/components/instructor-iot-dashboard/overview/CourseForms.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { getCourseById, updateCourse, deleteCourse } from '../../../helpers/api';

export const ViewCourseForm = ({ courseId, onClose }) => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(courseId);
                setCourse(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch course details');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center my-3">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!course) {
        return <Alert variant="warning">Course not found</Alert>;
    }

    return (
        <div className="mt-3 p-3 border rounded">
            <h5>View Course</h5>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={course.title} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        plaintext
                        readOnly
                        defaultValue={course.description}
                        rows={3}
                    />
                </Form.Group>

                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Form>
        </div>
    );
};

export const EditCourseForm = ({ courseId, onClose, onUpdate }) => {
    const [course, setCourse] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(courseId);
                setCourse(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch course details');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const updatedCourse = await updateCourse(courseId, course);
            setSuccess('Course updated successfully!');
            if (onUpdate) onUpdate(updatedCourse);
        } catch (err) {
            setError(err.message || 'Failed to update course');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center my-3">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="mt-3 p-3 border rounded">
            <h5>Edit Course</h5>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={course.title}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={course.description}
                        onChange={handleChange}
                        rows={3}
                        required
                    />
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={submitting}>
                        {submitting ? 'Updating...' : 'Update Course'}
                    </Button>
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export const DeleteCourseForm = ({ courseId, onClose, onDelete }) => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(courseId);
                setCourse(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch course details');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleDelete = async () => {
        setDeleting(true);
        setError(null);

        try {
            const result = await deleteCourse(courseId);
            if (result.success) {
                if (onDelete) onDelete(courseId);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(err.message || 'Failed to delete course');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center my-3">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!course) {
        return <Alert variant="warning">Course not found</Alert>;
    }

    return (
        <div className="mt-3 p-3 border rounded">
            <h5>Delete Course</h5>
            <p>Are you sure you want to delete the course: <strong>{course.title}</strong>?</p>
            <p>This action cannot be undone.</p>

            <div className="d-flex gap-2">
                <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Confirm Delete'}
                </Button>
                <Button variant="secondary" onClick={onClose} disabled={deleting}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};