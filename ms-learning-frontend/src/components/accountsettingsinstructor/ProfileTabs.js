import React from 'react'

export const ProfileTabs = ({ activeTab, setActiveTab }) => (
  <ul className='nav nav-pills'>
    {['overview', 'profile', 'password'].map(tab => (
      <li key={tab} className='nav-item'>
        <button
          className={`nav-link ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      </li>
    ))}
  </ul>
)
