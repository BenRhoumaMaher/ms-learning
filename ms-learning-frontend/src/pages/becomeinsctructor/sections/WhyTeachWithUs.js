import React from "react";


const WhyTeachWithUs = () => {
  return (
    <section className="container becoinstr-why-teach text-center">
      <h2 className="fw-bold">Why Teach with Us</h2>
      <p className="becoinstr-subtitle">
        Discover the benefits of joining our platform and making an impact
      </p>

      <div className="row justify-content-center">
        {[
          { title: "Global Reach", text: "Teach students from around the world", color: "#979FA3", number: "01" },
          { title: "Flexible Schedule", text: "Create courses on your own time", color: "#16C0A5", number: "02" },
          { title: "Earn Income", text: "Get paid for sharing your expertise", color: "#279FD9", number: "03" },
          { title: "Community Support", text: "Join a network of passionate educators", color: "#1B8BB5", number: "04" },
        ].map((feature, index) => (
          <div key={index} className="col-6 col-md-3 d-flex justify-content-center">
            <div className="becoinstr-feature" style={{ backgroundColor: feature.color }}>
              <h5 className="fw-bold">{feature.title}</h5>
              <p>{feature.text}</p>
              <div className="becoinstr-number">{feature.number}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="becoinstr-btn mt-4">Join Now</button>
    </section>
  );
};

export default WhyTeachWithUs;
