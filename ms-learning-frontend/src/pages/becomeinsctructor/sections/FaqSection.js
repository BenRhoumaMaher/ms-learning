import React from "react";


const FaqSection = () => {
  const faqs = [
    { id: "01", color: "#A0A0A0", question: "How long does it take to create a course?" },
    { id: "02", color: "#16C0A5", question: "How much can I earn as an instructor?" },
    { id: "03", color: "#2D8EEA", question: "What support do you provide for new instructors?" },
  ];

  return (
    <section className="container faq-section">
      <div className="text-center mb-4">
        <h3 className="faq-title">Got Questions? We’ve Got Answers</h3>
        <p className="faq-subtitle">Everything you need to know about becoming an instructor</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item" style={{ borderColor: faq.color }}>
            <div className="faq-number-circle" style={{ backgroundColor: faq.color }}>
              {faq.id}
            </div>
            <p className="faq-text">{faq.question}</p>
            <span className="faq-view">View</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
