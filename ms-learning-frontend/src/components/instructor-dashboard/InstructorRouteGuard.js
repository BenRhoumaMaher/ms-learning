import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getInstructors } from '../../helpers/api';

const InstructorRouteGuard = ({ children }) => {
    const { id } = useParams();
    const [isInstructor, setIsInstructor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkInstructorRole = async () => {
            try {
                const instructors = await getInstructors();
                const foundInstructor = instructors.find(instructor =>
                    instructor.id === parseInt(id) &&
                    instructor.roles.includes('ROLE_INSTRUCTOR')
                );
                setIsInstructor(!!foundInstructor);
            } catch (error) {
                console.error('Error verifying instructor:', error);
                setIsInstructor(false);
            } finally {
                setLoading(false);
            }
        };

        checkInstructorRole();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isInstructor) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default InstructorRouteGuard;