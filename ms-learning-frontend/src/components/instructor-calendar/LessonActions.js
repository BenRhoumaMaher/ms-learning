import React from 'react'
import Button from 'react-bootstrap/Button'

const LessonActions = ({ isLoading, onModify, onCancel }) => {
  return (
    <div className='hero-buttons'>
      <Button
        variant='danger'
        onClick={onCancel}
        disabled={isLoading}
        className='hero-btn'
      >
        {isLoading ? 'Processing...' : 'Cancel'}
      </Button>
      <Button
        variant='info'
        onClick={onModify}
        disabled={isLoading}
        className='hero-btn ms-2'
      >
        {isLoading ? 'Loading...' : 'Modify'}
      </Button>
    </div>
  )
}

export default LessonActions
