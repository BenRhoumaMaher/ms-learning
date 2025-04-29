export const getBackgroundStyle = (imageUrl) => ({
    backgroundImage: `url(http://localhost:8080/${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
    color: '#fff',
    position: 'relative',
});

export const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
};

export const contentStyle = {
    position: 'relative',
    zIndex: 2,
};
