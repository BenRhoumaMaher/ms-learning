import React from 'react'
import { Col, Button } from 'react-bootstrap'

const SessionCard = ({ session, index, onModify }) => {
  const colors = ['#B0B0B0', '#17B890', '#2D8CFF']
  const color = colors[index % 3]

  return (
    <Col md={3} className='instructlive-card-wrapper'>
      <div className='instructlive-card' style={{ borderColor: color }}>
        <div className='instructlive-number' style={{ color }}>
          {session.id < 10 ? `0${session.id}` : session.id}
        </div>
        <div className='instructlive-header' style={{ backgroundColor: color }}>
          {session.title}
        </div>
        <div className='instructlive-body'>
          <p className='instructlive-label'>Start: {session.date}</p>
          <p className='instructlive-label'>
            Registered Students: {session.registeredStudents || 'N/A'}
          </p>
          <div className='instructlive-buttons'>
            <Button
              className='instructlive-btn instructlive-modify'
              onClick={() => onModify(session)}
            >
              Modify
            </Button>
          </div>
        </div>
      </div>
    </Col>
  )
}

export default SessionCard
