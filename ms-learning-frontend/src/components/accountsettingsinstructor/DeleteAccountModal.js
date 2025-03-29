import React from 'react'

const DeleteAccountModal = ({ error, handleDeleteAccount }) => {
  return (
    <div
      className='modal fade'
      id='deleteAccountModal'
      tabIndex='-1'
      aria-labelledby='deleteAccountModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='deleteAccountModalLabel'>
              Confirm Account Deletion
            </h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body'>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            {error && <div className='alert alert-danger mt-2'>{error}</div>}
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              data-bs-dismiss='modal'
            >
              Close
            </button>
            <button
              type='button'
              className='btn btn-danger'
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccountModal
