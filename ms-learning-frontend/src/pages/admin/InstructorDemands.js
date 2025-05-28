import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/admin/Sidebar'
import {
  getINstructorDemands,
  DeleteINstructorDemands,
  handleAccept
} from '../../helpers/api'

const InstructorDemands = () => {
  const [users, setUsers] = useState([])

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

  const handleDeleteConfirmation = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to decline this instructor request?");

    if (isConfirmed) {
      try {
        await DeleteINstructorDemands(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
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
              <th>Resume</th>
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
                <td>
                  {user.resume ? (
                    <a
                      href={user.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      📄 View
                    </a>
                  ) : (
                    'No resume'
                  )}

                </td>
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
                    <i className='fas fa-edit'></i>
                  </button>

                  <button
                    className='btn btn-danger btn-sm'
                    onClick={() => handleDeleteConfirmation(user.id)}
                  >
                    <i className='fas fa-trash'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default InstructorDemands
