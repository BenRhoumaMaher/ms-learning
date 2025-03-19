import React, { useEffect, useState } from 'react';
import { getCategories } from '../../../helpers/api';

const CoursesSection = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
    setCourses(category.courses);
  };

  return (
    <section className='courses-section'>
      <div className='container text-center'>
        <h2 className='fw-bold'>Transform Your Skills with Courses Designed for You</h2>
        <p className='text-muted'>From AI to Art, Learn Anything, Anytime, in Any Language</p>

        <div className='categories-container d-flex justify-content-center flex-wrap mt-4'>
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category.id}
                className={`btn category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category.name}
              </button>
            ))
          ) : (
            <p>Loading categories...</p>
          )}
        </div>

        <div className='row mt-5'>
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className='col-md-4'>
                <div className='course-card'>
                  <div className='course-image'>
                  {course.image && <img className='course-image' src={`http://localhost:8080/${course.image}`} alt='course thumbnail' />}
                  </div>
                  <div className='course-info'>
                    <h5 className='text-danger'>{course.title}</h5>
                    <p className='text-primary'>{course.description}</p>
                    <p className='text-success'>Price: ${course.price}</p>
                    <div className='rating'>★ ★ ★ ☆ ☆</div>
                  </div>
                </div>
              </div>
            ))
          ) : selectedCategory ? (
            <p>No courses available for this category.</p>
          ) : (
            <p>Select a category to see courses.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
