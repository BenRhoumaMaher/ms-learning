import React from 'react'
import '../../styles/styles.css'
import AccountSettingsHero from './sections/AccountSettingsHero'
import ProfileUpdate from './sections/ProfileUpdate'
import PasswordSecurity from './sections/PasswordSecurity'
import NotificationPreferences from './sections/NotificationPreferences'
import Foot from '../../layouts/Footer'

const AccoyntSettings = () => {
  return (
    <div className='home-container'>
      <section>
        <section className='section-container'>
          <AccountSettingsHero />
        </section>
        <section className='section-container'>
          <ProfileUpdate />
        </section>
        <section className='section-container'>
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
