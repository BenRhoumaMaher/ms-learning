import React from 'react'

const ProfileForm = ({
  userInfo,
  profileImage,
  onImageChange,
  onInputChange,
  onSave
}) => {
  const handleFileChange = e => {
    onImageChange(e.target.files[0])
  }

  return (
    <div>
      <h5 className='text-light'>Profile Settings</h5>
      <div className='d-flex align-items-center mb-4'>
        <img
          src={
            profileImage
              ? `http://localhost:8080/images/profiles/${profileImage}`
              : '/default-profile.png'
          }
          alt='Profile'
          className='rounded-circle me-3 shadow-lg'
          width='120'
          height='120'
        />
        <div>
          <input
            type='file'
            className='form-control form-control-sm'
            accept='image/*'
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className='row gy-3'>
        {[
          { name: 'firstName', label: 'First Name', cols: 6 },
          { name: 'lastName', label: 'Last Name', cols: 6 },
          { name: 'username', label: 'Username', cols: 6 },
          { name: 'phone', label: 'Phone', cols: 6 },
          { name: 'address', label: 'Address', cols: 6 },
          { name: 'expertise', label: 'Expertise', cols: 6 },
          { name: 'linkedin', label: 'LinkedIn', cols: 6 },
          { name: 'x', label: 'X (Twitter)', cols: 6 },
          { name: 'instagram', label: 'Instagram', cols: 6 },
          { name: 'facebook', label: 'Facebook', cols: 6 }
        ].map(field => (
          <div key={field.name} className={`col-md-${field.cols}`}>
            <label className='form-label'>{field.label}</label>
            <input
              type='text'
              name={field.name}
              className='form-control'
              value={userInfo[field.name] || ''}
              onChange={onInputChange}
            />
          </div>
        ))}
      </div>

      <div className='mt-4 text-center'>
        <button className='btn btn-info btn-lg w-25' onClick={onSave}>
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default ProfileForm
