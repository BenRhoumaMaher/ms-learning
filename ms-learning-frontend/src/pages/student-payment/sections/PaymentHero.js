import React from 'react';

const PaymentHero = () => {
  return (
    <section className="payment-hero">
      <div className="container d-flex justify-content-between align-items-start">
        
        <div className="payment-info">
          <h4 className="fw-bold">Your Payment Hub</h4>
          <p>Manage your subscriptions, view payment history, and explore new courses all in one place</p>
        </div>

        <div className="subscription-status text-start">
          <h5 className="fw-bold">
            You're on the <span className="text-danger">Premium Plan</span>
          </h5>
          <p>You're on the Premium Plan, next billing date: 12/08/2025</p>
          <a href="/" className="text-primary">upgrade to a platinum plan</a>
        </div>

      </div>
    </section>
  );
};

export default PaymentHero;
