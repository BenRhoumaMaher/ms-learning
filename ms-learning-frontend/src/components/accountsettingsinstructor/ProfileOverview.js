import React from 'react'

export const ProfileOverview = ({ userInfo }) => (
  <div>
    <h5 className='text-light'>Profile Overview</h5>
    <table className='table table-info table-bordered table-hover'>
      <tbody>
        {['firstName', 'lastName', 'username', 'phone', 'email', 'address'].map(
          field => (
            <tr key={field}>
              <td>{field.split(/(?=[A-Z])/).join(' ')}</td>
              <td className='text-warning'>{userInfo[field]}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
    <h5 className='text-light'>Expertise</h5>
    <p className='lead text-muted'>{userInfo.expertise}</p>
  </div>
)
