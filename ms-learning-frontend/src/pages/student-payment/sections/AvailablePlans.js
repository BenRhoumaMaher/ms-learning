import React from "react";

const AvailablePlans = () => {
  return (
    <section className="available-plans">
      <div className="container text-center">
        <h4 className="fw-bold">Available Plans</h4>
        <p className="mb-5">Stick with "free and frugal" or upgrade to "premium and powerful"</p>

        <div className="row">
          <div className="col-md-4 d-flex">
            <div className="plan-card plan-gray w-80">
              <div className="plan-number">01</div>
              <div className="plan-title">Free Plan</div>
              <div className="plan-content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 d-flex">
            <div className="plan-card plan-green w-100">
              <div className="plan-number">02</div>
              <div className="plan-title">Premium Plan</div>
              <div className="plan-content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 d-flex">
            <div className="plan-card plan-blue w-100">
              <div className="plan-number">03</div>
              <div className="plan-title">Platinum Plan</div>
              <div className="plan-content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailablePlans;
