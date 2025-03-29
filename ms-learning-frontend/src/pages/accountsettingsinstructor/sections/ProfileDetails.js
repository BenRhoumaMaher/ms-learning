import React, { useState } from 'react'
import { useUserProfile } from '../../../hooks/useUserProfile'
import { ProfileTabs } from '../../../components/accountsettingsinstructor/ProfileTabs'
import { ProfileOverview } from '../../../components/accountsettingsinstructor/ProfileOverview'
import ProfileForm from '../../../components/accountsettingsinstructor/ProfileForm'
import PasswordForm from '../../../components/accountsettingsinstructor/PasswordForm'

const ProfileDetails = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const {
    userInfo,
    profileImage,
    passwordData,
    successMessage,
    errorMessage,
    passwordErrors,
    handleImageChange,
    handleInputChange,
    handlePasswordChange,
    handleSaveChanges,
    handlePasswordUpdate
  } = useUserProfile()

  return (
    <div className='text-white p-5 rounded-3 shadow-lg'>
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className='mt-4'>
        {successMessage && (
          <div className='alert alert-success mt-4' role='alert'>
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className='alert alert-danger mt-4' role='alert'>
            {errorMessage}
          </div>
        )}

        {activeTab === 'overview' && <ProfileOverview userInfo={userInfo} />}
        {activeTab === 'profile' && (
          <ProfileForm
            userInfo={userInfo}
            profileImage={profileImage}
            onImageChange={handleImageChange}
            onInputChange={handleInputChange}
            onSave={handleSaveChanges}
          />
        )}
        {activeTab === 'password' && (
          <PasswordForm
            passwordData={passwordData}
            errors={passwordErrors}
            onChange={handlePasswordChange}
            onUpdate={handlePasswordUpdate}
          />
        )}
      </div>
    </div>
  )
}

export default ProfileDetails
