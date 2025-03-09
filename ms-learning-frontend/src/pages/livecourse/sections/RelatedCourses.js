import React from "react";

const RelatedCourses = () => {
  const courses = [
    { number: "01", title: "Lorem ipsum", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", color: "#A0A7A7" },
    { number: "02", title: "Lorem ipsum", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", color: "#20C5A5" },
    { number: "03", title: "Lorem ipsum", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", color: "#3498DB" },
    { number: "04", title: "Lorem ipsum", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", color: "#2C93C8" }
  ];

  return (
    <section className="liveeng-related py-5">
      <h3 className="fw-bold mb-4 ms-5">Related Courses</h3>
      <div className="row ms-2 me-2">
        {courses.map((course, index) => (
          <div className="col-md-3" key={index}>
            <div className="liveeng-course-card" style={{ backgroundColor: course.color }}>
              <div className="liveeng-circle">
                <span>{course.number}</span>
              </div>
              <div className="liveeng-course-content">
                <h5 className="fw-bold text-white">{course.title}</h5>
                <p className="text-white">{course.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedCourses;
