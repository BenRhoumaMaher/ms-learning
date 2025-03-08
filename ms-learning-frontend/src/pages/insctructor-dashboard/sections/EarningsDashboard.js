import React, { useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EarningsDashboard = () => {
  const barChartRef = useRef(null);
  const verticalChartRef = useRef(null);

  useEffect(() => {
    if (barChartRef.current) {
      barChartRef.current.destroy();
    }
    if (verticalChartRef.current) {
      verticalChartRef.current.destroy();
    }

    barChartRef.current = new Chart(document.getElementById("instrucear-bar-chart"), {
      type: "bar",
      data: {
        labels: ["Course A", "Course B", "Course C", "Course D", "Course E"],
        datasets: [
          {
            data: [81, 50, 61, 70, 90],
            backgroundColor: ["#2D8CFF", "#2AA9A9", "#F07F33", "#FFB800", "#E86CA8"],
            borderRadius: 5,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });

    verticalChartRef.current = new Chart(document.getElementById("instrucear-vertical-chart"), {
      type: "bar",
      data: {
        labels: ["Course X", "Course Y", "Course Z", "Course W"],
        datasets: [
          {
            label: "Students",
            data: [20, 60, 70, 30, 50],
            backgroundColor: "#3F51B5",
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });

    return () => {
      if (barChartRef.current) barChartRef.current.destroy();
      if (verticalChartRef.current) verticalChartRef.current.destroy();
    };
  }, []);

  return (
    <Container fluid className="instrucear-container">
      <h2 className="instrucear-title">Your Earnings</h2>
      <p className="instrucear-subtitle mb-5">
        Track your income and see how much you've earned from your courses
      </p>

      <Row className="instrucear-content">
        <Col md={4} className="instrucear-chart-container">
          <canvas id="instrucear-bar-chart"></canvas>
          <p className="instrucear-label instrucear-earnings">This Month’s Earnings</p>
        </Col>

        <Col md={4} className="instrucear-chart-container">
          <canvas id="instrucear-vertical-chart"></canvas>
          <p className="instrucear-label instrucear-top-courses">Top 3 Courses</p>
        </Col>

        <Col md={4} className="instrucear-calendar">
          <div className="instrucear-calendar-box">
            <p className="instrucear-calendar-date">23rd</p>
          </div>
          <p className="instrucear-label instrucear-payment">Next payment date, amount</p>
        </Col>
      </Row>
    </Container>
  );
};

export default EarningsDashboard;
