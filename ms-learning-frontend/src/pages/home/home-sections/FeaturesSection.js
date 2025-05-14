import React from 'react'
import { useTranslation } from "react-i18next";

const FeaturesSection = () => {
  const { t } = useTranslation();
  return (
    <section className='section-container'>
      <div className='container feature-container'>
        <div className='feature-box'>
          <div className='feature-header'>{t("Chatbot")}</div>
          <div className='feature-icon'>
            <i className='bi bi-robot'></i>
          </div>
          <p className='feature-text'>
            {t("Get instant help from our virtual assistant")}
          </p>
        </div>

        <div className='feature-box'>
          <div className='feature-header'>{t("Multilingual Support")}</div>
          <div className='feature-icon'>
            <i className='bi bi-globe'></i>
          </div>
          <p className='feature-text'>{t("Learn in your preferred language")}</p>
        </div>

        <div className='feature-box'>
          <div className='feature-header'>{t("Interactive Quizzes")}</div>
          <div className='feature-icon'>
            <i className='bi bi-puzzle'></i>
          </div>
          <p className='feature-text'>
            {t("Test your knowledge with instant feedback")}
          </p>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
