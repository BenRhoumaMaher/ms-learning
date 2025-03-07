import React, { useState } from 'react'

const CommunityMessages = () => {
  const [activePage, setActivePage] = useState(1)
  const totalPages = 11

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page)
    }
  }

  return (
    <section className='section-container'>
      <div className='container'>
        <div className='text-start mb-4'>
          <h3 className='fw-bold'>From the Community</h3>
          <p className='text-primary'>
            Stay connected with your peers and instructors
          </p>
        </div>

        <div className='feature-container gap-5'>
          {[1, 2, 3].map((_, index) => (
            <div key={index} className='feature-box message-card bg-info'>
              <div className='course-icon'>
                <i className='bi bi-person'></i>
              </div>
              <h5 className='message-sender text-danger fw-bold'>
                Sender Name
              </h5>
              <p className='message-preview'>Message Preview</p>
              <p className='message-time'>Sent at 12:00:10</p>
              <button className='btn btn-light'>View Full Message</button>
            </div>
          ))}
        </div>

        <div className='pagination-container'>
          <button
            className='pagination-btn'
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
          >
            &lt;
          </button>

          {[1, 2, 3, 4, 5, '...', totalPages].map((page, index) => (
            <button
              key={index}
              className={`pagination-btn ${
                activePage === page ? 'active' : ''
              }`}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className='pagination-btn'
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  )
}

export default CommunityMessages
