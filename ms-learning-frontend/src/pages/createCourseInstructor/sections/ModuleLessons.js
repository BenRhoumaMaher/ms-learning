import React from 'react'
import { useFieldArray } from 'react-hook-form'

const ModuleLessons = ({ moduleIndex, control, register, watch, setValue }) => {
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson
  } = useFieldArray({
    control,
    name: `modules[${moduleIndex}].lessons`
  })

  return (
    <>
      <h4 className='mt-3'>Lessons</h4>

      {lessonFields.map((lesson, lessonIndex) => {
        const isLiveLesson =
          watch(`modules[${moduleIndex}].lessons[${lessonIndex}].type`) ===
          'live'
        const isRegisteredLesson =
          watch(`modules[${moduleIndex}].lessons[${lessonIndex}].type`) ===
          'registered'

        return (
          <div key={lesson.id} className='lesson-group mt-3'>
            <label>Lesson Title</label>
            <input
              type='text'
              className='form-control'
              {...register(
                `modules[${moduleIndex}].lessons[${lessonIndex}].title`,
                { required: true }
              )}
              placeholder='Enter lesson title'
            />

            <label>Content</label>
            <textarea
              className='form-control'
              {...register(
                `modules[${moduleIndex}].lessons[${lessonIndex}].content`,
                { required: true }
              )}
              placeholder='Enter lesson content'
            />

            <label>Duration</label>
            <input
              type='number'
              className='form-control'
              {...register(
                `modules[${moduleIndex}].lessons[${lessonIndex}].duration`,
                { required: true }
              )}
              placeholder='Enter duration (in minutes)'
            />

            <label>Position</label>
            <input
              type='number'
              className='form-control'
              {...register(
                `modules[${moduleIndex}].lessons[${lessonIndex}].position`,
                { required: true }
              )}
              placeholder='Enter position'
            />

            <label>Type</label>
            <select
              className='form-control'
              {...register(
                `modules[${moduleIndex}].lessons[${lessonIndex}].type`,
                { required: true }
              )}
            >
              <option value='registered'>Registered</option>
              <option value='live'>Live</option>
            </select>

            {isRegisteredLesson && (
              <>
                <label>Video URL</label>
                <input
                  type='text'
                  className='form-control'
                  {...register(
                    `modules[${moduleIndex}].lessons[${lessonIndex}].video_url`,
                    { required: true }
                  )}
                  placeholder='Enter video URL'
                />
              </>
            )}

            {isLiveLesson && (
              <>
                <label>Live Start Time</label>
                <input
                  type='datetime-local'
                  className='form-control'
                  {...register(
                    `modules[${moduleIndex}].lessons[${lessonIndex}].livestarttime`,
                    { required: true }
                  )}
                />

                <label>Live End Time</label>
                <input
                  type='datetime-local'
                  className='form-control'
                  {...register(
                    `modules[${moduleIndex}].lessons[${lessonIndex}].liveendtime`,
                    { required: true }
                  )}
                />

                <label>Live Meeting Link</label>
                <input
                  type='text'
                  className='form-control'
                  {...register(
                    `modules[${moduleIndex}].lessons[${lessonIndex}].liveMeetingLink`,
                    { required: true }
                  )}
                  placeholder='Enter live meeting link'
                />
              </>
            )}

            <label>Ressources</label>
            <input
              type='file'
              className='form-control'
              onChange={e => {
                const file = e.target.files[0]
                if (file) {
                  setValue(
                    `modules[${moduleIndex}].lessons[${lessonIndex}].ressources`,
                    [file]
                  )
                }
              }}
            />

            <div className='mt-2'>
              <button
                type='button'
                className='btn btn-danger'
                onClick={() => removeLesson(lessonIndex)}
              >
                Remove Lesson
              </button>

              <button
                type='button'
                className='btn btn-info ms-2'
                onClick={() =>
                  appendLesson({
                    title: '',
                    content: '',
                    duration: '',
                    position: lessonFields.length + 1,
                    type: 'registered',
                    ressources: null,
                    video_url: '',
                    livestarttime: '',
                    liveendtime: '',
                    liveMeetingLink: ''
                  })
                }
              >
                Add Lesson
              </button>
            </div>
          </div>
        )
      })}

      {!lessonFields.length && (
        <button
          type='button'
          className='btn btn-info mt-2'
          onClick={() =>
            appendLesson({
              title: '',
              content: '',
              duration: '',
              position: 1,
              type: 'registered',
              ressources: null,
              video_url: '',
              livestarttime: '',
              liveendtime: '',
              liveMeetingLink: ''
            })
          }
        >
          Add First Lesson
        </button>
      )}
    </>
  )
}

export default ModuleLessons
