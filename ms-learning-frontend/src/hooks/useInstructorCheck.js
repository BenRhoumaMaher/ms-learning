import { useState, useEffect } from 'react';
import { getInstructorById } from '../helpers/api';

const useInstructorCheck = (userId) => {
    const [isInstructor, setIsInstructor] = useState(false);

    useEffect(() => {
        const checkInstructor = async () => {
            if (!userId) return;
            try {
                await getInstructorById(userId);
                setIsInstructor(true);
            } catch {
                console.warn('Not an instructor');
                setIsInstructor(false);
            }
        };

        checkInstructor();
    }, [userId]);

    return isInstructor;
};

export default useInstructorCheck;
