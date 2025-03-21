import React from 'react'
import { FormProvider, Controller } from 'react-hook-form'

export default function JoinFamily ({
  formMethods,
  courses,
  globalError,
  successMessage,
  onSubmit
}) {
  if (!formMethods) return null

  return (
    <section className='becinsjoin-container text-center'>
      <h2 className='fw-bold'>Join Our Family</h2>
      <p>Create your account now</p>

      {successMessage && (
        <div className='alert alert-success text-center' role='alert'>
          {successMessage}
        </div>
      )}

      {globalError && (
        <div className='alert alert-danger text-center' role='alert'>
          {globalError}
        </div>
      )}

      <FormProvider {...formMethods}>
        <div className='becinsjoin-form-container'>
          <form
            className='becinsjoin-form'
            onSubmit={formMethods.handleSubmit(onSubmit)}
          >
            <label className='becinsjoin-label'>First Name</label>
            <div className='becinsjoin-input-group'>
              <i className='bi bi-person'></i>
              <Controller
                control={formMethods.control}
                name='firstname'
                rules={{ required: 'First name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      className='becinsjoin-input'
                      placeholder='Your First Name'
                    />
                    {error && (
                      <div className='error-message'>{error.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            <label className='becinsjoin-label'>Last Name</label>
            <div className='becinsjoin-input-group'>
              <i className='bi bi-person'></i>
              <Controller
                control={formMethods.control}
                name='lastname'
                rules={{ required: 'Last name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      className='becinsjoin-input'
                      placeholder='Your Last Name'
                    />
                    {error && (
                      <div className='error-message'>{error.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            <label className='becinsjoin-label'>Email</label>
            <div className='becinsjoin-input-group'>
              <i className='bi bi-envelope'></i>
              <Controller
                control={formMethods.control}
                name='email'
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Invalid email format'
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      type='email'
                      className='becinsjoin-input'
                      placeholder='Your Email'
                    />
                    {error && (
                      <div className='error-message'>{error.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            <label className='becinsjoin-label'>Expertise</label>
            <Controller
              control={formMethods.control}
              name='expertise'
              render={({ field, fieldState: { error } }) => (
                <>
                  <textarea
                    {...field}
                    className='becinsjoin-input'
                    rows='3'
                    placeholder='Your Expertise'
                  />
                  {error && (
                    <div className='error-message'>{error.message}</div>
                  )}
                </>
              )}
            />

            <label className='becinsjoin-label'>Choose Course</label>
            <div className='becinsjoin-input-group'>
              <i className='bi bi-book'></i>
              <Controller
                control={formMethods.control}
                name='courses'
                rules={{ required: 'Please select at least one course' }}
                render={({
                  field: { onChange, value },
                  fieldState: { error }
                }) => (
                  <>
                    <select
                      multiple
                      value={value || []}
                      onChange={e =>
                        onChange(
                          [...e.target.selectedOptions].map(
                            option => option.value
                          )
                        )
                      }
                      className='becinsjoin-input'
                    >
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    {error && (
                      <div className='error-message'>{error.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            <label className='becinsjoin-label'>Resume</label>
            <Controller
              control={formMethods.control}
              name='resume'
              render={({ field }) => (
                <input
                  type='file'
                  className='becinsjoin-input form-control'
                  onChange={e =>
                    formMethods.setValue('resume', e.target.files[0])
                  }
                />
              )}
            />

            <button type='submit' className='becinsjoin-btn'>
              Join Our Team
            </button>
          </form>
        </div>
      </FormProvider>
    </section>
  )
}
