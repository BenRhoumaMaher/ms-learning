import React from 'react'
import useCourseForm from '../../../hooks/useCourseForm'
import ModuleLessons from './ModuleLessons'

const CourseForm = ({ userCourses, userId }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    selectedCourse,
    setSelectedCourse,
    loading,
    message,
    moduleFields,
    appendModule,
    removeModule,
    onSubmit
  } = useCourseForm(userId, userCourses, () => setSelectedCourse(null))

  return (
    <section id='course-form' className='course-form'>
      <h2 className='text-center'>Create Your Course Now!</h2>

      {message && (
        <div
          className={`alert ${
            message.type === 'success' ? 'alert-success' : 'alert-danger'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='Course-form-container'>
        <label className='form-label'>Select Your Course</label>
        <select
          {...register('course')}
          className='form-select'
          onChange={e => setSelectedCourse(e.target.value)}
        >
          <option value=''>-- Choose a Course --</option>
          {userCourses.map((course, index) => (
            <option key={index} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        {selectedCourse && (
          <>
            <h3 className='mt-4'>Modules</h3>

            {moduleFields.map((module, moduleIndex) => (
              <div key={module.id} className='module-group'>
                <label>Module Title</label>
                <input
                  type='text'
                  className='form-control'
                  {...register(`modules[${moduleIndex}].title`, {
                    required: true
                  })}
                  placeholder='Enter module title'
                />

                <label>Position</label>
                <input
                  type='number'
                  className='form-control'
                  {...register(`modules[${moduleIndex}].position`, {
                    required: true
                  })}
                  placeholder='Enter position'
                />

                <button
                  type='button'
                  className='btn btn-danger mt-2'
                  onClick={() => removeModule(moduleIndex)}
                >
                  Remove Module
                </button>

                <ModuleLessons
                  moduleIndex={moduleIndex}
                  control={control}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                />
              </div>
            ))}

            <div className='mt-3'>
              <button
                type='button'
                className='btn btn-success'
                onClick={() =>
                  appendModule({
                    title: '',
                    position: moduleFields.length + 1,
                    lessons: []
                  })
                }
              >
                Add Module
              </button>

              <button
                type='submit'
                className='btn btn-primary ms-2'
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </>
        )}
      </form>
    </section>
  )
}

export default CourseForm
