import React, { useState, useEffect } from "react";
import { getLatestLiveLessons } from "../../../helpers/api";
import { Link } from 'react-router-dom';

const LiveCourseCatalog = () => {
  const [randomLesson, setRandomLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomLesson = async () => {
      try {
        const lessons = await getLatestLiveLessons();
        if (lessons && lessons.length > 0) {
          const randomIndex = Math.floor(Math.random() * lessons.length);
          setRandomLesson(lessons[randomIndex]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRandomLesson();
  }, []);

  if (loading) {
    return <div className="container my-5">Loading live lessons...</div>;
  }

  if (error) {
    return <div className="container my-5">Error: {error}</div>;
  }

  if (!randomLesson) {
    return <div className="container my-5">No live lessons available</div>;
  }

  const formattedDate = new Date(randomLesson.liveStartTime).toISOString().split('T')[0];

  return (
    <div className="container my-5">
      <div className="row cataloglive-card">
        <div className="col-md-4 cataloglive-image-container">
          <img
            src={`http://localhost:8080/${randomLesson.course.image}`}
            alt={randomLesson.title}
            className="cataloglive-image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="col-md-8 cataloglive-content">
          <h4 className="text-danger fw-bold">{randomLesson.title}</h4>
          <p className="text-secondary">
            {randomLesson.content}
          </p>

          <p className="fw-bold">
            START IN: <span className="text-primary fw-bold">{formattedDate}</span>
          </p>

          <a
            href={randomLesson.liveMeetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn cataloglive-join-btn"
          >
            Join This Course
          </a>
        </div>
      </div>

      <div className="text-center mt-4 mb-5">
        <Link to="/student-calendar" className="btn cataloglive-calendar-btn mb-5">
          View Full Calendar
        </Link>
      </div>
    </div>
  );
};

export default LiveCourseCatalog;