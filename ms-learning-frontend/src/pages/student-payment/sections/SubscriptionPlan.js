import React from "react";

const SubscriptionPlan = () => {
  return (
    <section className="subscription-plan">
      <div className="container text-center">
        <h4 className="fw-bold">Your Subscription Plan</h4>
        <p>Get the most out of your learning experience with the right plan</p>

        <div className="row g-4">
          <div className="col-md-3 d-flex">
            <div className="billing-info w-100">
              <div className="billing-header text-white align-content-center">Billing Information</div>
              <div className="billing-body">
                <p>Next billing date</p>
                <p>Amount</p>
              </div>
            </div>
          </div>

          <div className="col-md-5 d-flex">
            <div className="benefits-container p-3 w-100">
              <ul className="benefits-list p-0">
                <li className="benefit-item border border-info">
                  <span className="number border border-info text-info">01</span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </li>
                <li className="benefit-item border border-green">
                  <span className="number border border-success text-success">02</span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </li>
                <li className="benefit-item border border-danger">
                  <span className="number border border-danger text-danger">03</span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </li>
              </ul>
              <p className="text-danger mt-2 text-center">
                Benefits included in the current plan
              </p>
            </div>
          </div>

          <div className="col-md-3 d-flex flex-column">
            <div className="image-buttons text-center">
              <button className="btn btn-primary me-2">Downgrade</button>
              <button className="btn btn-success">Upgrade</button>
            </div>
            <div className="image-section">
              <img
                src="placeholder-image.png"
                alt="Subscription Plan"
                className="img-fluid"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlan;
