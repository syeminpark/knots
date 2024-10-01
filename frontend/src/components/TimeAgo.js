import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TimeAgo = ({ createdAt }) => {
    const { t } = useTranslation();
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        const updateTimeAgo = () => {

            const now = Date.now();
            const timeDifference = now - new Date(createdAt).getTime();
            const seconds = Math.floor(timeDifference / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) {
                const key = days === 1 ? 'timeAgo.day' : 'timeAgo.days';
                setTimeAgo(t(key, { count: days }));
            } else if (hours > 0) {
                setTimeAgo(t('timeAgo.hour', { count: hours }));
            } else if (minutes > 0) {
                setTimeAgo(t('timeAgo.minute', { count: minutes }));
            } else {
                setTimeAgo(t('timeAgo.now'));
            }
        };

        updateTimeAgo();
        const interval = setInterval(updateTimeAgo, 60000);
        return () => clearInterval(interval);
    }, [createdAt]);

    return timeAgo;
};

export default TimeAgo;


export const formatDateNow = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() is zero-indexed, so add 1.
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hour + 11) % 12 + 1); // Convert 24h to 12h format
    const formattedMinute = minute < 10 ? `0${minute}` : minute; // Ensure two-digit minutes
    return `${year}:${month < 10 ? `0${month}` : month}:${day}:${formattedHour}:${formattedMinute}${amPm}`;
};
