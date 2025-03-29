import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import SessionCard from './SessionCard'

const SessionCarousel = ({
  sessions,
  visibleIndex,
  onPrev,
  onNext,
  onModify
}) => {
  return (
    <Container fluid className='instructlive-carousel'>
      <Row className='align-items-center'>
        {/* Left Arrow */}
        <Col xs={1} className='text-center'>
          <button
            className='instructlive-arrow'
            onClick={onPrev}
            disabled={sessions.length <= 3}
          >
            <FaChevronLeft size={24} />
          </button>
        </Col>

        {/* Cards */}
        <Col xs={10}>
          <Row className='instructlive-cards'>
            {sessions.length === 0 ? (
              <Col className='text-center'>
                <p>No upcoming live sessions</p>
              </Col>
            ) : (
              sessions
                .slice(visibleIndex, visibleIndex + 3)
                .map((session, index) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    index={index}
                    onModify={onModify}
                  />
                ))
            )}
          </Row>
        </Col>

        {/* Right Arrow */}
        <Col xs={1} className='text-center'>
          <button
            className='instructlive-arrow'
            onClick={onNext}
            disabled={sessions.length <= 3}
          >
            <FaChevronRight size={24} />
          </button>
        </Col>
      </Row>
    </Container>
  )
}

export default SessionCarousel
