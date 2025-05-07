import React, { useState, useEffect } from "react";
import { getUserPaymentHistory } from "../../../helpers/api";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const historyCardClasses = [
  "history-gray",
  "history-green",
  "history-blue",
  "history-darkblue"
];

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const data = await getUserPaymentHistory();
        setPayments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  const getPaymentDescription = (payment) => {
    if (payment.type === 'course') {
      return `Course: ${payment.item.title}`;
    } else if (payment.type === 'subscription') {
      return `Subscription: ${payment.item.title}`;
    }
    return 'Payment';
  };

  if (loading) return <div className="container text-center">Loading payment history...</div>;
  if (error) return <div className="container text-center text-danger">Error: {error}</div>;

  return (
    <section className="payment-history">
      <div className="container">
        <div className="text-center mb-4">
          <h4 className="fw-bold">Your Payment History</h4>
          <p>Review your past transactions and keep track of your spending</p>
        </div>

        <div className="row">
          {payments.length > 0 ? (
            payments.slice(0, 4).map((payment, index) => (
              <div className="col-md-3 d-flex" key={payment.id}>
                <div className={`history-card ${historyCardClasses[index % historyCardClasses.length]} w-100`}>
                  <div className="history-header">
                    <div className="history-number">
                      {index < 9 ? `0${index + 1}` : index + 1}
                    </div>
                  </div>
                  <div className="history-title">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                    <br />
                    <strong>${payment.price}</strong>
                  </div>
                  <div className="history-content">
                    <p>{getPaymentDescription(payment)}</p>
                  </div>
                  <PDFDownloadLink
                    document={<InvoicePDF payment={payment} />}
                    fileName={`invoice_${payment.id}.pdf`}
                    className="download-btn mb-4"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                      width: '100%'
                    }}
                  >
                    {({ loading }) => (
                      loading ? 'Preparing document...' : 'Download Invoice'
                    )}
                  </PDFDownloadLink>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No payment history found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PaymentHistory;