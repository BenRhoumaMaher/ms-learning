import React from "react";


const AccountSettingsHero = () => {
  return (
    <section className="accset-hero">
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-md-6 accset-left">
            <h2 className="accset-title">Your Account, Your Way</h2>
            <p className="accset-subtitle">
              <span className="accset-highlight">Take Control</span>, Student’s Name Customize Your Learning Experience.
            </p>
            <div className="accset-buttons">
              <button className="accset-btn accset-edit-btn">Edit Profile</button>
              <button className="accset-btn accset-password-btn">Change Password</button>
            </div>
          </div>

          <div className="col-md-6 accset-right">
            <div className="accset-profile d-flex align-items-center justify-content-end">
              <div className="accset-avatar">
                < fa className="fas fa-user fa-4x text-info"></fa>
              </div>
              <div className="accset-info text-center">
                <h4 className="accset-name">Name & email</h4>
                <p className="accset-membership">Membership type (Free/Premium)</p>
                <button className="accset-btn accset-delete-btn">Delete account ?</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountSettingsHero;
