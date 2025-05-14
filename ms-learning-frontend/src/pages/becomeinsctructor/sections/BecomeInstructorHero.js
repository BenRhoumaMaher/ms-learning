import React, { useState, useEffect } from "react";
import { getUsers } from "../../../helpers/api";

const BecomeInstructorHero = ({ scrollToJoinFamily }) => {
  const [instructorCount, setInstructorCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const users = await getUsers();

        let instructors = 0;
        let students = 0;

        users.forEach(user => {
          const isInstructor = user.roles.includes("ROLE_INSTRUCTOR");
          const isStudent = user.roles.includes("ROLE_STUDENT");

          if (isInstructor) instructors++;
          if (isStudent) students++;
        });

        setInstructorCount(instructors);
        setStudentCount(students);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <section className="container-fluid becoinstr-hero">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <h2 className="fw-bold becoinstr-title">Share Your Knowledge</h2>
            <p className="becoinstr-subtitle">
              Inspire the World and Earn from Your Expertise
            </p>

            {isLoading ? (
              <p className="becoinstr-details text-primary">Loading statistics...</p>
            ) : (
              <p className="becoinstr-details text-primary">
                Join {instructorCount}+ instructors |
                Earn up to $5,000/month |
                Teach {studentCount}+ students
              </p>
            )}

            <button
              className="btn becoinstr-btn mt-3"
              onClick={scrollToJoinFamily}
            >
              Start Teaching Today
            </button>
          </div>

          <div className="col-md-6 mt-4 mt-md-0">
            <video
              className="becoinstr-video w-100 rounded shadow"
              controls
              autoPlay
              muted
            >
              <source src="/mslearn.mp4" type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeInstructorHero;