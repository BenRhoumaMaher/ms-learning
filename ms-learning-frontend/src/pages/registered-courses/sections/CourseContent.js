import React, { useEffect, useState } from "react";
import { getEnrolledCourse } from "../../../helpers/api";
import { useNavigate } from 'react-router-dom';

const CourseContent = ({ courseId }) => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEnrolledCourse(courseId);
        setCourseData(data);
      } catch (err) {
        console.error("Error loading course:", err);
      }
    };

    fetchData();
  }, [courseId]);

  const handlePlayLesson = (lessonId) => {
    navigate(`/lesson-player/${lessonId}`, {
      state: { modules, courseTitle: course.title }
    });
  };

  if (!courseData) return <p>Loading course content...</p>;

  const { course } = courseData;
  const modules = course.modules || [];
  const selectedModule = modules[selectedModuleIndex] || { lessons: [] };

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold">Course Content</h2>
      <p className="text-center text-muted">
        Explore the lessons, quizzes, and resources to master this course
      </p>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card registered-sidebar bg-light">
            <div className="card-header text-center fw-bold">
              {course.title}
            </div>
            <ul className="list-group list-group-flush">
              {modules.map((module, index) => (
                <li
                  key={module.id}
                  className={`list-group-item ${index === selectedModuleIndex ? "bg-light" : ""
                    }`}
                  onClick={() => setSelectedModuleIndex(index)}
                  style={{ cursor: "pointer" }}
                >
                  {module.title}
                </li>
              ))}
              <li className="list-group-item text-secondary fw-bold" style={{ pointerEvents: "none", opacity: 0.5 }}>
                Quiz & Certificate
              </li>
            </ul>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card registered-content">
            <div className="card-body">
              <ul className="list-group">
                {selectedModule.lessons.map((lesson, index) => (
                  <li
                    key={lesson.id}
                    className="list-group-item mb-4"
                    style={{
                      backgroundColor: lesson.type === "live" ? "#f0f0f0" : "white",
                      color: lesson.type === "live" ? "#888" : "inherit"
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        Lesson {index + 1}: {lesson.title}
                        {lesson.livestarttime && (
                          <span className="text-danger ms-2 fw-bold">
                            Live in {lesson.livestarttime}
                          </span>
                        )}
                      </div>
                      <span className="btn btn-success btn-sm"
                        onClick={() => navigate(`/lesson-player/${lesson.id}`, {
                          state: { modules, courseTitle: course.title }
                        })}
                      >▶</span>
                    </div>

                    {lesson.ressources && (
                      <div className="text-end mt-2">
                        <a
                          href={`http://localhost:8080/${lesson.ressources}`}
                          className="btn btn-outline-primary btn-sm list-group-lesson-ressource"
                          download
                        >
                          Download Resources
                        </a>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
