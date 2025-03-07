import React from 'react'
import Carousel from 'react-bootstrap/Carousel'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const QuizzesCertificatesSection = () => {
  const percentage = 66 // Progress toward next certificate

  return (
    <div className='container text-center my-5'>
      <h2>
        <strong>Quizzes & Certificates</strong>
      </h2>
      <p>
        Test your knowledge, earn bragging rights, and collect shiny
        certificates
      </p>

      <div className='row mt-4'>
        <div className='col-md-4'>
          <Carousel indicators={false} interval={4000}>
            <Carousel.Item>
              <div className='quiz-card'>
                <div className='quiz-number'>04</div>
                <h4 className='quiz-title'>Quiz Name</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <button className='btn btn-success'>Start Quiz</button>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className='quiz-card'>
                <div className='quiz-number'>05</div>
                <h4 className='quiz-title'>Advanced Quiz</h4>
                <p>Challenge yourself with harder questions.</p>
                <button className='btn btn-success'>Start Quiz</button>
              </div>
            </Carousel.Item>
          </Carousel>
          <p className='text-danger fw-bold mt-2'>Pending Quizzes</p>
        </div>

        <div className='col-md-4'>
          <div className='certificate-icon'>
            <i className='fas fa-award fa-10x'></i>
          </div>
          <p className='text-danger fw-bold mt-2'>Earned Certificates</p>
        </div>

        <div className='col-md-4'>
          <div className='progress-circle'>
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                pathColor: '#17a2b8',
                textColor: '#000',
                trailColor: '#e0e0e0',
                textSize: '18px'
              })}
            />
          </div>
          <p className='text-danger fw-bold mt-2'>
            progress toward the next certificate
          </p>
        </div>
      </div>
    </div>
  )
}

export default QuizzesCertificatesSection
