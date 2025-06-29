import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/styles.css'
import logo from '../assets/logo.png'
import useClickOutside from '../hooks/useClickOutside'
import { useNavigate } from 'react-router-dom'
import { getUserInfos } from '../helpers/api'
import CourseSearch from '../components/search/CourseSearch';
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const isAuthenticated =
    localStorage.getItem('token') || sessionStorage.getItem('token')
  const user = isAuthenticated
    ? JSON.parse(atob(isAuthenticated.split('.')[1]))
    : null
  const userId = user?.user_id || null
  const userRoles = user?.roles || []
  const userImage = 'http://localhost:8080/profile/avatar.png'
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')

  useEffect(() => {
    if (userId) {
      getUserInfos()
        .then(data => {
          setUsername(data.username || t('Guest'))
        })
        .catch(error => {
          console.error('Error fetching user info:', error)
        })
    }
  }, [userId, t])

  useClickOutside(dropdownRef, () => setShowProfileMenu(false))

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-navbar'>
      <div className='container-fluid px-4'>
        <div className='d-flex align-items-center'>
          <Link to='/' className='navbar-brand me-3'>
            <img src={logo} alt='Logo' height='40' />
          </Link>

          {isAuthenticated && !userRoles?.includes('ROLE_INSTRUCTOR') && (
            <>
              <Link to='/course-catalog' className='nav-link'>
                <span className='nav-text me-3'>{t('Explore')}</span>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <div className='d-none d-md-flex me-2 nav-search-container'>
                <CourseSearch compact />
              </div>
            </>
          )}
        </div>

        <div className='d-flex align-items-center'>
          {isAuthenticated ? (
            <>
              <Link to='/' className='nav-link'>
                <i className='bi bi-shop'></i>
              </Link>
              <div className='nav-separator'></div>

              {userRoles.includes('ROLE_INSTRUCTOR') && (
                <>
                  <Link to={`/instructor-iot-dashboard/${userId}`} className='nav-link'>
                    <i class="bi bi-clipboard-data"></i>
                  </Link>
                  <div className='nav-separator'></div>
                </>
              )}
              {userRoles.includes('ROLE_INSTRUCTOR') && (
                <>
                  <Link to={`/msconnect-forum/${userId}`} className='nav-link'>
                    <i class="bi bi-newspaper"></i>
                  </Link>
                  <div className='nav-separator'></div>
                </>
              )}
              <Link
                to={`/msconnect-home/${userId}`}
                className='nav-link'>
                <i class="bi bi-pencil-square"></i>
              </Link>
              <div className='nav-separator'></div>

              <Link
                to={`/msconnect-message/${userId}`}
                className='nav-link'>
                <i className='bi bi-chat'></i>
              </Link>
              <div className='nav-separator'></div>

              <Link
                to={`/msconnect-notifications/${userId}`}
                className='nav-link'>
                <i className='bi bi-bell'></i>
              </Link>
              <div className='nav-separator'></div>

              <div className='nav-profile' ref={dropdownRef}>
                <button
                  className='nav-link profile-icon-btn'
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <i className='bi bi-person'></i>
                </button>

                {showProfileMenu && (
                  <div className='profile-dropdown'>
                    <div className='profile-info'>
                      <img
                        src={userImage}
                        alt='User'
                        className='profile-image'
                      />
                      <p className='username'>{username}</p>
                    </div>
                    {userRoles.includes('ROLE_INSTRUCTOR') ? (
                      <Link
                        to='/instructor-dashboard'
                        className='dropdown-item'
                      >
                        {t('Dashboard')}
                      </Link>
                    ) : (
                      <Link to='/student-dashboard' className='dropdown-item'>
                        {t('Dashboard')}
                      </Link>
                    )}
                    {userRoles.includes('ROLE_INSTRUCTOR') ? (
                      <Link
                        to={`/msconnect-profile/${userId}`}
                        className='dropdown-item'
                      >
                        {t('MS-CONNECT Profile')}
                      </Link>
                    ) : (
                      <Link to={`/msconnect-profile/${userId}`}
                        className='dropdown-item'>
                        {t('MS-CONNECT Profile')}
                      </Link>
                    )}
                    {userRoles.includes('ROLE_INSTRUCTOR') ? (
                      <Link to='/' className='dropdown-item'>
                        {t('Notifications')}
                      </Link>
                    ) : (
                      <Link
                        to={`/student-notifications/${userId}`}
                        className='dropdown-item'
                      >
                        {t('Notifications')}
                      </Link>
                    )}
                    {userRoles.includes('ROLE_INSTRUCTOR') ? (
                      <Link to='/instructor-calendar' className='dropdown-item'>
                        {t('Calendar')}
                      </Link>
                    ) : (
                      <Link to='/student-calendar' className='dropdown-item'>
                        {t('Calendar')}
                      </Link>
                    )}
                    {userRoles.includes('ROLE_INSTRUCTOR') ? (
                      <Link to='/create-course' className='dropdown-item'>
                        {t('Create Course')}
                      </Link>
                    ) : (
                      <Link
                        to={`/user-enrollements/${userId}`}
                        className='dropdown-item'>
                        {t('My Enrolled Courses')}
                      </Link>
                    )}
                    {userRoles.includes('ROLE_INSTRUCTOR') ? (
                      <Link to='/' className='dropdown-item'>
                        ---------------
                      </Link>
                    ) : (
                      <Link to='/student-payment' className='dropdown-item'>
                        {t('Payment Portal')}
                      </Link>
                    )}
                    {userRoles.includes('ROLE_INSTRUCTOR') ? (
                      <Link
                        to='/account-settings-instructor'
                        className='dropdown-item'
                      >
                        {t('Account Settings')}
                      </Link>
                    ) : (
                      <Link to='/account-settings' className='dropdown-item'>
                        {t('Account Settings')}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        localStorage.removeItem('token')
                        sessionStorage.removeItem('token')
                        localStorage.removeItem('username')
                        navigate('/login')
                      }}
                      className='dropdown-item logout'
                    >
                      {t('Logout')}
                    </button>
                  </div>
                )}
              </div>

              {/* <div className='nav-separator'></div>
              <Link to='/' className='nav-link'>
                <i className='bi bi-house-door'></i>
              </Link>
              <div className='nav-separator'></div> */}
            </>
          ) : (
            <>
              {/* <Link to='/become-instructor' className='nav-link'>
                {t('Careers')}
              </Link>
              <div className='nav-separator'></div> */}
              {(!isAuthenticated || (isAuthenticated && !userRoles?.includes('ROLE_INSTRUCTOR'))) && (
                <>
                  <Link to='/become-instructor' className='nav-link'>
                    {t('Careers')}
                  </Link>
                  <div className='nav-separator'></div>
                </>
              )}

              <Link to='/login' className='nav-link'>
                {t('Login')}
              </Link>
              <div className='nav-separator'></div>

              <Link to='/signup' className='nav-link'>
                Signup
              </Link>
              <div className='nav-separator'></div>
            </>
          )}

          <button
            onClick={() => i18n.changeLanguage(i18n.language === "en" ? "fr" : "en")}
            className='nav-link globe-btn'
          >
            <i className='bi bi-globe me-2'></i>
            <span className='language-label'>
              {i18n.language === "en" ? "FR" : "EN"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
