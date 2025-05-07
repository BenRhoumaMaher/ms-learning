import React, { useRef } from 'react'
import '../../styles/styles.css'
import PaymentHero from './sections/PaymentHero'
import SubscriptionPlan from './sections/SubscriptionPlan'
import AvailablePlans from './sections/AvailablePlans'
import PaymentHistory from './sections/PaymentHistory'
import CoursePurchases from './sections/CoursePurchases'
import Footer from '../../layouts/Footer'

const StudentPayment = () => {
    const availablePlansRef = useRef(null);
    return (
        <section>
            <section className='section-container'>
                <PaymentHero availablePlansRef={availablePlansRef} />
            </section>
            <section className='section-container'>
                <SubscriptionPlan />
            </section>
            <section className='section-container'  ref={availablePlansRef}>
                <AvailablePlans />
            </section>
            <section className='section-container'>
                <PaymentHistory />
            </section>
            <section className='section-container'>
                <CoursePurchases />
            </section>
            <Footer />
        </section>
    )
}

export default StudentPayment
