import React, { useState } from 'react';
import { Spinner, Alert, Button, Card } from 'react-bootstrap';
import { useInstructorDashboard } from '../../../hooks/useInstructorDashboard';
import { StatisticsCards } from '../../../components/instructor-iot-dashboard/overview/StatisticsCards';
import { InstructorChart } from '../../../components/instructor-iot-dashboard/overview/InstructorChart';
import { CoursesTable } from '../../../components/instructor-iot-dashboard/overview/CoursesTable';
import { ModulesTable } from '../../../components/instructor-iot-dashboard/overview/ModulesTable';
import { LessonsTable } from '../../../components/instructor-iot-dashboard/overview/LessonsTable';
import { ForumPostsTable } from '../../../components/instructor-iot-dashboard/overview/ForumPostsTable';

const Overview = () => {
    const {
        courses,
        modules,
        lessons,
        forumPosts,
        loading,
        error,
        instructorStats
    } = useInstructorDashboard();

    const [coursesPage, setCoursesPage] = useState(1);
    const [modulesPage, setModulesPage] = useState(1);
    const [lessonsPage, setLessonsPage] = useState(1);
    const [forumPostsPage, setForumPostsPage] = useState(1);
    const itemsPerPage = 10;

    const handleView = (id, type) => {
        console.log(`View ${type} with ID: ${id}`);
    };

    const handleEdit = (id, type) => {
        console.log(`Edit ${type} with ID: ${id}`);
    };

    const handleDelete = (id, type) => {
        console.log(`Delete ${type} with ID: ${id}`);
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
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ModulesTable
                modules={modules}
                currentPage={modulesPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setModulesPage}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <LessonsTable
                lessons={lessons}
                currentPage={lessonsPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setLessonsPage}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ForumPostsTable
                forumPosts={forumPosts}
                currentPage={forumPostsPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setForumPostsPage}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Overview;