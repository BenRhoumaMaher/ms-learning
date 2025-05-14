import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { getLessonInfo, updateLesson, deleteLesson } from '../../../helpers/api';

export const ViewLessonForm = ({ lessonId, onClose }) => {
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const data = await getLessonInfo(lessonId);
                setLesson(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch lesson details');
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId]);

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

    if (!lesson) {
        return <Alert variant="warning">Lesson not found</Alert>;
    }

    return (
        <div className="mt-3 p-3 border rounded">
            <h5>View Lesson</h5>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={lesson.title} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        plaintext
                        readOnly
                        defaultValue={lesson.description}
                        rows={3}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        plaintext
                        readOnly
                        defaultValue={lesson.content}
                        rows={5}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Created At</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={new Date(lesson.createdAt).toLocaleString()} />
                </Form.Group>

                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Form>
        </div>
    );
};

export const EditLessonForm = ({ lessonId, onClose, onUpdate }) => {
    const [lesson, setLesson] = useState({ title: '', description: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const data = await getLessonInfo(lessonId);
                setLesson(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch lesson details');
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLesson(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const updatedLesson = await updateLesson(lessonId, lesson);
            setSuccess('Lesson updated successfully!');
            if (onUpdate) onUpdate(updatedLesson);
        } catch (err) {
            setError(err.message || 'Failed to update lesson');
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
            <h5>Edit Lesson</h5>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={lesson.title}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={lesson.description}
                        onChange={handleChange}
                        rows={3}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="content"
                        value={lesson.content}
                        onChange={handleChange}
                        rows={5}
                        required
                    />
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={submitting}>
                        {submitting ? 'Updating...' : 'Update Lesson'}
                    </Button>
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export const DeleteLessonForm = ({ lessonId, onClose, onDelete }) => {
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const data = await getLessonInfo(lessonId);
                setLesson(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch lesson details');
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId]);

    const handleDelete = async () => {
        setDeleting(true);
        setError(null);

        try {
            await deleteLesson(lessonId);
            if (onDelete) onDelete(lessonId);
        } catch (err) {
            setError(err.message || 'Failed to delete lesson');
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

    if (!lesson) {
        return <Alert variant="warning">Lesson not found</Alert>;
    }

    return (
        <div className="mt-3 p-3 border rounded">
            <h5>Delete Lesson</h5>
            <p>Are you sure you want to delete the lesson: <strong>{lesson.title}</strong>?</p>
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