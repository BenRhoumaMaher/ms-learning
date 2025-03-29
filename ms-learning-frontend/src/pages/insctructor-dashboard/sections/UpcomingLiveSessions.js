import React from 'react'
import { Container } from 'react-bootstrap'
import { useLiveSessions } from '../../../hooks/useLiveSessions'
import SessionCarousel from '../../../components/instructor-dashboard/SessionCarousel'
import EditSessionModal from '../../../components/instructor-dashboard/EditSessionModal'

const UpcomingLiveSessions = () => {
  const {
    state,
    setState,
    handlePrev,
    handleNext,
    handleModifyClick,
    handleInputChange,
    handleSaveChanges
  } = useLiveSessions()

  return (
    <Container fluid className='instructlive-container'>
      <h2 className='instructlive-title'>Upcoming Live Sessions</h2>
      <p className='instructlive-subtitle mb-5'>
        Prepare for your next live sessions and keep your students engaged
      </p>

      <SessionCarousel
        sessions={state.sessions}
        visibleIndex={state.visibleIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onModify={handleModifyClick}
      />

      <EditSessionModal
        show={state.showModal}
        onHide={() => setState(prev => ({ ...prev, showModal: false }))}
        lessonDetails={state.lessonDetails}
        loading={state.loading}
        onInputChange={handleInputChange}
        onSave={handleSaveChanges}
      />
    </Container>
  )
}

export default UpcomingLiveSessions
