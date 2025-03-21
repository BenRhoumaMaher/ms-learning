import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/admin/Sidebar'
import {
  getINstructorDemands,
  DeleteINstructorDemands,
  handleAccept
} from '../../helpers/api'

const InstructorDemands = () => {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getINstructorDemands()
        setUsers(data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }

    fetchUsers()
  }, [])

  // Open confirmation modal
  const handleShowModal = id => {
    setUserToDelete(id)
    setShowModal(true)
  }

  // Close confirmation modal
  const handleCloseModal = () => {
    setShowModal(false)
    setUserToDelete(null)
  }

  // Handle delete function
  const handleDelete = async () => {
    if (!userToDelete) return

    try {
      await DeleteINstructorDemands(userToDelete)
      setUsers(users.filter(user => user.id !== userToDelete))
    } catch (error) {
      console.error('Failed to delete user:', error)
    }

    handleCloseModal()
  }

  const handleAcceptInstructor = async id => {
    try {
      await handleAccept(id)
      setUsers(users.filter(user => user.id !== id))
    } catch (error) {
      console.error('Error accepting instructor:', error)
    }
  }

  return (
    <div className='d-flex'>
      <Sidebar />

      <div className='flex-grow-1 p-3'>
        <h2>Instructor Demands</h2>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Avatar</th>
              <th>FirstName</th>
              <th>LastName</th>
              <th>UserName</th>
              <th>Email</th>
              <th>Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.picture && (
                    <img
                      className='user-image'
                      src={`http://localhost:8080/${user.picture}`}
                      alt='User Avatar'
                      width='50'
                    />
                  )}
                </td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                {user.courses && user.courses.length > 0 ? (
                  user.courses.map((course, index) => (
                    <span key={index}>
                      {course.title}
                      {index !== user.courses.length - 1 && ', '}
                    </span>
                  ))
                ) : (
                  <span>No courses</span>
                )}
                <td>
                  <button
                    className='btn btn-warning btn-sm me-2'
                    onClick={() => handleAcceptInstructor(user.id)}
                  >
                    <i className='fas fa-edit'></i> Accept
                  </button>

                  <button
                    className='btn btn-danger btn-sm'
                    onClick={() => handleShowModal(user.id)}
                  >
                    <i className='fas fa-trash'></i> Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className={`modal fade ${showModal ? 'show d-block' : ''}`}
        tabIndex='-1'
        role='dialog'
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title'>Confirm Deletion</h5>
              <button
                type='button'
                className='btn-close'
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className='modal-body'>
              <p>Are you sure you want to decline this instructor request?</p>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type='button'
                className='btn btn-danger'
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && <div className='modal-backdrop fade show'></div>}
    </div>
  )
}

export default InstructorDemands
