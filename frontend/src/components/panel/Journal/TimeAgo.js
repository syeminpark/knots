import { useState, useEffect } from 'react';

const TimeAgo = ({ createdAt }) => {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        const updateTimeAgo = () => {
            const now = Date.now();
            const timeDifference = now - createdAt;

            const seconds = Math.floor(timeDifference / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) {
                setTimeAgo(`${days} day${days > 1 ? 's' : ''}`);
            } else if (hours > 0) {
                setTimeAgo(`${hours}h`);
            } else if (minutes > 0) {
                setTimeAgo(`${minutes}m`);
            } else {
                setTimeAgo(`now`);
            }
        };

        updateTimeAgo();
        const interval = setInterval(updateTimeAgo, 60000);
        return () => clearInterval(interval);
    }, [createdAt]);

    return timeAgo;
};

export default TimeAgo;
