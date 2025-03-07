import React from "react";

const courses = [
  { id: 1, color: "#9CA3AF", btnColor: "#4B9CD3" },
  { id: 2, color: "#16A085", btnColor: "#258BD2" },
  { id: 3, color: "#2980B9", btnColor: "#1ABC9C" },
  { id: 4, color: "#2C92A0", btnColor: "#A3D300" },
];

const CoursePurchases = () => {
  return (
    <div className="container text-center mt-5">
      <h3><strong>Your Course Purchases</strong></h3>
      <p>Explore the courses you’ve invested in and continue your learning journey</p>

      <div className="course-container">
        {courses.map((course) => (
          <div key={course.id} className="course-cardd" style={{ backgroundColor: course.color }}>
            <div className="badge-container">
              <div className="badge-circle" style={{ color: course.color }}>
                {course.id < 10 ? `0${course.id}` : course.id}
              </div>
              <div className="badge-pointer"></div>
            </div>

            <h5 className="course-title">Course Title</h5>
            <p className="course-info">
              <strong>Purchase Date</strong>
              <br />
              Price
            </p>

            <button className="access-btn" style={{ backgroundColor: course.btnColor }}>
              access the course
            </button>
          </div>
        ))}
      </div>

      <button className="show-more-btn">Show more</button>
    </div>
  );
};

export default CoursePurchases;
