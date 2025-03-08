import React from "react";


const BudgetFriendly = () => {
  return (
    <div className="container my-5">
      <h3 className="text-dark fw-bold">
        Learn for Free: <span className="text-danger">Budget-Friendly Picks</span>
      </h3>
      <p className="text-success">High-quality courses <i>without spending a dime</i></p>

      <div className="row">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="col-md-4">
            <div className="budgetfriendly-card">
              <div className="budgetfriendly-image-placeholder"></div>
              <div className="budgetfriendly-content">
                <h5 className="text-danger">Course name</h5>
                <p className="text-secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="text-success">Instructor name</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-3">
        <button className="btn budgetfriendly-showmore-btn mb-5">Show more</button>
      </div>
    </div>
  );
};

export default BudgetFriendly;
