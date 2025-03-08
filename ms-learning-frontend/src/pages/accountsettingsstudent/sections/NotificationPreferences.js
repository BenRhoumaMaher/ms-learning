import React, { useState } from "react";

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    courseUpdates: true,
    quizReminders: false,
    liveCourseAlerts: true,
    email: false,
    inAppNotifications: true,
  });

  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="notification-container">
      <h3 className="notification-title">Notification Preferences</h3>
      <p className="notification-subtitle text-danger">
        Choose how and when you want to be notified
      </p>

      <div className="notification-box">
        <h5 className="notification-header">Notification Types</h5>

        {Object.keys(preferences).map((key) => (
          <div className="notification-item" key={key}>
            <span onClick={() => togglePreference(key)} className="toggle-icon">
              <i
                className={`fas ${
                  preferences[key] ? "fa-toggle-on text-success" : "fa-toggle-off text-secondary"
                } fa-2x`}
              ></i>
            </span>
            <span className="notification-label">{key.replace(/([A-Z])/g, " $1")}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-success save-changes">Save Changes</button>
    </div>
  );
};

export default NotificationPreferences;
