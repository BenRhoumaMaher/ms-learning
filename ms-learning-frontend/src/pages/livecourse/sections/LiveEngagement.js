import React from "react";


const LiveEngagement = () => {
  return (
    <section className="liveeng-container d-flex justify-content-center align-items-center py-5">
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-5">
        <div className="liveeng-box d-flex flex-column align-items-center">
          <div className="liveeng-icon">
            <span className="liveeng-code-icon">&#123; &#125;</span>
          </div>
          <p className="liveeng-text mt-3">Live Coding Sandbox</p>
        </div>

        <div className="liveeng-box d-flex flex-column align-items-center">
          <div className="liveeng-trophy">
            🏆
          </div>
          <p className="liveeng-text mt-3">Engagement Points</p>
          <p className="liveeng-points">(236)</p>
        </div>
      </div>
    </section>
  );
};

export default LiveEngagement;
