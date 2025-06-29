import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getCurrentUserId } from '../helpers/messageHelpers';

const UserSpecificRoute = ({ children }) => {
    const { id } = useParams();

    const currentUserId = getCurrentUserId();

    if (String(currentUserId) !== id) {
        console.warn(`Accès non autorisé : l'utilisateur ${currentUserId} a tenté d'accéder à la page de l'utilisateur ${id}. Redirection.`);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default UserSpecificRoute;