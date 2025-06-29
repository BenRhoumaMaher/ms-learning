export const getCurrentUserId = () => {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return null;
        const user = JSON.parse(atob(token.split('.')[1]));
        return user?.user_id;
    } catch (e) {
        console.error('Error decoding token:', e);
        return null;
    }
};

export const getCurrentUser = () => {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return null;
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.error('Error decoding token:', e);
        return null;
    }
};

export const getRoomId = (currentUserId, friendId) => {
    if (!currentUserId || !friendId) return null;
    const userIds = [parseInt(currentUserId), parseInt(friendId)].sort((a, b) => a - b);
    return `room_${userIds.join('_')}`;
};
