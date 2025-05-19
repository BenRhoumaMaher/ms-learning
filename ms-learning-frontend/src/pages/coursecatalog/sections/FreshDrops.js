import React, { useState, useEffect } from 'react';
import {
  getLatestCourses,
  enrollInPaidCourse,
  getUserEnrollements,
  getUserPlan
} from '../../../helpers/api';

const FreshDrops = () => {
  const [courses, setCourses] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [processingPayments, setProcessingPayments] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userPlan, setUserPlan] = useState(null);

  const handleShowLess = () => {
    setVisibleCount(3);
  };

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
      try {
        const userId = getUserId();
        const [coursesData, enrollmentData, planData] = await Promise.all([
          getLatestCourses(),
          getUserEnrollements(),
          getUserPlan(userId)
        ]);
        setCourses(coursesData);
        setEnrolledCourses(enrollmentData.course_ids || []);
        setUserPlan(planData);
      } catch (error) {
        console.error('Error fetching data:', error);
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

  const handleEnroll = async (courseId, price) => {
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
    return <div className='container my-5'>Loading courses...</div>;
  }

  if (courses.length === 0) {
    return <div className='container my-5'>No courses available</div>;
  }

  return (
    <div className='container my-5'>
      <h3 className='text-dark fw-bold'>
        Fresh Drops : <span className='text-danger'>New & Noteworthy</span>
      </h3>
      <p className='text-success'>Explore the newest courses added</p>

      <div className='row'>
        {courses.slice(0, visibleCount).map((course, index) => (
          <div key={index} className='col-md-4 mb-4'>
            <div className='freshdrops-card h-100'>
              <div className=''>
                {course.image && (
                  <img
                    src={`http://localhost:8080/${course.image}`}
                    alt={course.name}
                    className=''
                    style={{
                      height: '200px',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
              <div className='freshdrops-content p-3'>
                <h5 className='text-danger mb-2'>{course.title}</h5>
                <p className='text-secondary'>
                  {course.description || 'No description available'}
                </p>
                <p className='fw-bold'>Price: ${course.price || '0'}</p>
                {isCourseAccessible(course.id) ? (
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      window.location.href = `/registered-courses/${course.id}`
                    }
                  >
                    Resume Course
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEnroll(course.id, course.price)}
                    disabled={processingPayments[course.id]}
                  >
                    {processingPayments[course.id] ? 'Processing...' : 'Enroll Now'}
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
            className='btn freshdrops-showmore-btn mb-5'
            onClick={handleShowMore}
          >
            Show more
          </button>
        ) : (
          visibleCount > 3 && (
            <button
              className='btn freshdrops-showless-btn mb-5'
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

export default FreshDrops;
