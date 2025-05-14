import React from 'react'
import { FormProvider, Controller } from 'react-hook-form'

export default function JoinFamily({
  formMethods,
  courses,
  globalError,
  successMessage,
  onSubmit
}) {
  if (!formMethods) return null

  return (
    <section className='container py-5'>
      <div className='row justify-content-center'>
        <div className='col-lg-8 col-md-10'>
          <div className='text-center mb-5'>
            <h2 className='fw-bold display-5 mb-3'>Join Our Instructor Family</h2>
            <p className='lead text-muted'>Create your instructor account and start sharing your knowledge</p>
          </div>

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
            <div className='card shadow-sm border-0'>
              <div className='card-body p-4 p-md-5'>
                <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                  <div className='row'>
                    <div className='col-md-6 mb-4'>
                      <label className='form-label fw-semibold'>First Name</label>
                      <div className='input-group'>
                        <span className='input-group-text'>
                          <i className='bi bi-person'></i>
                        </span>
                        <Controller
                          control={formMethods.control}
                          name='firstname'
                          rules={{ required: 'First name is required' }}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <input
                                {...field}
                                className={`form-control ${error ? 'is-invalid' : ''}`}
                                placeholder='Your First Name'
                              />
                              {error && (
                                <div className='invalid-feedback'>{error.message}</div>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>

                    <div className='col-md-6 mb-4'>
                      <label className='form-label fw-semibold'>Last Name</label>
                      <div className='input-group'>
                        <span className='input-group-text'>
                          <i className='bi bi-person'></i>
                        </span>
                        <Controller
                          control={formMethods.control}
                          name='lastname'
                          rules={{ required: 'Last name is required' }}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <input
                                {...field}
                                className={`form-control ${error ? 'is-invalid' : ''}`}
                                placeholder='Your Last Name'
                              />
                              {error && (
                                <div className='invalid-feedback'>{error.message}</div>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='mb-4'>
                    <label className='form-label fw-semibold'>Email</label>
                    <div className='input-group'>
                      <span className='input-group-text'>
                        <i className='bi bi-envelope'></i>
                      </span>
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
                              className={`form-control ${error ? 'is-invalid' : ''}`}
                              placeholder='Your Email'
                            />
                            {error && (
                              <div className='invalid-feedback'>{error.message}</div>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className='mb-4'>
                    <label className='form-label fw-semibold'>Expertise</label>
                    <Controller
                      control={formMethods.control}
                      name='expertise'
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <textarea
                            {...field}
                            className={`form-control ${error ? 'is-invalid' : ''}`}
                            rows='3'
                            placeholder='Briefly describe your expertise and teaching experience'
                          />
                          {error && (
                            <div className='invalid-feedback'>{error.message}</div>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className='mb-4'>
                    <label className='form-label fw-semibold'>Choose Course(s)</label>
                    <Controller
                      control={formMethods.control}
                      name='courses'
                      rules={{ required: 'Please select at least one course' }}
                      render={({
                        field: { onChange, value = [] },
                        fieldState: { error }
                      }) => (
                        <>
                          <select
                            multiple
                            value={value}
                            onChange={e =>
                              onChange(
                                [...e.target.selectedOptions].map(
                                  option => option.value
                                )
                              )
                            }
                            className={`form-select ${error ? 'is-invalid' : ''}`}
                            style={{ height: 'auto' }}
                          >
                            {courses.map(course => (
                              <option key={course.id} value={course.id}>
                                {course.title}
                              </option>
                            ))}
                          </select>
                          {error && (
                            <div className='invalid-feedback'>{error.message}</div>
                          )}
                        </>
                      )}
                    />
                    <small className='text-muted'>Hold Ctrl/Cmd to select multiple courses</small>
                  </div>

                  <div className='mb-4'>
                    <label className='form-label fw-semibold'>Resume/CV</label>
                    <Controller
                      control={formMethods.control}
                      name='resume'
                      render={({ field }) => (
                        <input
                          type='file'
                          className='form-control'
                          onChange={e =>
                            formMethods.setValue('resume', e.target.files[0])
                          }
                        />
                      )}
                    />
                  </div>

                  <div className='d-grid mt-4'>
                    <button type='submit' className='btn btn-primary mx-auto btn-sm w-50'>
                      Join Our Instructor Team
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </section>
  )
}