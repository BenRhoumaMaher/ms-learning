import React from 'react'
import heroImage from '../../../assets/hero-image.jpg'
import { useTranslation } from "react-i18next";

const HeroSection = ({ faqRef }) => {
  const { t } = useTranslation();
  const handleLearnMoreClick = () => {
    faqRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <section className='section-container'>
      <div className='container'>
        <div className='row align-items-center'>
          <div className='col-lg-5 text-center text-lg-start'>
            <h1 className='home-title'>
              MS-<span className='text-danger'>LEARNING</span>
            </h1>
            <p className='home-subtitle'>{t("Learn Smarter, Not Harder")}...</p>
            <p>{t("Anytime, Anywhere")}</p>
            <button className='btn btn-success mt-3' onClick={handleLearnMoreClick}>{t("Learn More")}</button>
          </div>

          <div className='col-lg-5 text-center'>
            <img
              src={heroImage}
              alt='Learning Illustration'
              className='img-fluid home-image'
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
