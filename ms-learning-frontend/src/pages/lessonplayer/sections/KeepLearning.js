import React, { useEffect, useState } from "react";
import { getLessonInfo } from "../../../helpers/api";
import { getCoursesByCategory } from "../../../helpers/api";

const KeepLearning = ({ lessonId }) => {
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startIndex, setStartIndex] = useState(0);
  const pageSize = 3;

  const handleNext = () => {
    if (startIndex + pageSize < relatedCourses.length) {
      setStartIndex(startIndex + pageSize);
    }
  };

  const handlePrev = () => {
    if (startIndex - pageSize >= 0) {
      setStartIndex(startIndex - pageSize);
    }
  };

  const visibleCourses = relatedCourses.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    const fetchRelatedCourses = async () => {
      try {
        const lessonData = await getLessonInfo(lessonId);
        const { category } = lessonData;

        const courses = await getCoursesByCategory(category);
        setRelatedCourses(courses);
      } catch (error) {
        console.error("Error fetching related courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedCourses();
  }, [lessonId]);

  if (loading) {
    return <p>Loading related courses...</p>;
  }

  return (
    <div className="lessplkeep-container">
      <h2 className="lessplkeep-title">Keep Learning</h2>
      <p className="lessplkeep-subtitle mb-5">
        Explore related courses and continue your learning journey
      </p>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <button
          className="lessplkeep-nav-btn"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <div className="d-flex flex-wrap justify-content-center flex-grow-1 gap-3 mx-3">
          {visibleCourses.map((course) => (
            <div key={course.id} className="lessplkeep-card">
              <div className="lessplkeep-card-header">{course.title}</div>
              <div className="lessplkeep-card-body">
                <p className="mt-5">{course.description}</p>
                <button className="lessplkeep-btn mt-5">Enroll</button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="lessplkeep-nav-btn"
          onClick={handleNext}
          disabled={startIndex + pageSize >= relatedCourses.length}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default KeepLearning;
