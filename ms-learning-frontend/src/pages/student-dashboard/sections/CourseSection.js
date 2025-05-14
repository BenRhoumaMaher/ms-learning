import React, { useEffect, useState } from 'react';
import { getUserEnrollements } from '../../../helpers/api';
import { Link } from 'react-router-dom';

const CourseSection = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserEnrollements();

        const enrichedCourses = data.course_ids.map((id, index) => {
          const relatedLessons = data.live_lessons.filter(lesson => lesson.course_id === id);
          const nextLesson = relatedLessons.length > 0
            ? relatedLessons.sort((a, b) => new Date(a.liveStartTime) - new Date(b.liveStartTime))[0].title
            : "No upcoming lessons";

          return {
            id,
            title: data.course_titles[index],
            image: data.course_images[index],
            nextLesson
          };
        });

        setCourses(enrichedCourses);
      } catch (err) {
        console.error("Error loading enrollments:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container text-center my-5">
      <h2><strong>Your Epic Learning Adventure</strong></h2>
      <p>Level up, and prove you’re smarter than your WiFi router</p>

      <div className="row mt-4">
        {courses.map(course => (
          <div key={course.id} className="col-md-4 mb-4">
            <div className="course-card shadow-sm">
              <div className="d-flex justify-content-center bg-info p-5 w-100">
                <img src={`http://localhost:8080/${course.image}`} alt={course.title} style={{ height: "150px", objectFit: "cover" }} />
              </div>
              <h5 className="mt-3 text-danger">{course.title}</h5>
              <p><strong>Next Lesson:</strong> {course.nextLesson}</p>
              <div className="d-flex justify-content-center gap-2">
                <Link to={`/registered-courses/${course.id}`} className="btn btn-view px-4 mt-3">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className="page-item active"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="/">2</a></li>
          <li className="page-item"><a className="page-link" href="/">3</a></li>
          <li className="page-item"><a className="page-link" href="/">4</a></li>
          <li className="page-item"><a className="page-link" href="/">5</a></li>
          <li className="page-item disabled"><a className="page-link" href="#">...</a></li>
          <li className="page-item"><a className="page-link" href="/">11</a></li>
          <li className="page-item"><a className="page-link" href="/">›</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default CourseSection;
