import React, { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import Chart from "chart.js/auto";

const CompareResults = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      chartRef.current.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["A", "B", "C", "D", "E", "F", "G", "H"],
          datasets: [
            {
              label: "Your Score",
              data: [20, 30, 40, 50, 20, 60, 70, 80],
              backgroundColor: "#2c51d1", // Blue bars
            },
            {
              label: "Average Score",
              data: [50, 40, 30, 40, 30, 50, 40, 45],
              backgroundColor: "#ff6f61", // Red bars
            },
            {
              label: "Highest Score",
              data: [70, 80, 60, 90, 60, 70, 85, 90],
              backgroundColor: "#ffcc33", // Yellow bars
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }
  }, []);

  return (
    <Container className="compare-results text-center">
      <h3 className="fw-bold text-start mb-5">Compare your results with other students</h3>

      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>

      <p className="ranking-text">You’re 12th out of 100</p>
    </Container>
  );
};

export default CompareResults;
