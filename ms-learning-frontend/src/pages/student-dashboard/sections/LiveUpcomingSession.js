import React from 'react';
import { Link } from 'react-router-dom';
import { useNextLiveLesson } from '../../../hooks/useNextLiveLesson';

const LiveUpcomingSession = () => {
  const { nextLiveLesson, countdown } = useNextLiveLesson();

  if (!nextLiveLesson) {
    return (
      <section className="container text-center my-5">
        <h2 className="fw-bold mb-4">Join This Live Upcoming Session</h2>
        <div className="text-muted">No upcoming live lessons at the moment.</div>
      </section>
    );
  }

  const startDate = new Date(nextLiveLesson.liveStartTime);
  const formattedDate = startDate.toLocaleDateString();
  const formattedTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="container text-center my-5">
      <h2 className="fw-bold mb-4">Join This Live Upcoming Session</h2>

      <div id="liveSessionCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="row mx-auto align-items-center bg-light rounded shadow p-3">
              <div className="col-md-6 d-flex justify-content-center bg-info p-5">
                <i className="bi bi-camera-video" style={{ fontSize: "4rem", color: "white" }}></i>
              </div>

              <div className="col-md-6 text-start p-4">
                <p><strong className="text-danger">Lesson Title:</strong> {nextLiveLesson.title}</p>
                <p>
                  <strong className="text-danger">Start Date & Time:</strong> {formattedDate} at {formattedTime}
                </p>
                <p><strong className="text-danger">Duration:</strong> {nextLiveLesson.duration} minutes</p>
                <p><strong className="text-success">{countdown}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link to="/student-calendar" className="btn btn-outline-info btn-lg">
          View Full Calendar
        </Link>
      </div>
    </section>
  );
};

export default LiveUpcomingSession;
