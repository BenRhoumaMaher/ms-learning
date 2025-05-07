import React, { useState, useEffect } from 'react';
import { getCurrentSubscription } from '../../../helpers/api';

const PaymentHero = ({ availablePlansRef }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollToPlans = () => {
    availablePlansRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getCurrentSubscription();
        setSubscription(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) return <div className="payment-hero">Loading subscription information...</div>;
  if (error) return <div className="payment-hero">Error: {error}</div>;

  return (
    <section className="payment-hero">
      <div className="container d-flex justify-content-between align-items-start">

        <div className="payment-info">
          <h4 className="fw-bold">Your Payment Hub</h4>
          <p>Manage your subscriptions, view payment history, and explore new courses all in one place</p>
        </div>

        {subscription?.plan ? (
          <div className="subscription-status text-start">
            <h5 className="fw-bold">
              You're on the <span className="text-danger">{subscription.plan}</span>
            </h5>
            <p>
              {subscription.status === 'active'
                ? `Your plan is active, next billing date: ${subscription.endDate}`
                : 'Your subscription is not currently active'}
            </p>
            <button onClick={scrollToPlans} className="text-primary btn btn-link p-0">
              Change subscription
            </button>
          </div>
        ) : (
          <div className="subscription-status text-start">
            <h5 className="fw-bold">No active subscription</h5>
            <p>You don't have an active subscription</p>
            <button onClick={scrollToPlans} className="text-primary btn btn-link p-0">
              Explore our plans
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default PaymentHero;