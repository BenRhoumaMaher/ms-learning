import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useNavigate, useParams } from "react-router-dom";
import { getLessonInfo, getLessonQuizScores } from "../../../helpers/api";

Chart.register(...registerables);

const AssignmentsSection = () => {
  const chartRef = useRef(null);
  const navigate = useNavigate();
  const { id: lessonId } = useParams();
  const [quizData, setQuizData] = React.useState(null);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userId = user?.user_id;

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
    const fetchScoresAndRenderChart = async () => {
      try {
        const scores = await getLessonQuizScores(lessonId);

        if (!scores || scores.length === 0) return;

        const userScores = scores
          .filter(score => score.user_id === userId)
          .map(score => score.score);

        const userHighestScore = userScores.length > 0 ? Math.max(...userScores) : 0;

        const othersScores = scores
          .filter(score => score.user_id !== userId)
          .slice(-9)
          .map(score => score.score);

        const chartLabels = ["You", ...Array(9).fill().map((_, i) => `User ${i + 1}`)];
        const chartData = [userHighestScore, ...othersScores];

        const ctx = document.getElementById("rankChart").getContext("2d");
        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: chartLabels,
            datasets: [
              {
                label: "Quiz Scores",
                backgroundColor: [
                  "#dc3545",
                  ...Array(9).fill("#6c757d")
                ],
                data: chartData,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                suggestedMax: 10,
              },
            },
          },
        });
      } catch (error) {
        console.error("Error fetching quiz scores:", error);
      }
    };

    fetchScoresAndRenderChart();
  }, [lessonId, userId]);

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
