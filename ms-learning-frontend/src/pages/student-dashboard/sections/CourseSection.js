import React from 'react';

const CourseSection = () => {
  const courses = [
    { id: 1, title: "Learn Python", progress: 88, nextLesson: "Advanced Python Functions" },
    { id: 2, title: "Learn Python", progress: 70, nextLesson: "Advanced Python Functions" },
    { id: 3, title: "Learn Python", progress: 52, nextLesson: "Advanced Python Functions" },
  ];

  return (
    <div className="container text-center my-5">
      <h2><strong>Your Epic Learning Adventure</strong></h2>
      <p>Level up, and prove you’re smarter than your WiFi router</p>

      <div className="row mt-4">
        {courses.map((course) => (
          <div key={course.id} className="col-md-4">
            <div className="course-card shadow-sm">
            <div className="col-md-6 d-flex justify-content-center bg-info p-5 w-100">
                <i className="bi bi-image" style={{ fontSize: "4rem", color: "white" }}></i>
              </div>
              <h5 className="mt-3 text-danger">{course.title}</h5>
              <div className="progress mx-4 h-100">
                <div className="progress-bar bg-success" style={{ width: `${course.progress}%` }}>
                  {course.progress}%
                </div>
              </div>
              <p className="mt-2">Next lesson: {course.nextLesson}</p>
              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-view px-4">View</button>
                {course.progress < 100 && <button className="btn btn-join px-4">Join live</button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className="page-item active"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="/">2</a></li>
          <li className="page-item"><a className="page-link" href="/">3</a></li>
          <li className="page-item"><a className="page-link" href="/">4</a></li>
          <li className="page-item"><a className="page-link" href="/">5</a></li>
          <li className="page-item disabled"><a className="page-link" href="#">...</a></li>
          <li className="page-item"><a className="page-link" href="/">11</a></li>
          <li className="page-item"><a className="page-link" href="/">›</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default CourseSection;
