import React from "react";
import { useNextLiveLesson } from "../../../hooks/useNextLiveLesson";

const HeroSection = () => {
  const { nextLiveLesson, countdown } = useNextLiveLesson();

  if (!nextLiveLesson) {
    return (
      <div className="hero-container">
        <div className="hero-content">
          <h3 className="hero-title"><strong>No upcoming live sessions</strong></h3>
          <p className="hero-alert">Check back later for scheduled sessions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h3 className="hero-title">
          <strong>Next Live Session: <span className="text-info">{nextLiveLesson.title}</span></strong>
        </h3>
        <p className="hero-alert">{countdown}</p>
        <p className="hero-details">
          Starts at: <span className="text-success">{new Date(nextLiveLesson.liveStartTime).toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
