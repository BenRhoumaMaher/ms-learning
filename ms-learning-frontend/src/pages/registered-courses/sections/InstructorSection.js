import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { getCourses } from '../../../helpers/api';

const InstructorSection = ({ courseId }) => {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const courses = await getCourses();
        const course = courses.find(c => c.id === parseInt(courseId));
        if (course && course.instructor) {
          setInstructor(course.instructor);
        }
      } catch (err) {
        console.error('Failed to load instructor data', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchInstructor();
    }
  }, [courseId]);

  if (loading) return <div>Loading instructor...</div>;
  if (!instructor) return null;

  const { id, name, expertise, picture, linkedin, instagram, facebook } = instructor;

  return (
    <Container className='instructor-section text-center py-5'>
      <h2 className='fw-bold'>Meet Your Instructor</h2>
      <p className='text-muted'>Learn from {name}, an expert in the field</p>

      <div className='instructor-image mb-3 m-auto'>
        {picture ? (
          <img
            src={`http://localhost:8080${picture}`}
            alt={name}
            className='rounded-circle'
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />
        ) : (
          <i className='fas fa-image fa-5x text-info'></i>
        )}
      </div>

      <Row className='justify-content-center'>
        <Col md={8} className='bg-light p-4 rounded w-100'>
          <h4 className='fw-bold'>{name}</h4>
          <p className='text-muted'>{expertise || 'Instructor biography not available.'}</p>

          <div className='social-icons mb-3'>
            {linkedin && (
              <a href={`https://${linkedin}`} target='_blank' rel='noopener noreferrer' className='me-4 text-reset'>
                <i className='bi bi-linkedin text-primary'></i>
              </a>
            )}
            {facebook && (
              <a href={facebook} target='_blank' rel='noopener noreferrer' className='me-4 text-reset'>
                <i className='bi bi-facebook text-primary'></i>
              </a>
            )}
            {instagram && (
              <a href={instagram} target='_blank' rel='noopener noreferrer' className='me-4 text-reset'>
                <i className='bi bi-instagram text-danger'></i>
              </a>
            )}
          </div>

          <Button variant='outline-primary' className='px-4' href={`/instructor-public/${id}`}>
            View Full Profile
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default InstructorSection;