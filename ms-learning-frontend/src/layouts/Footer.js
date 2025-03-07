import React from "react";
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from "mdb-react-ui-kit";

const Footer = () => {
  return (
    <MDBFooter bgColor="light" className="text-center text-lg-start text-muted mt-5">
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Get connected with us on social networks:</span>
        </div>
        <div>
          <a href="/" className="me-4 text-reset">
          <i className='bi bi-linkedin'></i>
          </a>
          <a href="*" className="me-4 text-reset">
          <i className='bi bi-twitter'></i>
          </a>
          <a href="*" className="me-4 text-reset">
          <i className='bi bi-instagram'></i>
          </a>
        </div>
      </section>

      <section>
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <MDBIcon icon="gem" className="me-3" />
                Company Name
              </h6>
              <p>
                Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet.
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Products</h6>
              <p><a href="/" className="text-reset">Angular</a></p>
              <p><a href="/" className="text-reset">React</a></p>
              <p><a href="/" className="text-reset">Vue</a></p>
              <p><a href="/" className="text-reset">Laravel</a></p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Useful Links</h6>
              <p><a href="/" className="text-reset">Pricing</a></p>
              <p><a href="/" className="text-reset">Settings</a></p>
              <p><a href="/" className="text-reset">Orders</a></p>
              <p><a href="/" className="text-reset">Help</a></p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p><MDBIcon icon="home" className="me-3" /> New York, NY 10012, US</p>
              <p><MDBIcon icon="envelope" className="me-3" /> info@example.com</p>
              <p><MDBIcon icon="phone" className="me-3" /> +01 234 567 88</p>
              <p><MDBIcon icon="print" className="me-3" /> +01 234 567 89</p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className="text-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
        © {new Date().getFullYear()} Copyright:
        <a className="text-reset fw-bold" href="/">MS-LEARNING</a>
      </div>
    </MDBFooter>
  );
};

export default Footer;
