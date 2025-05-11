import { useState, useEffect } from "react";
import { trackLessonEngagement, trackLessonView } from '../helpers/api';

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

    const [lastPosition, setLastPosition] = useState(0);
    const [pauses, setPauses] = useState(0);
    const [replays, setReplays] = useState(0);
    const [hasTrackedView, setHasTrackedView] = useState(false);
    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!hasTrackedView && currentLesson?.id) {
            trackLessonView(currentLesson.id).catch(console.error);
            setHasTrackedView(true);
        }
    }, [currentLesson?.id, hasTrackedView]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        let effectiveWatchTime = 0;
        let lastTrackedTime = videoElement.currentTime;

        const trackEngagement = async () => {
            if (!currentLesson?.id) return;

            const currentTime = videoElement.currentTime;
            const duration = videoElement.duration;
            const completionPercentage = duration > 0 ?
                Math.min(100, (currentTime / duration) * 100) : 0;

            try {
                await trackLessonEngagement(currentLesson.id, {
                    watchTime: currentTime - lastPosition,
                    pauseCount: pauses,
                    replayCount: replays,
                    completionPercentage
                });

                setLastPosition(currentTime);
                setPauses(0);
                setReplays(0);
            } catch (error) {
                console.error('Engagement tracking error:', error);
            }
        };

        const interval = setInterval(trackEngagement, 30000);

        const handlePlay = () => {
            setIsPlaying(true);
            setLastUpdateTime(videoElement.currentTime);
        };

        const handlePause = () => {
            setIsPlaying(false);
            setPauses(prev => prev + 1);
        };

        const handleSeek = (e) => {
            const currentTime = e.target.currentTime;
            if (isPlaying && currentTime < lastUpdateTime) {
                setReplays(prev => prev + 1);
            }
            setLastUpdateTime(currentTime);
        };

        const handleEnded = () => {
            if (videoElement.duration > 0) {
                trackLessonEngagement(currentLesson.id, {
                    watchTime: videoElement.duration - lastPosition,
                    pauseCount: pauses,
                    replayCount: replays,
                    completionPercentage: 100
                }).catch(console.error);
            }
        };

        const handleTimeUpdate = () => {
            if (!showSubtitles || subtitles.length === 0) return;
            const currentTime = videoElement.currentTime;
            const activeSub = subtitles.find(sub =>
                currentTime >= sub.start && currentTime <= sub.end
            );
            setActiveSubtitle(activeSub?.text || null);
        };

        const handleReady = () => setVideoReady(true);

        videoElement.addEventListener('play', handlePlay);
        videoElement.addEventListener('pause', handlePause);
        videoElement.addEventListener('seeked', handleSeek);
        videoElement.addEventListener('ended', handleEnded);
        videoElement.addEventListener('timeupdate', handleTimeUpdate);
        videoElement.addEventListener('canplay', handleReady);

        return () => {
            clearInterval(interval);
            videoElement.removeEventListener('play', handlePlay);
            videoElement.removeEventListener('pause', handlePause);
            videoElement.removeEventListener('seeked', handleSeek);
            videoElement.removeEventListener('ended', handleEnded);
            videoElement.removeEventListener('timeupdate', handleTimeUpdate);
            videoElement.removeEventListener('canplay', handleReady);

            if (currentLesson?.id && videoElement.currentTime > 0) {
                trackEngagement().catch(console.error);
            }
        };
    }, [currentLesson?.id, showSubtitles, subtitles, lastPosition, pauses, replays, videoRef, isPlaying, lastUpdateTime]);

    useEffect(() => {
        const fetchLessonData = async () => {
            setIsLoading(true);
            try {
                const lessons = modules.flatMap(mod =>
                    mod.lessons.map(lesson => ({ ...lesson, moduleTitle: mod.title }))
                );
                setFlatLessons(lessons);

                const foundIndex = lessons.findIndex(l => l.id === parseInt(lessonId));
                const indexToUse = Math.max(0, foundIndex);
                setCurrentIndex(indexToUse);

                const lesson = lessons[indexToUse];
                if (lesson) {
                    setCurrentLesson(lesson);
                    setCurrentVideo(`http://localhost:8080/${lesson.video_url}`);
                    setSubtitles([]);
                    setShowSubtitles(false);
                    setHasTrackedView(false);
                }
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
            const activeSub = subtitles.find(sub =>
                currentTime >= sub.start && currentTime <= sub.end
            );
            setActiveSubtitle(activeSub?.text || null);
        };

        const handleReady = () => setVideoReady(true);

        videoElement.addEventListener('timeupdate', handleTimeUpdate);
        videoElement.addEventListener('canplay', handleReady);

        return () => {
            videoElement.removeEventListener('timeupdate', handleTimeUpdate);
            videoElement.removeEventListener('canplay', handleReady);
        };
    }, [showSubtitles, subtitles, videoRef]);

    const generateNotes = async () => {
        try {
            setIsGeneratingNotes(true);
            setNotesError(null);
            const response = await fetch(`http://localhost:8080/lessons/${currentLesson.id}/generate-notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setNotes({
                    summary: data.summary,
                    fullTranscript: data.full_transcript
                });
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

            if (!response.ok) {
                throw new Error(response.status === 404 ? 'Lesson not found' : 'Translation failed');
            }

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

    const handleLessonSelect = (index) => {
        if (index < 0 || index >= flatLessons.length) return;

        const lesson = flatLessons[index];
        if (lesson) {
            setCurrentIndex(index);
            setCurrentLesson(lesson);
            setCurrentVideo(`http://localhost:8080/${lesson.video_url}`);
            setSubtitles([]);
            setShowSubtitles(false);
            setVideoReady(false);
            setHasTrackedView(false);
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
        if (currentIndex > 0) {
            visible.push({ ...flatLessons[currentIndex - 1], viewType: "prev" });
        }
        visible.push({ ...flatLessons[currentIndex], viewType: "current" });
        if (currentIndex < flatLessons.length - 1) {
            visible.push({ ...flatLessons[currentIndex + 1], viewType: "next" });
        }
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