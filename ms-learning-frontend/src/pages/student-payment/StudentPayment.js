import React from 'react'
import '../../styles/styles.css'
import PaymentHero from './sections/PaymentHero'
import SubscriptionPlan from './sections/SubscriptionPlan'
import AvailablePlans from './sections/AvailablePlans'
import PaymentHistory from './sections/PaymentHistory'
import CoursePurchases from './sections/CoursePurchases'
import Promotions from './sections/Promotions'
import Footer from '../../layouts/Footer'

const StudentPayment = () => {
  return (
    <section>
        <section className='section-container'>
            <PaymentHero />
        </section>
        <section className='section-container'>
            <SubscriptionPlan />
        </section>
        <section className='section-container'>
            <AvailablePlans />
        </section>
        <section className='section-container'>
            <PaymentHistory />
        </section>
        <section className='section-container'>
            <CoursePurchases />
        </section>
        <section className='section-container'>
            <Promotions />
        </section>
        <Footer />
    </section>
  )
}

export default StudentPayment
