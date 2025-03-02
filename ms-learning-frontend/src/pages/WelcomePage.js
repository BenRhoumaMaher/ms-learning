import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function WelcomePage () {
  const navigate = useNavigate()
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center'>
      <div className='text-center'>
        <h1 className='text-success'>Welcome, {user.username}!</h1>
        <p>You have successfully logged in.</p>
        <button
          className='btn btn-danger'
          onClick={() => {
            localStorage.removeItem('token')
            sessionStorage.removeItem('token')
            localStorage.removeItem('username')
            navigate('/login')
          }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
