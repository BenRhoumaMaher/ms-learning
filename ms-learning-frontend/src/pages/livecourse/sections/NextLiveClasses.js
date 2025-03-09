import React from "react";


const NextLiveClasses = () => {
  const classes = [
    { name: "name", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", color: "#A0A7A7" },
    { name: "name", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", color: "#20C5A5" },
    { name: "name", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", color: "#3498DB" },
    { name: "name", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", color: "#2C93C8" }
  ];

  return (
    <section className="liveeng-classes-container py-5">
      <h3 className="fw-bold mb-4 ms-5">Next Live Classes</h3>
      <div className="row">
        {classes.map((cls, index) => (
          <div className="col-md-3 carlive" key={index}>
            <div className="liveeng-class-card" style={{ backgroundColor: cls.color }}>
              <div className="liveeng-arrow">
                <p className="liveeng-name">{cls.name}</p>
              </div>
              <div className="liveeng-class-content">
                <h5 className="fw-bold text-white">Lorem ipsum</h5>
                <p className="text-white">{cls.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NextLiveClasses;
