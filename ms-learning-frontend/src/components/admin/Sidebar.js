import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaTachometerAlt,
  FaUsers,
  FaPlus,
  FaList,
  FaChalkboardTeacher,
  FaCommentDots
} from 'react-icons/fa'
import ProfileMenu from './ProfileMenu'

const Sidebar = () => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [usersMenuOpen, setUsersMenuOpen] = useState(false)
  const [instructorMenuOpen, setInstructorMenuOpen] = useState(false)

  return (
    <div
      className='d-flex flex-column bg-dark text-white vh-100 p-3'
      style={{ width: '250px' }}
    >
      <div className='text-center mb-4 position-relative'>
        <img
          src='https://via.placeholder.com/50'
          alt='Profile'
          className='rounded-circle'
          style={{ cursor: 'pointer' }}
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        />
        {profileMenuOpen && <ProfileMenu />}
      </div>

      <ul className='list-unstyled'>
        <li>
          <Link to='/' className='text-white text-decoration-none d-block py-2'>
            <FaTachometerAlt className='me-2' /> Dashboard
          </Link>
        </li>

        <li>
          <button
            className='btn text-white w-100 text-start'
            onClick={() => setUsersMenuOpen(!usersMenuOpen)}
          >
            <FaUsers className='me-2' /> Users
          </button>
          {usersMenuOpen && (
            <ul className='list-unstyled ms-3'>
              <li>
                <Link
                  to='/admin/users-list'
                  className='text-white text-decoration-none d-block py-2'
                >
                  <FaList className='me-2' /> List of Users
                </Link>
              </li>
              <li>
                <Link
                  to='/users/add'
                  className='text-white text-decoration-none d-block py-2'
                >
                  <FaPlus className='me-2' /> Add User
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <button
            className='btn text-white w-100 text-start'
            onClick={() => setInstructorMenuOpen(!instructorMenuOpen)}
          >
            <FaChalkboardTeacher className='me-2' /> Instructor Demands
          </button>
          {instructorMenuOpen && (
            <ul className='list-unstyled ms-3'>
              <li>
                <Link
                  to='/admin/instructor-demands'
                  className='text-white text-decoration-none d-block py-2'
                >
                  <FaList className='me-2' /> List of Demands
                </Link>
              </li>
              <li>
                <Link
                  to='/admin/pending-approvals'
                  className='text-white text-decoration-none d-block py-2'
                >
                  <FaPlus className='me-2' /> Add New Instructor
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link
            to='/admin/chatbot-messages'
            className='text-white text-decoration-none d-block py-2'
          >
            <FaCommentDots className='me-2' /> Chatbot Messages
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar