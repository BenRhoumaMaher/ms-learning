import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CatalogCour = () => {
  return (
    <div className="container catalogcour-section mt-5">
      <div className="catalogcour-categories d-flex flex-wrap justify-content-center gap-3">
        {[
          "Programming",
          "Design",
          "Business",
          "Data Science",
          "Cybersecurity",
          "Digital Marketing",
          "Personal Development",
          "Languages",
          "Music",
        ].map((category, index) => (
          <span key={index} className="catalogcour-category">
            {category}
          </span>
        ))}
      </div>

      <div className="text-start mt-4">
        <button className="catalogcour-sort-btn">Sort By</button>
      </div>

      <div className="row mt-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-4">
            <div className="catalogcour-course-card"></div>
          </div>
        ))}
      </div>

      <nav>
        <ul className="pagination justify-content-center">
          <li className="page-item active">
            <a className="page-link" href="#">
              1
            </a>
          </li>
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="page-item">
              <a className="page-link" href="/">
                {i + 2}
              </a>
            </li>
          ))}
          <li className="page-item disabled">
            <span className="page-link">...</span>
          </li>
          <li className="page-item">
            <a className="page-link" href="/">
              11
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="/">
              ➡
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CatalogCour;
