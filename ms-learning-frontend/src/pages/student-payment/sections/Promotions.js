import React from "react";

const promotions = [
  { id: 1, color: "#9CA3AF", btnColor: "#4B9CD3" },
  { id: 2, color: "#16A085", btnColor: "#258BD2" },
  { id: 3, color: "#2980B9", btnColor: "#1ABC9C" },
];

const Promotions = () => {
  return (
    <div className="container text-center mt-5 mb-5">
      <h3><strong>Promotions & Discounts</strong></h3>
      <p>Save big on your next course or subscription with these exclusive offers</p>

      <div className="promotions-container">
        {promotions.map((promo) => (
          <div key={promo.id} className="promo-card">
            <div className="promo-top">
              <h5 className="promo-title">Promo Code</h5>
            </div>

            <div
              className="promo-bottom"
              style={{ backgroundColor: promo.color }}
            >
              <p className="promo-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="expiration-text">Expiration Date</p>

              <button
                className="apply-btn"
                style={{ backgroundColor: promo.btnColor }}
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions;
