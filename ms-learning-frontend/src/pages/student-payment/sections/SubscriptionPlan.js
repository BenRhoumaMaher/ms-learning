import React, { useState, useEffect } from "react";
import { getCurrentSubscription } from "../../../helpers/api";

const SubscriptionPlan = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getCurrentSubscription();
        setSubscription(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) return <div className="text-center">Loading subscription information...</div>;
  if (error) return <div className="text-center text-danger">Error: {error}</div>;
  if (!subscription) return <div className="text-center">No subscription found</div>;

  return (
    <section className="subscription-plan">
      <div className="container text-center">
        <h4 className="fw-bold">Your Subscription Plan</h4>
        <p>Get the most out of your learning experience with the right plan</p>

        <div className="row g-4">
          <div className="col-md-3 d-flex">
            <div className="billing-info w-100">
              <div className="billing-header text-white align-content-center">
                Billing Information
              </div>
              <div className="billing-body">
                <p>Next billing date: <strong className="text-black">{subscription.endDate}</strong></p>
                <p>Amount: <strong className="text-black">${subscription.price}</strong></p>
                <p>Status: <span className={subscription.status === 'active' ? 'text-success' : 'text-warning'}>
                  {subscription.status}
                </span></p>
              </div>
            </div>
          </div>

          <div className="col-md-5 d-flex">
            <div className="benefits-container p-3 w-100">
              <ul className="benefits-list p-0">
                {subscription.features.map((feature, index) => {
                  let borderClass = "";
                  let textClass = "";
                  
                  switch (index) {
                    case 0:
                      borderClass = "border-info";
                      textClass = "text-info";
                      break;
                    case 1:
                      borderClass = "border-success";
                      textClass = "text-success";
                      break;
                    case 2:
                      borderClass = "border-danger";
                      textClass = "text-danger";
                      break;
                    default:
                      borderClass = "border-secondary";
                      textClass = "text-secondary";
                  }

                  return (
                    <li key={index} className={`benefit-item border ${borderClass}`}>
                      <span className={`number border ${textClass}`}>0{index + 1}</span>
                      {feature}
                    </li>
                  );
                })}
              </ul>
              <p className="text-danger mt-2 text-center">
                Benefits included in the {subscription.plan}
              </p>
            </div>
          </div>

          <div className="col-md-3 d-flex flex-column">
            <div className="image-section">
              <h5 className="fw-bold text-black">{subscription.plan}</h5>
              <div className="mt-3">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlan;