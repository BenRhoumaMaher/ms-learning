import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/styles.css'
import logo from '../assets/logo.png'

const Navbar = () => {
  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-white shadow-sm'>
      <div className='container-fluid px-4'>
        <div className='d-flex align-items-center'>
          <Link to='/' className='navbar-brand me-3'>
            <img src={logo} alt='Logo' height='40' />
          </Link>

          <span className='nav-text me-3'>Explore</span>

          <form className='d-none d-md-flex'>
            <input
              className='form-control me-2'
              type='search'
              placeholder='Search...'
              aria-label='Search'
            />
          </form>
        </div>

        <div className='d-flex align-items-center'>
          <Link to='/' className='nav-link'>
            <i className='bi bi-house-door'></i>
          </Link>
          <div className='nav-separator'></div>

          <Link to='/careers' className='nav-link'>
            Careers
          </Link>
          <div className='nav-separator'></div>

          <Link to='/login' className='nav-link'>
            Login
          </Link>
          <div className='nav-separator'></div>

          <Link to='/signup' className='nav-link'>
            Signup
          </Link>
          <div className='nav-separator'></div>

          <Link to='#' className='nav-link'>
            <i className='bi bi-globe'></i>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
