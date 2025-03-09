import React, { useState } from "react";

const HeroSection = () => {
  const [currentVideo, setCurrentVideo] = useState(
    "https://www.w3schools.com/html/mov_bbb.mp4"
  );

  const changeVideo = (videoUrl) => {
    setCurrentVideo(videoUrl);
  };

  return (
    <section className="container mt-5">
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
              <span className="fw-bold lessplay-text-danger">Lesson Title</span>
            </div>
            <button className="btn lessplay-btn-danger btn-sm">
              Subtitles & Transcripts
            </button>
          </div>
        </div>

        <div className="col-md-3 text-center lessplay-lessons-section">
          <div
            onClick={() =>
              changeVideo("https://www.w3schools.com/html/mov_bbb.mp4")
            }
            className="lessplay-lesson-thumb"
          >
            <i className="bi bi-play-circle-fill"></i>
          </div>
          <div
            onClick={() =>
              changeVideo("https://www.w3schools.com/html/movie.mp4")
            }
            className="lessplay-lesson-thumb mt-5"
          >
            <i className="bi bi-play-circle-fill"></i>
          </div>
          <i className="bi bi-chevron-down lessplay-chevron-icon mt-5"></i>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
