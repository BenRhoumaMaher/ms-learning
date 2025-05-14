import { useState, useEffect } from "react";
import { getUserEnrollements } from "../helpers/api";

const formatCountdown = (startTime) => {
    const now = new Date();
    const timeDiff = new Date(startTime) - now;

    if (timeDiff <= 0) return "Live now!";

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    if (days > 0) return `Starting in ${days}d ${hours}h`;
    if (hours > 0) return `Starting in ${hours}h ${minutes}m`;
    if (minutes > 0) return `Starting in ${minutes}m ${seconds}s`;
    return `Starting in ${seconds}s`;
};

export const useNextLiveLesson = () => {
    const [nextLiveLesson, setNextLiveLesson] = useState(null);
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        const fetchLiveLessons = async () => {
            try {
                const data = await getUserEnrollements();
                const now = new Date();
                const upcoming = data.live_lessons
                    .filter(lesson => new Date(lesson.liveStartTime) > now)
                    .sort((a, b) => new Date(a.liveStartTime) - new Date(b.liveStartTime));

                if (upcoming.length > 0) {
                    setNextLiveLesson(upcoming[0]);
                }
            } catch (error) {
                console.error("Failed to fetch live lessons", error);
            }
        };

        fetchLiveLessons();
    }, []);

    useEffect(() => {
        if (!nextLiveLesson) return;

        const updateCountdown = () => {
            setCountdown(formatCountdown(nextLiveLesson.liveStartTime));
        };

        updateCountdown(); // initial run
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [nextLiveLesson]);

    return { nextLiveLesson, countdown };
};
