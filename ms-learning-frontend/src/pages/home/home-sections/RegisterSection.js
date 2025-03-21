import React from 'react'
import { Link } from 'react-router-dom'

const RegisterSection = () => {
  const isAuthenticated =
    localStorage.getItem('token') || sessionStorage.getItem('token')

  if (isAuthenticated) return null

  return (
    <section className='register-section text-center'>
      <div className='container'>
        <h3 className='register-title'>Register for a free account</h3>
        <p className='register-subtitle'>Sign up now</p>
        <Link to='/signup' className='btn btn-danger register-btn'>
          Join Us
        </Link>
      </div>
    </section>
  )
}

export default RegisterSection
