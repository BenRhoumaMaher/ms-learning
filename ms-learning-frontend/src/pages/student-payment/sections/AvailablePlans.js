import React, { useState, useEffect } from "react";
import { getPlans, subscribeToPlan } from "../../../helpers/api";

const AvailablePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribing, setSubscribing] = useState({});

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        setPlans(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    try {
      setSubscribing(prev => ({ ...prev, [planId]: true }));
      await subscribeToPlan(planId);
      alert('Subscription successful!');
    } catch (error) {
      alert(`Subscription failed: ${error.message}`);
    } finally {
      setSubscribing(prev => ({ ...prev, [planId]: false }));
    }
  };

  if (loading) return <div className="text-center">Loading plans...</div>;
  if (error) return <div className="text-center text-danger">Error: {error}</div>;

  const getCardClass = (index) => {
    switch (index) {
      case 0: return "plan-card plan-gray w-80";
      case 1: return "plan-card plan-green w-100";
      case 2: return "plan-card plan-blue w-100";
      default: return "plan-card plan-gray w-80";
    }
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price}/month`;
  };

  return (
    <section className="available-plans">
      <div className="container text-center">
        <h4 className="fw-bold">Available Plans</h4>
        <p className="mb-5">Stick with "free and frugal" or upgrade to "premium and powerful"</p>

        <div className="row">
          {plans.map((plan, index) => (
            <div className="col-md-4 d-flex" key={plan.id}>
              <div className={getCardClass(index)}>
                <div className="plan-number">0{index + 1}</div>
                <div className="plan-title">
                  {plan.name}
                  <div>
                    <span className="plan-price fw-bold text-warning">{formatPrice(plan.price)}</span>
                  </div>
                </div>
                <div className="plan-content">
                  <p className="features text-center text-white">
                    {plan.features}
                  </p>
                </div>
                <div>
                  <button
                    className={`btn mt-3 ${index === 1 ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing[plan.id]}
                  >
                    {subscribing[plan.id] ? 'Subscribing...' : 'Subscribe Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvailablePlans;