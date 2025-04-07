import React from 'react'
import DeleteAccountModal from '../../../components/accountsettingsinstructor/DeleteAccountModal'
import { useUserAuth } from '../../../hooks/useUserAuth'

const AccountSettingsHero = ({ onEditProfileClick, onChangePasswordClick }) => {
  const { userId, error, handleDeleteAccount } = useUserAuth()

  return (
    <section className='accset-hero'>
      <div className='container-fluid'>
        <div className='row justify-content-between'>
          <div className='col-md-6 accset-left'>
            <h2 className='accset-title'>Your Account, Your Way</h2>
            <p className='accset-subtitle'>
              <span className='accset-highlight'>Take Control</span>, Student’s
              Name Customize Your Learning Experience.
            </p>
            {error && <div className='alert alert-danger mt-3'>{error}</div>}
            <div className='accset-buttons'>
              <button
                className='accset-btn accset-edit-btn'
                onClick={onEditProfileClick}
              >
                Edit Profile
              </button>
              <button
                className='accset-btn accset-password-btn'
                onClick={onChangePasswordClick}
              >
                Change Password
              </button>
            </div>
          </div>

          <div className='col-md-6 accset-right'>
            <div className='accset-profile d-flex align-items-center justify-content-end'>
              <div className='accset-avatar'>
                <i className='fas fa-user fa-4x text-info'></i>
              </div>
              <div className='accset-info text-center'>
                <h4 className='accset-name'>Name & email</h4>
                <p className='accset-membership'>
                  Membership type (Free/Premium)
                </p>
                <button
                  className='accset-btn accset-delete-btn'
                  data-bs-toggle='modal'
                  data-bs-target='#deleteAccountModal'
                >
                  Delete account ?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteAccountModal
        error={error}
        handleDeleteAccount={handleDeleteAccount}
      />
    </section>
  )
}

export default AccountSettingsHero
