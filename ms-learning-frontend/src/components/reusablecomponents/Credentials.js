import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export default function Credentials() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <>
      <div className='mb-3'>
        <Controller
          control={control}
          name='email'
          defaultValue=""
          render={({ field }) => (
            <>
              <input
                {...field}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder='Email'
              />
              {errors.email && (
                <div className='invalid-feedback'>{errors.email.message}</div>
              )}
            </>
          )}
        />
      </div>

      <div className='mb-3'>
        <Controller
          control={control}
          name='password'
          render={({ field }) => (
            <>
              <input
                {...field}
                type='password'
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder='Password'
              />
              {errors.password && (
                <div className='invalid-feedback'>{errors.password.message}</div>
              )}
            </>
          )}
        />
      </div>
    </>
  );
}
