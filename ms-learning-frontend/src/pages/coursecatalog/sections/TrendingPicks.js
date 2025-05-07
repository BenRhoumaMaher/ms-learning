import React, { useState, useEffect } from 'react';
import { getTrendingCourses, enrollInPaidCourse, getUserEnrollements, getUserPlan } from '../../../helpers/api';
import { useNavigate } from 'react-router-dom';

const TrendingPicks = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [processingPayments, setProcessingPayments] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, enrollmentData, planData] = await Promise.all([
          getTrendingCourses(),
          getUserEnrollements(),
          getUserPlan()
        ]);
        setUserPlan(planData);
        setCourses(courseData);
        setEnrolledCourses(enrollmentData.course_ids || []);
      } catch (error) {
        console.error('Error fetching trending picks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isCourseEnrolled = (courseId) => {
    return enrolledCourses.includes(courseId);
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
    return <div className="container my-5 mt-5">Loading trending picks...</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="container my-5 mt-5">
        <h3 className="text-danger fw-bold">Hot Right Now: <span className="text-dark">Trending Picks</span></h3>
        <p className="text-success">Discover the courses everyone’s talking about</p>
        <p>No trending courses available.</p>
      </div>
    );
  }

  return (
    <div className="container my-5 mt-5">
      <h3 className="text-danger fw-bold">Hot Right Now: <span className="text-dark">Trending Picks</span></h3>
      <p className="text-success">Discover the courses everyone’s talking about</p>

      <div className="row">
        {courses.map(course => (
          <div key={course.id} className="col-md-4 mb-4">
            <div className="trendingpicks-card h-100">
              {course.image && (
                <img
                  src={`http://localhost:8080/${course.image}`}
                  alt={course.name}
                  className="img-fluid"
                  style={{
                    height: '200px',
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
              )}
              <div className="trendingpicks-content p-3">
                <h5 className="text-danger mb-2">{course.title}</h5>
                <p className="text-secondary">
                  {course.description || 'No description available'}
                </p>
                <p className="text-success">
                  Instructor: <span className='text-white'>{course.instructor_username}</span>
                </p>
                <p className="fw-bold">Price: ${course.price || '0'}</p>

                {isCourseEnrolled(course.id) || (userPlan && userPlan.planId !== 1) ? (
                  <button
                    className="btn btn-success"
                    onClick={() => navigate(`/registered-courses/${course.id}`)}
                  >
                    Resume Course
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEnroll(course.id)}
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
    </div>
  );
};

export default TrendingPicks;
