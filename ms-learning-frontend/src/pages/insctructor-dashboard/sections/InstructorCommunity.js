import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const InsctructorCommunity = () => {
  return (
    <div className="container text-center insctrucomm-container">
      <h2 className="insctrucomm-title">Community & Discussions</h2>
      <p className="insctrucomm-subtitle mb-5">
        Connect with other instructors and get the support you need
      </p>

      <div className="row justify-content-center align-items-center">
        <div className="col-md-5 text-center">
          <div className="insctrucomm-discussion-boxes">
            <div className="insctrucomm-discussion-box"></div>
            <div className="insctrucomm-discussion-box"></div>
            <div className="insctrucomm-discussion-box"></div>
            <div className="insctrucomm-discussion-box"></div>
          </div>
          <p className="insctrucomm-discussion-text">
            Active Discussion Topics in Your Courses
          </p>
        </div>

        <div className="col-md-5 text-center">
          <div className="insctrucomm-forum-icon">
            <span className="insctrucomm-chat-symbol">💬</span>
          </div>
          <p className="insctrucomm-forum-text">Instructor Only Forum</p>
        </div>
      </div>
    </div>
  );
};

export default InsctructorCommunity;
