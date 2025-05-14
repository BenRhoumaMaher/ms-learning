import React, { useState } from 'react';
import { Spinner, Alert, Button, Card } from 'react-bootstrap';
import { useInstructorDashboard } from '../../../hooks/useInstructorDashboard';
import { StatisticsCards } from '../../../components/instructor-iot-dashboard/overview/StatisticsCards';
import { InstructorChart } from '../../../components/instructor-iot-dashboard/overview/InstructorChart';
import { CoursesTable } from '../../../components/instructor-iot-dashboard/overview/CoursesTable';
import { ModulesTable } from '../../../components/instructor-iot-dashboard/overview/ModulesTable';
import { LessonsTable } from '../../../components/instructor-iot-dashboard/overview/LessonsTable';
import { ForumPostsTable } from '../../../components/instructor-iot-dashboard/overview/ForumPostsTable';
import { ViewCourseForm, EditCourseForm, DeleteCourseForm } from '../overview/CourseForms';
import { ViewLessonForm, EditLessonForm, DeleteLessonForm } from '../overview/LessonForms';

const Overview = () => {
    const {
        courses,
        modules,
        lessons,
        forumPosts,
        loading,
        error,
        instructorStats,
        refreshData
    } = useInstructorDashboard();

    const [coursesPage, setCoursesPage] = useState(1);
    const [modulesPage, setModulesPage] = useState(1);
    const [lessonsPage, setLessonsPage] = useState(1);
    const [forumPostsPage, setForumPostsPage] = useState(1);
    const itemsPerPage = 10;

    const [activeCourseForm, setActiveCourseForm] = useState({
        type: null,
        courseId: null
    });

    const [activeLessonForm, setActiveLessonForm] = useState({
        type: null,
        lessonId: null
    });

    const handleCourseView = (id) => {
        setActiveCourseForm({ type: 'view', courseId: id });
    };

    const handleCourseEdit = (id) => {
        setActiveCourseForm({ type: 'edit', courseId: id });
    };

    const handleCourseDelete = (id) => {
        setActiveCourseForm({ type: 'delete', courseId: id });
    };

    const closeCourseForm = () => {
        setActiveCourseForm({ type: null, courseId: null });
    };

    const handleCourseUpdated = (updatedCourse) => {
        refreshData();
        closeCourseForm();
    };

    const handleCourseDeleted = (deletedCourseId) => {
        refreshData();
        closeCourseForm();
    };

    const handleLessonView = (id) => {
        setActiveLessonForm({ type: 'view', lessonId: id });
    };

    const handleLessonEdit = (id) => {
        setActiveLessonForm({ type: 'edit', lessonId: id });
    };

    const handleLessonDelete = (id) => {
        setActiveLessonForm({ type: 'delete', lessonId: id });
    };

    const closeLessonForm = () => {
        setActiveLessonForm({ type: null, lessonId: null });
    };

    const handleLessonUpdated = (updatedLesson) => {
        refreshData();
        closeLessonForm();
    };

    const handleLessonDeleted = (deletedLessonId) => {
        refreshData();
        closeLessonForm();
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Loading data...</span>
            </div>
        );
    }

    if (error) {
        return (
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
        );
    }

    return (
        <div className="p-4">
            <h2 className="mb-4" style={{ color: '#0077b6' }}>Instructor Dashboard</h2>

            <StatisticsCards instructorStats={instructorStats} />
            <InstructorChart instructorStats={instructorStats} />

            <CoursesTable
                courses={courses}
                currentPage={coursesPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setCoursesPage}
                onView={handleCourseView}
                onEdit={handleCourseEdit}
                onDelete={handleCourseDelete}
            />

            {/* Course Forms */}
            {activeCourseForm.type === 'view' && (
                <ViewCourseForm
                    courseId={activeCourseForm.courseId}
                    onClose={closeCourseForm}
                />
            )}

            {activeCourseForm.type === 'edit' && (
                <EditCourseForm
                    courseId={activeCourseForm.courseId}
                    onClose={closeCourseForm}
                    onUpdate={handleCourseUpdated}
                />
            )}

            {activeCourseForm.type === 'delete' && (
                <DeleteCourseForm
                    courseId={activeCourseForm.courseId}
                    onClose={closeCourseForm}
                    onDelete={handleCourseDeleted}
                />
            )}

            <ModulesTable
                modules={modules}
                currentPage={modulesPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setModulesPage}
            />

            <LessonsTable
                lessons={lessons}
                currentPage={lessonsPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setLessonsPage}
                onView={handleLessonView}
                onEdit={handleLessonEdit}
                onDelete={handleLessonDelete}
            />

            {/* Lesson Forms */}
            {activeLessonForm.type === 'view' && (
                <ViewLessonForm
                    lessonId={activeLessonForm.lessonId}
                    onClose={closeLessonForm}
                />
            )}

            {activeLessonForm.type === 'edit' && (
                <EditLessonForm
                    lessonId={activeLessonForm.lessonId}
                    onClose={closeLessonForm}
                    onUpdate={handleLessonUpdated}
                />
            )}

            {activeLessonForm.type === 'delete' && (
                <DeleteLessonForm
                    lessonId={activeLessonForm.lessonId}
                    onClose={closeLessonForm}
                    onDelete={handleLessonDeleted}
                />
            )}

            <ForumPostsTable
                forumPosts={forumPosts}
                currentPage={forumPostsPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setForumPostsPage}
            />
        </div>
    );
};

export default Overview;