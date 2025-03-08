import React from 'react'
import '../../styles/styles.css'
import CourscatlHero from './sections/CourseCatalogHero'
import CatalogCour from './sections/CatalogCourses'
import LiveCourseCatalog from './sections/LiveCourseCatalog'
import TrendingPicks from './sections/TrendingPicks'
import JustForYou from './sections/JustForYou'
import FreshDrops from './sections/FreshDrops'
import BudgetFriendly from './sections/BudgetFriendly'
import MeetMasters from './sections/MeetMasters'
import Footer from '../../layouts/Footer'

const CourseCatalog = () => {
  return (
    <section>
      <section className='courscatl-hero-section'>
        <CourscatlHero />
      </section>
      <section className='catalog-cour-section'>
        <CatalogCour />
      </section>
      <section className='live-cour-section'>
        <LiveCourseCatalog />
      </section>
      <section className='trending-picks-section'>
        <TrendingPicks />
      </section>
      <section className='just-for-you-section'>
        <JustForYou />
      </section>
      <section className='fresh-drops-section'>
        <FreshDrops />
      </section>
      <section className='budget-friendly-section'>
        <BudgetFriendly />
      </section>
      <section className='meet-masters-section'>
        <MeetMasters />
      </section>
      <Footer />
    </section>
  )
}

export default CourseCatalog
