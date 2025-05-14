import React, { useEffect, useState } from 'react';
import { getCategories } from '../../../helpers/api';
import { useTranslation } from "react-i18next";

const CoursesSection = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 2;

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
    setCurrentPage(0);
  };

  const handleNext = () => {
    const totalPages = Math.ceil(courses.length / coursesPerPage);
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const indexOfLastCourse = (currentPage + 1) * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <section className='courses-section'>
      <div className='container text-center'>
        <h2 className='fw-bold'>{t("Transform Your Skills with Courses Designed for You")}</h2>
        <p className='text-muted'>{t("From AI to Art, Learn Anything, Anytime, in Any Language")}</p>

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
            <p>{t("Loading categories...")}</p>
          )}
        </div>

        <div className='row mt-5'>
          {currentCourses.length > 0 ? (
            currentCourses.map((course) => (
              <div key={course.id} className='col-md-6'>
                <div className='course-card'>
                  <div className='course-image'>
                    {course.image && <img className='course-image' src={`http://localhost:8080/${course.image}`} alt='course thumbnail' />}
                  </div>
                  <div className='course-info'>
                    <h5 className='text-danger'>{course.title}</h5>
                    <p className='text-primary'>{course.description}</p>
                    <p className='text-success'>{t("Price")}: ${course.price}</p>
                    <div className='rating'>{t("Rating")}: ★ ★ ★ ☆ ☆</div>
                  </div>
                </div>
              </div>
            ))
          ) : selectedCategory ? (
            <p>{t("No courses available for this category.")}</p>
          ) : (
            <p>{t("Select a category to see courses.")}</p>
          )}
        </div>

        {courses.length > coursesPerPage && (
          <div className='pagination-controls mt-4'>
            <button
              className='btn btn-outline-primary me-2'
              onClick={handlePrev}
              disabled={currentPage === 0}
            >
              {t("Previous")}
            </button>
            <button
              className='btn btn-outline-primary ms-2'
              onClick={handleNext}
              disabled={currentPage === Math.ceil(courses.length / coursesPerPage) - 1}
            >
              {t("Next")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;