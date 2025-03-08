import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const PasswordSecurity = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <section className="container text-center my-5">
      <h2 className="fw-bold">Password & Security</h2>
      <p className="text-danger fw-semibold">
        Keep your account safe and secure with a strong password
      </p>

      <div className="settinpass-container mx-auto p-4">
        <div className="mb-3 text-start">
          <label className="settinpass-label">Current Password</label>
          <div className="settinpass-input-group">
            <i className="bi bi-lock settinpass-icon"></i>
            <input
              type={showPassword.current ? "text" : "password"}
              className="form-control settinpass-input"
              placeholder="Enter current password"
            />
            <i 
              className={`bi ${showPassword.current ? "bi-eye-slash" : "bi-eye"} settinpass-eye`}
              onClick={() => togglePassword("current")}
            ></i>
          </div>
        </div>

        <div className="mb-3 text-start">
          <label className="settinpass-label">New Password</label>
          <div className="settinpass-input-group">
            <i className="bi bi-lock settinpass-icon"></i>
            <input
              type={showPassword.new ? "text" : "password"}
              className="form-control settinpass-input"
              placeholder="Enter new password"
            />
            <i 
              className={`bi ${showPassword.new ? "bi-eye-slash" : "bi-eye"} settinpass-eye`}
              onClick={() => togglePassword("new")}
            ></i>
          </div>
        </div>

        <div className="mb-4 text-start">
          <label className="settinpass-label">Confirm New Password</label>
          <div className="settinpass-input-group">
            <i className="bi bi-lock settinpass-icon"></i>
            <input
              type={showPassword.confirm ? "text" : "password"}
              className="form-control settinpass-input"
              placeholder="Confirm new password"
            />
            <i 
              className={`bi ${showPassword.confirm ? "bi-eye-slash" : "bi-eye"} settinpass-eye`}
              onClick={() => togglePassword("confirm")}
            ></i>
          </div>
        </div>

        <button className="btn settinpass-btn">Save Changes</button>
      </div>
    </section>
  );
};

export default PasswordSecurity;
