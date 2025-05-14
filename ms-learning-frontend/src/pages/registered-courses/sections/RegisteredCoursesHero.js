import React, { useState, useEffect } from 'react';
import { getCourses } from '../../../helpers/api';

const RegisteredCoursesHero = ({ courseId }) => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const studentName = user?.username || 'Student';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await getCourses();
        const course = courses.find(c => c.id === parseInt(courseId));
        if (course) {
          setCourseData({
            course: {
              title: course.title,
              image: course.image
            },
            user: {
              name: course.instructor.name
            }
          });
        } else {
          setError('Course not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!courseData) return <div>No course data found</div>;

  return (
    <div className='registered-hero gap-5'>
      <div className='course-section'>
        <div className='certificate-icon'>
          <i className='fas fa-image fa-5x text-info'></i>
        </div>
        <h3 className='course-title'>
          {courseData.course.title}
        </h3>
        <p className='course-author'>
          By {courseData.user.name} | <span className='star'>⭐</span> 4.8 (2,000+ Reviews)
        </p>
      </div>

      <div className='welcome-section'>
        <h4>Welcome</h4>
        <h5>{studentName}</h5>
      </div>

      <div className='session-section'>
        <div className='video-player w-100' controls>
          <img src={`http://localhost:8080/${courseData.course.image}`}
            alt='Session'
            style={
              {
                width: "100%",
                height: "100%"
              }
            }
          />
        </div>
        <div className='session-info-container'>
          <p className='session-info'>Upcoming Live Session in 2 days</p>
        </div>
      </div>
    </div>
  );
};

export default RegisteredCoursesHero;