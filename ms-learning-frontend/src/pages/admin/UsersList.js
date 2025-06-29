import React, { useEffect, useState } from 'react'
import { getUsers } from '../../helpers/api'
import Sidebar from '../../components/admin/Sidebar'

const UsersList = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className='d-flex'>
      <Sidebar />

      <div className='flex-grow-1 p-3'>
        <h2>User List</h2>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Avatar</th>
              <th>FirstName</th>
              <th>LastName</th>
              <th>UserName</th>
              <th>Email</th>
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
                      alt='course thumbnail'
                    />
                  )}
                </td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button className='btn btn-warning btn-sm me-2'>
                    <i className='fas fa-edit'></i>
                  </button>

                  <button className='btn btn-danger btn-sm'>
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

export default UsersList
