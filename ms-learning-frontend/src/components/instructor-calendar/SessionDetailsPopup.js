import React from 'react'

const SessionDetailsPopup = ({ sessions, position }) => {
  return (
    <div
      className='live-session-details'
      style={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translateY(-100%)'
      }}
    >
      <div className='session-header'>Live Sessions</div>
      {sessions.map((session, idx) => (
        <div key={idx} className='session-item'>
          <div className='session-title'>{session.title}</div>
          <div className='session-time'>
            {session.startTime} - {session.endTime}
          </div>
          {session.liveMeetingLink && (
            <div className='session-link'>
              <a
                href={session.liveMeetingLink}
                target='_blank'
                rel='noopener noreferrer'
              >
                Join Session
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default SessionDetailsPopup
