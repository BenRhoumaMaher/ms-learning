import React, { useState, useEffect } from 'react';
import {
  getRecommendedCourses,
  enrollInPaidCourse,
  getUserEnrollements,
  getUserPlan
} from '../../../helpers/api';
import { useNavigate } from 'react-router-dom';

const JustForYou = () => {
  const [courses, setCourses] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [processingPayments, setProcessingPayments] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userPlan, setUserPlan] = useState(null);

  const navigate = useNavigate();

  const getUserId = () => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = getUserId();
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const [recommendedCourses, enrollmentData, planData] = await Promise.all([
          getRecommendedCourses(userId),
          getUserEnrollements(userId),
          getUserPlan(userId)
        ]);
        setCourses(Array.isArray(recommendedCourses) ? recommendedCourses : []);
        setEnrolledCourses(enrollmentData.course_ids || []);
        setUserPlan(planData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isCourseAccessible = (courseId) => {
    return enrolledCourses.includes(courseId) || (userPlan && [2, 3].includes(userPlan.planId));
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const handleShowLess = () => {
    setVisibleCount(3);
  };

  const handleEnroll = async (courseId) => {
    try {
      setProcessingPayments(prev => ({
        ...prev,
        [courseId]: true
      }));

      const response = await enrollInPaidCourse(courseId);

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else if (response.formData) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = response.url;
        form.style.display = 'none';

        Object.entries(response.formData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error('Invalid payment response');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessingPayments(prev => ({
        ...prev,
        [courseId]: false
      }));
    }
  };

  if (loading) {
    return (
      <div className='container my-5 mt-5'>
        <p>Loading recommended courses...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className='container my-5 mt-5'>
        <h3 className='text-danger fw-bold'>Just for You</h3>
        <p className='text-success'>
          Courses handpicked to match your interests
        </p>
        <p>No recommended courses found based on your interests.</p>
      </div>
    );
  }

  return (
    <div className='container my-5 mt-5'>
      <h3 className='text-danger fw-bold'>Just for You</h3>
      <p className='text-success'>Courses handpicked to match your interests</p>

      <div className='row'>
        {courses.slice(0, visibleCount).map((course) => (
          <div key={course.id} className='col-md-4 mb-4'>
            <div className='justforyou-card h-100' style={{ cursor: 'pointer' }}>
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
              <div className='justforyou-content p-3'>
                <h5 className='text-danger mb-2'>{course.title}</h5>
                <p className='text-secondary'>
                  {course.description || 'No description available'}
                </p>
                <p className='fw-bold'>Price: ${course.price || '0'}</p>
                {isCourseAccessible(course.id) ? (
                  <button
                    className='btn btn-success'
                    onClick={() => navigate(`/registered-courses/${course.id}`)}
                  >
                    Resume Course
                  </button>
                ) : (
                  <button
                    className='btn btn-primary'
                    onClick={() => handleEnroll(course.id)}
                    disabled={processingPayments[course.id]}
                  >
                    {processingPayments[course.id]
                      ? 'Processing...'
                      : 'Enroll Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='text-center mt-3'>
        {courses.length > visibleCount ? (
          <button
            className='btn justforyou-showmore-btn mb-5'
            onClick={handleShowMore}
          >
            Show more
          </button>
        ) : (
          visibleCount > 3 && (
            <button
              className='btn justforyou-showless-btn mb-5'
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

export default JustForYou;
