import React from "react";

const CommunitySpace = () => {
  return (
    <section className="liveeng-community">
      <div className="container">
        <div className="row g-0 align-items-center liveeng-community-box">
          <div className="col-md-4 liveeng-image-box">
            <div className="liveeng-placeholder">
              <i className="bi bi-image"></i> {/* Bootstrap Icon */}
            </div>
          </div>

          <div className="col-md-8 liveeng-text-box">
            <h5 className="fw-bold">Join our community Space</h5>
            <p className="liveeng-highlight">MS-CONNECT</p>
            <button className="btn liveeng-join-btn w-25">Join</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySpace;
