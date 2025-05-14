import React, { useRef, useState } from 'react';
import { useTranslation } from "react-i18next";

const ConnectArea = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="connect-area text-center">
      <div className="container">
        <h2 className="fw-bold">{t("Collaborate and grow with our")} <span className="text-success">MS-CONNECT</span> <span className="text-danger">{t("Community Area")}</span></h2>
        <p className="text-muted">
          {t("Ask questions, share resources, and collaborate on projects all in your preferred language")}
        </p>

        <div className="video-container position-relative" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <video
            ref={videoRef}
            src="/msconnect.mp4"
            className="img-fluid rounded shadow"
            controls={isPlaying}
            onClick={togglePlay}
            aria-label={t("MS-CONNECT Community Introduction")}
          />

          {!isPlaying && (
            <button
              className="btn btn-play position-absolute top-50 start-50 translate-middle"
              onClick={togglePlay}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '4rem',
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              <i className="bi bi-play-circle-fill"></i>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ConnectArea;