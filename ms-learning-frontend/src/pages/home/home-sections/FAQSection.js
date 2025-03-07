import React from "react";
import { MDBAccordion, MDBAccordionItem } from "mdb-react-ui-kit";

const faqData = [
  {
    id: "faq1",
    question: "Question #1",
    answer:
      "This is the first item's accordion body. It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element.",
  },
  {
    id: "faq2",
    question: "Question #2",
    answer:
      "This is the second item's accordion body. It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.",
  },
  {
    id: "faq3",
    question: "Question #3",
    answer:
      "This is the third item's accordion body. It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.",
  },
];

const FAQSection = () => {
  return (
    <section className="faq-section">
      <div className="container text-center">
        <h3 className="section-title">
          <strong>Frequently Asked Questions</strong>
        </h3>
        <p className="section-subtitle">
          Have questions? We've got answers!
        </p>

        <MDBAccordion initialActive={-1}>
          {faqData.map((item, index) => (
            <MDBAccordionItem collapseId={item.id} headerTitle={item.question} key={index}>
              {item.answer}
            </MDBAccordionItem>
          ))}
        </MDBAccordion>
      </div>
    </section>
  );
};

export default FAQSection;
