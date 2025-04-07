import React, { useRef } from 'react'
import '../../styles/styles.css'
import AccountSettingsHero from './sections/AccountSettingsHero'
import ProfileUpdate from './sections/ProfileUpdate'
import PasswordSecurity from './sections/PasswordSecurity'
import NotificationPreferences from './sections/NotificationPreferences'
import Foot from '../../layouts/Footer'

const AccoyntSettings = () => {
  const profileRef = useRef(null)
  const passwordRef = useRef(null)

  const scrollToSection = ref => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <div className='home-container'>
      <section>
        <section className='section-container'>
          <AccountSettingsHero
            onEditProfileClick={() => scrollToSection(profileRef)}
            onChangePasswordClick={() => scrollToSection(passwordRef)}
          />
        </section>
        <section className='section-container' ref={profileRef}>
          <ProfileUpdate />
        </section>
        <section className='section-container' ref={passwordRef}>
          <PasswordSecurity />
        </section>
        <section className='section-container'>
          <NotificationPreferences />
        </section>
        <Foot />
      </section>
    </div>
  )
}

export default AccoyntSettings
