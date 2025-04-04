import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { getCategories } from '../../../helpers/api'

const CatalogCour = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 3

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = category => {
    setSelectedCategory(category.id)
    setCourses(category.courses)
    setCurrentPage(1)
  }

  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse)
  const totalPages = Math.ceil(courses.length / coursesPerPage)

  return (
    <div className='container catalogcour-section mt-5'>
      <div className='catalogcour-categories d-flex flex-wrap justify-content-center gap-3'>
        {loading ? (
          <p>Loading categories...</p>
        ) : categories.length > 0 ? (
          categories.map(category => (
            <button
              key={category.id}
              className={`btn category-btn ${
                selectedCategory === category.id ? 'active' : ''
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </button>
          ))
        ) : (
          <p>No categories available.</p>
        )}
      </div>

      <div className='row mt-4'>
        {currentCourses.length > 0 ? (
          currentCourses.map(course => (
            <div key={course.id} className='col-md-4 col-sm-6 mb-4'>
              <div className=''>
                <img
                  src={`http://localhost:8080/${course.image}`}
                  alt={course.title}
                  className='img-fluid'
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <h6 className='mt-2'>{course.title}</h6>
              </div>
            </div>
          ))
        ) : selectedCategory ? (
          <p>No courses available for this category.</p>
        ) : (
          <p>Select a category to view courses.</p>
        )}
      </div>

      {courses.length > coursesPerPage && (
        <nav>
          <ul className='pagination justify-content-center mt-4'>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className='page-link'
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ⬅ Prev
              </button>
            </li>

            {Array.from({ length: totalPages }).map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
              >
                <button
                  className='page-link'
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? 'disabled' : ''
              }`}
            >
              <button
                className='page-link'
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next ➡
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default CatalogCour
