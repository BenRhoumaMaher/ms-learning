import React, { useState } from 'react'
import { useLiveLesson } from '../../../hooks/useLiveLesson'
import ModifyLessonModal from '../../../components/instructor-calendar/ModifyLessonModal'
import CancelLessonModal from '../../../components/instructor-calendar/CancelLessonModal'
import LessonCountdown from '../../../components/instructor-calendar/LessonCountdown'
import LessonActions from '../../../components/instructor-calendar/LessonActions'

const HeroSection = () => {
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [cancelAction, setCancelAction] = useState(null)

  const {
    userId,
    latestLesson,
    timeRemaining,
    isLoading,
    alert,
    setAlert,
    handleUpdateLesson,
    handleCancelAction
  } = useLiveLesson()

  if (!userId) {
    return <LessonCountdown title='Please log in to view live sessions' />
  }

  if (isLoading && !latestLesson) {
    return <LessonCountdown title='Loading live session...' />
  }

  if (!latestLesson) {
    return <LessonCountdown title='No upcoming live sessions' />
  }

  return (
    <div className='hero-container'>
      <div className='hero-content'>
        <LessonCountdown
          title='Your Next Live Session Countdown'
          timeRemaining={timeRemaining}
        />

        <LessonActions
          isLoading={isLoading}
          onModify={() => setShowModifyModal(true)}
          onCancel={() => setShowCancelModal(true)}
        />
      </div>

      <ModifyLessonModal
        show={showModifyModal}
        onHide={() => setShowModifyModal(false)}
        lesson={latestLesson}
        onSubmit={handleUpdateLesson}
        isLoading={isLoading}
        alert={alert}
        setAlert={setAlert}
      />

      <CancelLessonModal
        show={showCancelModal}
        onHide={() => {
          setShowCancelModal(false)
          setVideoUrl('')
        }}
        lesson={latestLesson}
        onSubmit={action =>
          handleCancelAction(action, latestLesson.id, videoUrl)
        }
        isLoading={isLoading}
        alert={alert}
        setAlert={setAlert}
        cancelAction={cancelAction}
        setCancelAction={setCancelAction}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
      />
    </div>
  )
}

export default HeroSection
