import { useState, useEffect } from "react";

const useLessonPlayer = (modules, lessonId, videoRef) => {
    const [notes, setNotes] = useState(null);
    const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
    const [notesError, setNotesError] = useState(null);
    const [showFullTranscript, setShowFullTranscript] = useState(false);

    const [flatLessons, setFlatLessons] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [currentVideo, setCurrentVideo] = useState("");
    const [subtitles, setSubtitles] = useState([]);
    const [showSubtitles, setShowSubtitles] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationError, setTranslationError] = useState(null);
    const [activeSubtitle, setActiveSubtitle] = useState(null);
    const [targetLanguage, setTargetLanguage] = useState('fr');
    const [isLoading, setIsLoading] = useState(true);
    const [videoReady, setVideoReady] = useState(false);

    const generateNotes = async () => {
        try {
            setIsGeneratingNotes(true);
            setNotesError(null);
            const response = await fetch(`http://localhost:8080/lessons/${currentLesson.id}/generate-notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to generate notes');
            const data = await response.json();
            if (data.status === 'success') {
                setNotes({ summary: data.summary, fullTranscript: data.full_transcript });
            } else {
                throw new Error(data.message || 'Failed to generate notes');
            }
        } catch (error) {
            setNotesError(error.message);
        } finally {
            setIsGeneratingNotes(false);
        }
    };

    const fetchSubtitles = async (lessonId, lang = 'fr') => {
        try {
            setIsTranslating(true);
            setTranslationError(null);
            const response = await fetch(`http://localhost:8080/lessons/${lessonId}/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `lang=${lang}`
            });
            if (!response.ok) throw new Error(response.status === 404 ? 'Lesson not found' : 'Translation failed');
            const data = await response.json();
            if (data.status === 'success') {
                setSubtitles(data.segments);
                setShowSubtitles(true);
            } else {
                throw new Error(data.message || 'Translation failed');
            }
        } catch (error) {
            setTranslationError(error.message);
            setShowSubtitles(false);
        } finally {
            setIsTranslating(false);
        }
    };

    useEffect(() => {
        const fetchLessonData = async () => {
            setIsLoading(true);
            try {
                const lessons = [];
                modules.forEach((mod) =>
                    mod.lessons.forEach((lesson) =>
                        lessons.push({ ...lesson, moduleTitle: mod.title })
                    )
                );
                setFlatLessons(lessons);
                const foundIndex = lessons.findIndex((l) => l.id === parseInt(lessonId));
                const indexToUse = foundIndex !== -1 ? foundIndex : 0;
                setCurrentIndex(indexToUse);
                const lesson = lessons[indexToUse];
                setCurrentLesson(lesson);
                setCurrentVideo(`http://localhost:8080/${lesson.video_url}`);
                setSubtitles([]);
                setShowSubtitles(false);
            } catch (error) {
                console.error('Error loading lesson:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (modules.length > 0) {
            fetchLessonData();
        }
    }, [lessonId, modules]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;
        const handleTimeUpdate = () => {
            if (!showSubtitles || subtitles.length === 0) return;
            const currentTime = videoElement.currentTime;
            const activeSub = subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);
            setActiveSubtitle(activeSub?.text || null);
        };
        const handleReady = () => setVideoReady(true);
        videoElement.addEventListener('timeupdate', handleTimeUpdate);
        videoElement.addEventListener('canplay', handleReady);
        return () => {
            videoElement.removeEventListener('timeupdate', handleTimeUpdate);
            videoElement.removeEventListener('canplay', handleReady);
        };
    }, [showSubtitles, subtitles,videoRef]);

    const handleLessonSelect = (index) => {
        const lesson = flatLessons[index];
        if (lesson) {
            setCurrentIndex(index);
            setCurrentLesson(lesson);
            setCurrentVideo(`http://localhost:8080/${lesson.video_url}`);
            setSubtitles([]);
            setShowSubtitles(false);
            setVideoReady(false);
        }
    };

    const scroll = (direction) => {
        const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (newIndex >= 0 && newIndex < flatLessons.length) {
            handleLessonSelect(newIndex);
        }
    };

    const getVisibleLessons = () => {
        const visible = [];
        if (flatLessons[currentIndex - 1]) visible.push({ ...flatLessons[currentIndex - 1], viewType: "prev" });
        visible.push({ ...flatLessons[currentIndex], viewType: "current" });
        if (flatLessons[currentIndex + 1]) visible.push({ ...flatLessons[currentIndex + 1], viewType: "next" });
        return visible;
    };

    return {
        notes,
        isGeneratingNotes,
        notesError,
        showFullTranscript,
        setShowFullTranscript,
        generateNotes,

        flatLessons,
        currentIndex,
        currentLesson,
        currentVideo,
        handleLessonSelect,
        scroll,
        getVisibleLessons,

        subtitles,
        showSubtitles,
        isTranslating,
        translationError,
        activeSubtitle,
        targetLanguage,
        setTargetLanguage,
        fetchSubtitles,

        isLoading,
        videoReady,
        setShowSubtitles,
    };
};

export default useLessonPlayer;
