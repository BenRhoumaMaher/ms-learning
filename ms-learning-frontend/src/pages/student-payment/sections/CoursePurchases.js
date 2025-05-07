import React, { useState, useEffect } from "react";
import { getUserPurchasedCourses } from "../../../helpers/api";

const courseColors = [
  { color: "#9CA3AF", btnColor: "#4B9CD3" },
  { color: "#16A085", btnColor: "#258BD2" },
  { color: "#2980B9", btnColor: "#1ABC9C" },
  { color: "#2C92A0", btnColor: "#A3D300" },
];

const CoursePurchases = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const data = await getUserPurchasedCourses();
        const coloredCourses = data.map((course, index) => ({
          ...course,
          ...courseColors[index % courseColors.length]
        }));
        setCourses(coloredCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, []);

  const displayedCourses = showAll ? courses : courses.slice(0, 4);

  if (loading) return <div className="container text-center mt-5">Loading purchased courses...</div>;
  if (error) return <div className="container text-center mt-5 text-danger">Error: {error}</div>;
  if (courses.length === 0) return <div className="container text-center mt-5">No purchased courses found</div>;

  return (
    <div className="container text-center mt-5">
      <h3><strong>Your Course Purchases</strong></h3>
      <p>Explore the courses you've invested in and continue your learning journey</p>

      <div className="course-container">
        {displayedCourses.map((course, index) => (
          <div key={course.id} className="course-cardd" style={{ backgroundColor: course.color }}>
            <div className="badge-container">
              <div className="badge-circle" style={{ color: course.color }}>
                {index < 9 ? `0${index + 1}` : index + 1}
              </div>
              <div className="badge-pointer"></div>
            </div>

            <h5 className="course-title text-info mt-4">{course.title}</h5>
            <p className="course-info">
              <strong className="text-success">{new Date(course.paymentDate).toLocaleDateString()}</strong>
              <br />
              <span className="text-warning">${course.price}</span>
            </p>

            <button
              className="access-btn"
              style={{ backgroundColor: course.btnColor }}
              onClick={() => window.location.href = `/course/${course.id}`}
            >
              Access the course
            </button>
          </div>
        ))}
      </div>

      {courses.length > 4 && (
        <button
          className="show-more-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default CoursePurchases;