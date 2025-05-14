import React, { useState, useEffect } from "react";
import { getQaInstructor } from "../../../helpers/api";

const FaqSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getQaInstructor();
        const colors = ["#A0A0A0", "#16C0A5", "#2D8EEA"];
        const faqsWithColors = data.map((faq, index) => ({
          ...faq,
          color: colors[index % colors.length],
          idString: `0${index + 1}`
        }));
        setFaqs(faqsWithColors);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleAnswer = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div className="text-center py-4">Loading FAQs...</div>;

  return (
    <section className="container faq-section">
      <div className="text-center mb-4">
        <h3 className="faq-title">Got Questions? We've Got Answers</h3>
        <p className="faq-subtitle">Everything you need to know about becoming an instructor</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq) => (
          <div key={faq.id} className="faq-item" style={{ borderColor: faq.color }}>
            <div className="faq-number-circle" style={{ backgroundColor: faq.color }}>
              {faq.idString}
            </div>
            <p className="faq-text">{faq.question}</p>
            <span
              className="faq-view"
              onClick={() => toggleAnswer(faq.id)}
              style={{ color: faq.color }}
            >
              {expandedId === faq.id ? 'Hide' : 'View'}
            </span>

            {expandedId === faq.id && (
              <div
                className="faq-answer"
                style={{
                  borderTop: `1px solid ${faq.color}`,
                  paddingTop: '15px',
                  marginTop: '15px'
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .faq-item {
          position: relative;
          padding: 20px;
          margin-bottom: 20px;
          border-left: 4px solid;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .faq-number-circle {
          position: absolute;
          left: -15px;
          top: -15px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }
        .faq-text {
          font-weight: 600;
          margin-right: 40px;
        }
        .faq-view {
          position: absolute;
          right: 20px;
          top: 20px;
          cursor: pointer;
          font-weight: 600;
        }
        .faq-answer {
          color: #555;
          line-height: 1.6;
        }
      `}</style>
    </section>
  );
};

export default FaqSection;