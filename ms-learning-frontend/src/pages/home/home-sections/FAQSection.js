import React, { useState, useEffect } from "react";
import { MDBAccordion, MDBAccordionItem } from "mdb-react-ui-kit";
import { getFAQs } from "../../../helpers/api";
import { useTranslation } from "react-i18next";

const FAQSection = () => {
  const { t } = useTranslation();
  const [faqData, setFaqData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await getFAQs();
        setFaqData(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        setError('Failed to load FAQs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  return (
    <section className="faq-section">
      <div className="container text-center">
        <h3 className="section-title">
          <strong>{t("Frequently Asked Questions")}</strong>
        </h3>
        <p className="section-subtitle">
          {t("Have questions? We've got answers!")}
        </p>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : faqData.length > 0 ? (
          <MDBAccordion initialActive={-1}>
            {faqData.map((item, index) => (
              <MDBAccordionItem
                collapseId={`faq-${item.id}`}
                headerTitle={item.question}
                key={item.id}
              >
                {item.answer}
              </MDBAccordionItem>
            ))}
          </MDBAccordion>
        ) : (
          <p>No FAQs available at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default FAQSection;