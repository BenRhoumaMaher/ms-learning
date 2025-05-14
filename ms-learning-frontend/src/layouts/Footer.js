import React, { useEffect, useState } from "react";
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { getCategories } from '../helpers/api';
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const isAuthenticated =
    localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = isAuthenticated
    ? JSON.parse(atob(isAuthenticated.split('.')[1]))
    : null;
  const userId = user?.user_id || null;

  const links = [
    { label: t('explore'), to: '/' },
    { label: t('notifications'), to: '/notifications' },
    { label: t('settings'), to: '/account-settings' },
    { label: t('profile'), to: `/msconnect/profile/${userId}` },
  ];
  return (
    <MDBFooter bgColor="light" className="text-center text-lg-start text-muted mt-5">
      <section className="d-flex justify-content-center justify-content-lg-between p-4">
        <div className="me-5 d-none d-lg-block">
          <span>{t("Welcome Aboard on Our Platform")}</span>
        </div>
        <div>
          <a href="/https://www.linkedin.com/in/maherbenrhouma/" className="me-4 text-reset">
            <i className='bi bi-linkedin'></i>
          </a>
          <a href="*" className="me-4 text-reset">
            <i className='bi bi-twitter'></i>
          </a>
          <a href="/instagram.com/benrhoumaamaher/" className="me-4 text-reset">
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
                MS-LEARNING
              </h6>
              <p>
                {t("Here You can Learn Smarter, Not Harder. Anytime, Anywhere. We are here to help you Grow Your Career.")}
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">{t("Products")}</h6>
              {categories.map((category, index) => (
                <p key={index}>
                  <Link to={''} className="text-reset">
                    {category.name}
                  </Link>
                </p>
              ))}
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">{t("Useful Links")}</h6>
              {links.map((link, index) => (
                <p><Link to={link.to} title="" className="text-reset">{link.label}</Link></p>
              ))}
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">{t("Contact")}</h6>
              <p><MDBIcon icon="home" className="me-3" /> {t("Tunisia")}</p>
              <p><MDBIcon icon="envelope" className="me-3" /> maherbenrhoumaa@gmail.com</p>
              <p><MDBIcon icon="phone" className="me-3" /> +216 00 000 000</p>
              <p><MDBIcon icon="print" className="me-3" /> +216 00 000 000</p>
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
