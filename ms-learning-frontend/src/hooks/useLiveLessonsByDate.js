import { useEffect, useState } from "react";
import { getUserEnrollements } from "../helpers/api";

export const useLiveLessonsByDate = () => {
    const [liveLessons, setLiveLessons] = useState([]);
    const [lessonsByDate, setLessonsByDate] = useState({});

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const data = await getUserEnrollements();
                const lessons = data.live_lessons || [];
                setLiveLessons(lessons);

                const mapping = {};
                lessons.forEach(lesson => {
                    const date = new Date(lesson.liveStartTime);
                    const key = date.toISOString().split("T")[0];
                    if (!mapping[key]) mapping[key] = [];
                    mapping[key].push(lesson);
                });

                setLessonsByDate(mapping);
            } catch (error) {
                console.error("Error fetching live lessons:", error);
            }
        };

        fetchEnrollments();
    }, []);

    return { liveLessons, lessonsByDate };
};
