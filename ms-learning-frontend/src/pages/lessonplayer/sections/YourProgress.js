import React from 'react'

const YourProgress = () => {
  return (
    <section className='container my-5'>
      <div className='row align-items-center'>
        <div className='col-md-6'>
          <h4 className='fw-bold text-center'>Your Progress</h4>
          <p className='text-center text-muted mb-5'>
            Track your progress and earn your certificate
          </p>

          <div className='progress lessplay-progress my-3'>
            <div
              className='progress-bar bg-success'
              role='progressbar'
              style={{ width: '72%' }}
              aria-valuenow='72'
              aria-valuemin='0'
              aria-valuemax='100'
            >
              72%
            </div>
          </div>

          <p className='text-primary text-center'>
            Completed 72% of the course, you need to pass the quiz exam
          </p>

          <div className='text-center'>
            <button className='btn btn-primary lessplay-download-btn'>
              Download
            </button>
          </div>

          <div className='d-flex justify-content-center gap-3 mt-3'>
            <i className='fab fa-facebook-f text-primary fs-3'></i>
            <i className='fab fa-linkedin-in text-primary fs-3'></i>
            <i className='fab fa-instagram text-danger fs-3'></i>
          </div>
        </div>

        <div className='col-md-6 text-center'>
          <div className='lessplay-certificate-box'>
          <i class="fa-solid fa-certificate fa-10x text-primary"></i>
          </div>
        </div>
      </div>
    </section>
  )
}

export default YourProgress
