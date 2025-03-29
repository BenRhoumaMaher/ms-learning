import React from 'react'

const AddContentModal = ({
  showContentModal,
  setShowContentModal,
  setShowAddLessonModal,
  setShowAddResourceModal
}) => {
  if (!showContentModal) return null

  return (
    <div
      className={`modal fade ${showContentModal ? 'show' : ''}`}
      style={{
        display: showContentModal ? 'block' : 'none',
        transition: 'all 0.3s ease'
      }}
      tabIndex='-1'
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div
          className='modal-content'
          style={{
            transition: 'all 0.3s ease',
            transform: showContentModal ? 'scale(1)' : 'scale(0.95)'
          }}
        >
          <div className='modal-header'>
            <h5 className='modal-title'>Add New Content</h5>
            <button
              type='button'
              className='btn-close'
              onClick={() => setShowContentModal(false)}
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body'>
            <div className='d-flex justify-content-center gap-3'>
              <button
                className='btn btn-primary px-4 py-2'
                onClick={() => {
                  setShowContentModal(false)
                  setShowAddLessonModal(true)
                }}
              >
                <i className='bi bi-book me-2'></i> Add Lesson
              </button>
              <button
                className='btn btn-success px-4 py-2'
                onClick={() => {
                  setShowContentModal(false)
                  setShowAddResourceModal(true)
                }}
              >
                <i className='bi bi-file-earmark-plus me-2'></i> Add Resource
              </button>
            </div>
          </div>
          <div className='modal-footer justify-content-center'>
            <button
              type='button'
              className='btn btn-outline-secondary'
              onClick={() => setShowContentModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddContentModal
