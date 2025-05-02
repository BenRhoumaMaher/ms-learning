import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useNavigate, useParams } from "react-router-dom";
import { getLessonInfo } from "../../../helpers/api";

Chart.register(...registerables);

const AssignmentsSection = () => {
  const chartRef = useRef(null);
  const navigate = useNavigate();
  const { id: lessonId } = useParams();
  const [quizData, setQuizData] = React.useState(null);

  useEffect(() => {
    const fetchLessonInfo = async () => {
      try {
        const data = await getLessonInfo(lessonId);
        setQuizData(data.course.quiz);
      } catch (error) {
        console.error("Error fetching lesson info:", error);
      }
    };

    fetchLessonInfo();
  }, [lessonId]);

  const handleStartQuiz = () => {
    if (quizData) {
      navigate(`/quiz/${lessonId}`);
    }
  };

  useEffect(() => {
    const ctx = document.getElementById("rankChart").getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["A", "B", "C", "D", "E", "F", "G"],
        datasets: [
          { label: "Low", backgroundColor: "blue", data: [20, 40, 60, 10, 30, 50, 70] },
          { label: "Medium", backgroundColor: "red", data: [30, 50, 40, 20, 60, 30, 40] },
          { label: "High", backgroundColor: "gold", data: [60, 80, 70, 90, 70, 60, 90] },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <section className="container mt-5">
      <div className="text-center">
        <h3 className="fw-bold">Assignments & Quizzes</h3>
        <p className="text-muted">Test your knowledge and apply what you've learned</p>
      </div>

      <div className="row align-items-center mt-4">
        <div className="col-md-6 d-flex justify-content-center">
          <div className="assignments-chart-container">
            <canvas id="rankChart"></canvas>
            <p className="text-danger fw-bold text-center mt-2">Rank</p>
          </div>
        </div>

        <div className="col-md-6 d-flex justify-content-center">
          {quizData && (
            <div className="assignments-quiz-card">
              <h5 className="text-danger fw-bold">{quizData.title}</h5>
              <p className="fw-bold">Duration: {quizData.time_limit} minutes</p>
              <p className="fw-bold">Passing Score: {quizData.passing_score}%</p>
              <button
                className="btn assignments-start-btn"
                onClick={handleStartQuiz}
              >
                Start
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AssignmentsSection;