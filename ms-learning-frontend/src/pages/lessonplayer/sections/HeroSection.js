import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const HeroSection = ({ lessonId }) => {
  const { state } = useLocation();
  const { modules = [], courseTitle } = state || {};

  const [flatLessons, setFlatLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentVideo, setCurrentVideo] = useState("");

  useEffect(() => {
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
    setCurrentLesson(lessons[indexToUse]);
    setCurrentVideo(`http://localhost:8080/${lessons[indexToUse].video_url}`);
  }, [lessonId, modules]);

  const handleLessonSelect = (index) => {
    const lesson = flatLessons[index];
    if (lesson) {
      setCurrentIndex(index);
      setCurrentLesson(lesson);
      setCurrentVideo(`http://localhost:8080/${lesson.video_url}`);
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
    if (flatLessons[currentIndex - 1]) {
      visible.push({ ...flatLessons[currentIndex - 1], viewType: "prev" });
    }
    visible.push({ ...flatLessons[currentIndex], viewType: "current" });
    if (flatLessons[currentIndex + 1]) {
      visible.push({ ...flatLessons[currentIndex + 1], viewType: "next" });
    }
    return visible;
  };

  if (!currentLesson) return <p className="text-center mt-5">Loading lesson...</p>;

  return (
    <section className="container mt-5">
      <h3 className="text-center fw-bold mb-4">
        {courseTitle} - <span className="text-success">{currentLesson.title}</span>
      </h3>

      <div className="row align-items-center justify-content-between">
        <div className="col-md-2 text-center lessplay-notes-section">
          <i className="fas fa-book-open lessplay-notes-icon"></i>
          <p className="lessplay-text-danger fw-bold mt-3">Notes</p>
        </div>

        <div className="col-md-6 lessplay-video-wrapper">
          <div className="lessplay-video-container">
            <video
              id="lessplay-main-video"
              className="lessplay-video-player"
              controls
              src={currentVideo}
            ></video>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="d-flex align-items-center">
              <i className="bi bi-bookmark-fill lessplay-text-primary me-2"></i>
              <span className="lessplay-text-danger">{currentLesson.title}</span>
            </div>
            <button className="btn lessplay-btn-danger btn-sm">
              Subtitles & Transcripts
            </button>
          </div>
        </div>

        <div className="col-md-3 text-center lessplay-lessons-section">
          <i
            className="bi bi-chevron-up lessplay-chevron-icon mb-3"
            style={{ cursor: "pointer" }}
            onClick={() => scroll("up")}
          ></i>

          {getVisibleLessons().map((lesson) => {
            const isLive = lesson.type === "live";
            const isCurrent = lesson.viewType === "current";

            return (
              <div
                key={lesson.id}
                onClick={() => {
                  if (!isLive) {
                    handleLessonSelect(flatLessons.findIndex((l) => l.id === lesson.id));
                  }
                }}
                className="lessplay-lesson-thumb mb-3 w-100"
                style={{
                  cursor: isLive ? "not-allowed" : "pointer",
                  color: isCurrent ? "green" : isLive ? "#999" : "#000",
                  fontWeight: isCurrent ? "bold" : "normal",
                  position: "relative"
                }}
                title={isLive ? `This lesson is live at ${new Date(lesson.livestarttime).toLocaleString()}` : ""}
              >
                <p
                  className="small mt-1"
                  style={{
                    fontSize: "0.75rem",
                    marginBottom: 0
                  }}
                >
                  {lesson.title}
                </p>
              </div>
            );
          })}



          <i
            className="bi bi-chevron-down lessplay-chevron-icon mt-3"
            style={{ cursor: "pointer" }}
            onClick={() => scroll("down")}
          ></i>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
