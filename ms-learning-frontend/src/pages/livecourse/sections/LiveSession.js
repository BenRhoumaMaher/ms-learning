import React from "react";

const LiveSession = () => {
  return (
    <section className="livecou-sessionn">
      <div className="container">
        <div className="row text-center">
          <div className="col-12">
            <h3 className="livecou-title">Live Session</h3>
            <p className="livecou-subtitle">Join the session and engage</p>
          </div>
        </div>

        <div className="row align-items-center text-center">
          <div className="col-md-8">
            <div className="livecou-video">
              <i className="fas fa-play-circle fa-5x text-light"></i>
            </div>
          </div>

          <div className="col-md-4">
            <div className="livecou-chat">
              <i className="fas fa-comment-dots fa-5x text-light"></i>
            </div>
            <p className="livecou-chat-text">Live Chat</p>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-8 text-start video-text">
            <button className="livecou-btn livecou-download">Download Materials</button>
            <span className="livecou-hand mx-3">
              <i className="fas fa-hand-paper text-warning fa-lg"></i> Request to Ask a Question
            </span>
            <span className="livecou-feature">Live Translations & Captions</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveSession;
