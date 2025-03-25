import React from 'react'
import '../../styles/styles.css'
import Foot from '../../layouts/Footer'
import ProfileDetails from './sections/ProfileDetails'
import ProfileHero from './sections/ProfileHero'

const AccoyntSettingsInstructor = () => {
  return (
    <div className='home-container'>
      <section>
        <section className='section-container'>
          <ProfileHero />
        </section>
        <section className='section-container'>
          <ProfileDetails />
        </section>

        <Foot />
      </section>
    </div>
  )
}

export default AccoyntSettingsInstructor
