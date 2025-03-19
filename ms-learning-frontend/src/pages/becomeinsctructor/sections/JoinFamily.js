import React from 'react'

const JoinFamily = () => {
  return (
    <section className='becinsjoin-container text-center'>
      <h2 className='fw-bold'>Join Our Family</h2>
      <p>Create your account now</p>

      <div className='becinsjoin-form-container'>
        <form className='becinsjoin-form'>
          <label className='becinsjoin-label'>Name</label>
          <div className='becinsjoin-input-group'>
            <i className='bi bi-person'></i>
            <input
              type='text'
              className='becinsjoin-input'
              placeholder='Your Name'
            />
          </div>

          <label className='becinsjoin-label'>Email</label>
          <div className='becinsjoin-input-group'>
            <i className='bi bi-envelope'></i>
            <input
              type='email'
              className='becinsjoin-input'
              placeholder='Your Email'
            />
          </div>

          <label className='becinsjoin-label'>Expertise</label>
          <textarea
            className='becinsjoin-input'
            rows='3'
            placeholder='Your Expertise'
          ></textarea>

          <label className='becinsjoin-label'>Choose Course</label>
          <div className='becinsjoin-input-group'>
            <i className='bi bi-book'></i>
            <input
              type='text'
              className='becinsjoin-input'
              placeholder='Preferred Course'
            />
          </div>

          <label className='becinsjoin-label'>Resume</label>
          <input type='file' className='becinsjoin-input form-control' />

          <button type='submit' className='becinsjoin-btn'>
            Join Our Team
          </button>
        </form>
      </div>
    </section>
  )
}

export default JoinFamily
