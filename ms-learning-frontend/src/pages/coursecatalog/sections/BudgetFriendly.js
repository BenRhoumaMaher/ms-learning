import React, { useState, useEffect } from 'react';
import {
  getFreeCourses,
  enrollInCourse,
  getUserPlan
} from '../../../helpers/api';
import { useNavigate } from 'react-router-dom';

const BudgetFriendly = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = JSON.parse(atob(token.split('.')[1]));
  const userId = user?.user_id;

  const [courses, setCourses] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [userPlan, setUserPlan] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, planData] = await Promise.all([
          getFreeCourses(),
          getUserPlan(userId)
        ]);
        setCourses(coursesData);
        setUserPlan(planData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId);

    try {
      await enrollInCourse(courseId, userId);
      navigate('/registered-courses');
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrolling(null);
    }
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const handleShowLess = () => {
    setVisibleCount(3);
  };

  const isAccessible = () => {
    return userPlan && (userPlan && [2, 3].includes(userPlan.planId));
  };

  if (loading) {
    return <div className='container my-5'>Loading free courses...</div>;
  }

  if (courses.length === 0) {
    return <div className='container my-5'>No free courses available</div>;
  }

  return (
    <div className='container my-5'>
      <h3 className='text-dark fw-bold'>
        Learn for Free: <span className='text-danger'>Budget-Friendly Picks</span>
      </h3>
      <p className='text-success'>
        High-quality courses <i>without spending a dime</i>
      </p>

      <div className='row'>
        {courses.slice(0, visibleCount).map((course, index) => (
          <div key={index} className='col-md-4 mb-4'>
            <div className='budgetfriendly-card h-100'>
              <div>
                {course.image && (
                  <img
                    src={`http://localhost:8080/${course.image}`}
                    alt={course.name}
                    className='img-fluid'
                    style={{
                      height: '200px',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
              <div className='budgetfriendly-content p-3'>
                <h5 className='text-danger mb-2'>{course.title}</h5>
                <p className='text-secondary'>
                  {course.description || 'No description available'}
                </p>
                <p className='text-primary fw-bold'>FREE</p>
                <button
                  className='btn btn-success mt-2'
                  onClick={() =>
                    isAccessible()
                      ? navigate(`/registered-courses/${course.id}`)
                      : handleEnroll(course.id)
                  }
                  disabled={enrolling === course.id}
                >
                  {isAccessible()
                    ? 'Start Course'
                    : enrolling === course.id
                      ? 'Enrolling...'
                      : 'Enroll Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='text-center mt-3'>
        {courses.length > visibleCount ? (
          <button
            className='btn budgetfriendly-showmore-btn mb-5'
            onClick={handleShowMore}
          >
            Show more
          </button>
        ) : (
          visibleCount > 3 && (
            <button
              className='btn budgetfriendly-showless-btn mb-5'
              onClick={handleShowLess}
            >
              Show less
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default BudgetFriendly;
