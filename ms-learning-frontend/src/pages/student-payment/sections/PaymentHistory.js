import React from "react";

const PaymentHistory = () => {
  return (
    <section className="payment-history">
      <div className="container">
        <div className="text-center mb-4">
          <h4 className="fw-bold">Your Payment History</h4>
          <p>Review your past transactions and keep track of your spending</p>
        </div>

        <div className="d-flex mb-3">
          <button className="sort-btn">Sort By</button>
        </div>

        <div className="row">
          <div className="col-md-3 d-flex">
            <div className="history-card history-gray w-100">
              <div className="history-header">
                <div className="history-number">01</div>
              </div>
              <div className="history-title">Date <br /> <strong>Amount</strong></div>
              <div className="history-content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <button className="download-btn mb-2">Download</button>
            </div>
          </div>

          <div className="col-md-3 d-flex">
            <div className="history-card history-green w-100">
              <div className="history-header">
                <div className="history-number">02</div>
              </div>
              <div className="history-title">Date <br /> <strong>Amount</strong></div>
              <div className="history-content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <button className="download-btn mb-2">Download</button>
            </div>
          </div>

          <div className="col-md-3 d-flex">
            <div className="history-card history-blue w-100">
              <div className="history-header">
                <div className="history-number">03</div>
              </div>
              <div className="history-title">Date <br /> <strong>Amount</strong></div>
              <div className="history-content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <button className="download-btn mb-2">Download</button>
            </div>
          </div>

          <div className="col-md-3 d-flex">
            <div className="history-card history-darkblue w-100">
              <div className="history-header">
                <div className="history-number">04</div>
              </div>
              <div className="history-title">Date <br /> <strong>Amount</strong></div>
              <div className="history-content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <button className="download-btn mb-2">Download</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentHistory;
