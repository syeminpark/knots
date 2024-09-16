const calculateTimeAgo = (createdAt) => {
    const now = Date.now();
    const timeDifference = now - createdAt;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours}h$`;
    if (minutes > 0) return `${minutes}m`;
    return `now`;
};
export default calculateTimeAgo