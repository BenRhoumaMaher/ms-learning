import React, { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import Chart from "chart.js/auto";

const CompareResults = ({ averageScore, highestScore, totalAttempts, ranking, userScore }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && userScore !== undefined && averageScore !== undefined && highestScore !== undefined) {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["You", "Average", "Top Score"],
          datasets: [
            {
              label: "Scores",
              data: [userScore, averageScore, highestScore],
              backgroundColor: ["#2c51d1", "#ff6f61", "#ffcc33"]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [userScore, averageScore, highestScore]);

  return (
    <Container className="compare-results text-center mt-5">
      <h3 className="fw-bold text-start mb-4">
        Compare your results with other students
      </h3>

      <div className="chart-container" style={{ height: "400px" }}>
        <canvas ref={chartRef}></canvas>
      </div>

      {ranking && (
        <p className="ranking-text mt-3">
          You’re <strong>{ranking.position}</strong> out of <strong>{ranking.total}</strong>
        </p>
      )}
    </Container>
  );
};

export default CompareResults;
