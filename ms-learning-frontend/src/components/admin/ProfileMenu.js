import React from 'react'
import { FaCog, FaSignOutAlt } from 'react-icons/fa'

const ProfileMenu = () => {
  return (
    <div className='bg-secondary text-white p-2 position-absolute rounded shadow mt-2'>
      <ul className='list-unstyled mb-0'>
        <li className='py-1'>
          <FaCog className='me-2' /> Settings
        </li>
        <li className='py-1'>
          <FaSignOutAlt className='me-2' /> Logout
        </li>
      </ul>
    </div>
  )
}

export default ProfileMenu
