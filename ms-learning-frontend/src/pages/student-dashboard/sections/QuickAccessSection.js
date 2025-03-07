import React from 'react'

const QuickAccessSection = () => {
  return (
    <section className='text-center my-5'>
      <h3 className='fw-bold'>Quick Access</h3>
      <p className='text-muted'>
        Note-taking, planning, and staying on top of your learning game
      </p>

      <div className='d-flex justify-content-center gap-5 mt-4'>
        <div className='text-center'>
          <div className='certificate-icon'>
            <i className='fas fa-bookmark fa-10x text-info'></i>
          </div>
          <p className='fw-bold text-danger mt-2'>Notes & Bookmarks</p>
        </div>

        <div className='text-center'>
          <div className='certificate-icon'>
            <i className='fas fa-calendar fa-10x text-info'></i>
          </div>
          <p className='fw-bold text-danger mt-2'>Learning Planner</p>
        </div>
      </div>
    </section>
  )
}

export default QuickAccessSection
