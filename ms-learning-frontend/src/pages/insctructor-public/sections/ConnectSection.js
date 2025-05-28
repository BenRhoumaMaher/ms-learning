import React, {useEffect, useState} from "react";
import { Container, Button } from "react-bootstrap";
import { getInstructorById } from '../../../helpers/api'

const ConnectSection = ({ id }) => {
  const [instructor, setInstructor] = useState(null)
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const data = await getInstructorById(id)
        setInstructor(data)
      } catch (error) {
        console.error('Failed to load instructor:', error)
      }
    }

    if (id) {
      fetchInstructor()
    }
  }, [id])

  if (!instructor) {
    return <div>Loading instructor...</div>
  }
  return (
    <Container className="connect-section text-center">
      <h4 className="connect-title fw-bold">Let’s Connect</h4>

      <p className="connect-subtitle text-success">
        Have questions or want to collaborate? Connect with <strong>{instructor.name}</strong> on <strong>MS-CONNECT</strong>
      </p>

      <Button variant="info" className="connect-button">
        Message me
      </Button>
    </Container>
  );
};

export default ConnectSection;
