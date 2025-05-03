import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import useLessonPlayer from "../../../hooks/useLessonPlayer";

const HeroSection = ({ lessonId }) => {
  const { state } = useLocation();
  const { modules = [], courseTitle } = state || {};
  const videoRef = useRef(null);

  const {
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
  } = useLessonPlayer(modules, lessonId, videoRef);

  const supportedLanguages = [
    { code: 'fr', name: 'French' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
  ];

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading lesson...</p>
      </div>
    );
  }

  if (!currentLesson) {
    return <p className="text-center mt-5">Lesson not found</p>;
  }

  return (
    <section className="container mt-5">
      <h3 className="text-center fw-bold mb-4">
        {courseTitle} - <span className="text-success">{currentLesson.title}</span>
      </h3>

      <div className="row align-items-center justify-content-between">
        <div className="col-md-2 text-center lessplay-notes-section">
          <button
            onClick={generateNotes}
            disabled={isGeneratingNotes}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-pencil-alt lessplay-notes-icon"></i>
            <p className="lessplay-text-danger fw-bold mt-3">
              {isGeneratingNotes ? 'Generating...' : 'Summary & Transcript'}
            </p>
          </button>

          {notes && (
            <div className="mt-3 p-2" style={{
              border: '1px solid #ddd',
              borderRadius: '5px',
              maxHeight: '300px',
              overflowY: 'auto',
              textAlign: 'left'
            }}>
              <h6>Lecture Summary:</h6>
              <p style={{ fontSize: '0.8rem' }}>{notes.summary}</p>

              <button
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => setShowFullTranscript(!showFullTranscript)}
              >
                {showFullTranscript ? 'Hide Full Transcript' : 'Show Full Transcript'}
              </button>

              {showFullTranscript && (
                <div className="mt-2" style={{ fontSize: '0.7rem' }}>
                  <h6>Full Transcript:</h6>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{notes.fullTranscript}</p>
                </div>
              )}
            </div>
          )}

          {notesError && (
            <div className="alert alert-danger mt-2" style={{ fontSize: '0.7rem' }}>
              {notesError}
            </div>
          )}
        </div>

        <div className="col-md-6 lessplay-video-wrapper">
          <div className="lessplay-video-container" style={{ position: 'relative' }}>
            <video
              ref={videoRef}
              id="lessplay-main-video"
              className="lessplay-video-player"
              controls
              src={currentVideo}
              style={{ width: '100%' }}
            ></video>

            {showSubtitles && activeSubtitle && (
              <div className="subtitles-container" style={{
                position: 'absolute',
                bottom: '20px',
                left: 0,
                right: 0,
                textAlign: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                margin: '0 10px'
              }}>
                <div className="subtitle-text">{activeSubtitle}</div>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="d-flex align-items-center">
              <i className="bi bi-bookmark-fill lessplay-text-primary me-2"></i>
              <span className="lessplay-text-danger">{currentLesson.title}</span>
            </div>

            <div className="d-flex align-items-center">
              <select
                className="form-select form-select-sm stylish-select me-2"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={isTranslating || !videoReady}
                style={{ width: '150px', borderColor: '#28b745', borderWidth: '2px', fontSize: '12px' }}
              >
                {supportedLanguages.map((lang, index) => (
                  <option
                    key={lang.code}
                    value={lang.code}
                    style={{
                      borderBottom: index < supportedLanguages.length - 1 ? '1px solid #ccc' : 'none',
                      padding: '8px',
                      fontSize: '12px',
                    }}
                  >
                    {lang.name}
                  </option>
                ))}
              </select>

              <button
                className="btn lessplay-btn-danger btn-sm"
                onClick={() => {
                  if (!showSubtitles && subtitles.length === 0) {
                    fetchSubtitles(currentLesson.id, targetLanguage);
                  } else {
                    setShowSubtitles(!showSubtitles);
                  }
                }}
                disabled={isTranslating || !videoReady}
              >
                {isTranslating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Translating...
                  </>
                ) : showSubtitles ? 'Hide Subtitles' : 'Show Subtitles'}
              </button>
            </div>
          </div>

          {translationError && (
            <div className="alert alert-danger mt-2">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {translationError}
              <button
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={() => fetchSubtitles(currentLesson.id, targetLanguage)}
              >
                Retry
              </button>
            </div>
          )}

          {!videoReady && (
            <div className="alert alert-info mt-2">
              <i className="bi bi-info-circle-fill me-2"></i>
              Video is loading... Subtitles will be available once video is ready.
            </div>
          )}
        </div>

        <div className="col-md-3 text-center lessplay-lessons-section">
          <i
            className="bi bi-chevron-up lessplay-chevron-icon mb-3"
            style={{
              cursor: currentIndex > 0 ? "pointer" : "not-allowed",
              opacity: currentIndex > 0 ? 1 : 0.5
            }}
            onClick={() => currentIndex > 0 && scroll("up")}
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
                className={`lessplay-lesson-thumb mb-3 w-100 ${isCurrent ? 'active-lesson' : ''} ${isLive ? 'live-lesson' : ''}`}
                style={{
                  cursor: isLive ? "not-allowed" : "pointer",
                  color: isCurrent ? "green" : isLive ? "#999" : "#000",
                  fontWeight: isCurrent ? "bold" : "normal",
                  fontSize: "0.8rem",
                  position: "relative",
                  padding: "8px",
                  borderRadius: "5px",
                  border: isCurrent ? "2px solid green" : "1px solid #ddd",
                  backgroundColor: isCurrent ? "#f8f9fa" : "white"
                }}
                title={isLive ? `This lesson is live at ${new Date(lesson.livestarttime).toLocaleString()}` : ""}
              >
                <p
                  className="small mt-1 mb-0"
                  style={{
                    fontSize: "0.75rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {lesson.moduleTitle && (
                    <span className="text-muted" style={{ fontSize: "0.95rem" }}>
                      {lesson.moduleTitle}:
                    </span>
                  )} <span style={{ fontSize: "0.75rem" }}>{lesson.title}</span>
                </p>
                {isLive && (
                  <span className="badge bg-danger" style={{ fontSize: "0.6rem", position: "absolute", top: "-5px", right: "-5px" }}>
                    LIVE
                  </span>
                )}
              </div>
            );
          })}

          <i
            className="bi bi-chevron-down lessplay-chevron-icon mt-3"
            style={{
              cursor: currentIndex < flatLessons.length - 1 ? "pointer" : "not-allowed",
              opacity: currentIndex < flatLessons.length - 1 ? 1 : 0.5
            }}
            onClick={() => currentIndex < flatLessons.length - 1 && scroll("down")}
          ></i>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
