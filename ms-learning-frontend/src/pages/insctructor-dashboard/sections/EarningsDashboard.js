import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { getInstructorCourses } from "../../../helpers/api";
import { useTranslation } from "react-i18next";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EarningsDashboard = () => {
  const { t } = useTranslation();
  const barChartRef = useRef(null);
  const verticalChartRef = useRef(null);
  const [coursesData, setCoursesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const user = JSON.parse(atob(token.split('.')[1]));
        const userId = user?.user_id;

        if (!userId) throw new Error('User ID not found in token');

        const data = await getInstructorCourses(userId);
        setCoursesData(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!coursesData || !coursesData.courses) return;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyCourses = coursesData.courses
      .filter(course => {
        const courseDate = new Date(course.created_at);
        return (
          courseDate.getMonth() === currentMonth &&
          courseDate.getFullYear() === currentYear &&
          course.students?.length > 0
        );
      })
      .sort((a, b) => b.students.length - a.students.length)
      .slice(0, 5);

    const allTimeCourses = [...coursesData.courses]
      .filter(course => course.students?.length > 0)
      .sort((a, b) => b.students.length - a.students.length)
      .slice(0, 3);

    if (barChartRef.current) barChartRef.current.destroy();
    if (verticalChartRef.current) verticalChartRef.current.destroy();

    if (monthlyCourses.length > 0) {
      barChartRef.current = new Chart(document.getElementById("instrucear-bar-chart"), {
        type: "bar",
        data: {
          labels: monthlyCourses.map(course => course.title),
          datasets: [
            {
              data: monthlyCourses.map(course => course.students.length),
              backgroundColor: ["#2D8CFF", "#2AA9A9", "#F07F33", "#FFB800", "#E86CA8"],
              borderRadius: 5,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.parsed.x} enrollments`;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Number of Enrollments'
              }
            }
          }
        },
      });
    }

    if (allTimeCourses.length > 0) {
      verticalChartRef.current = new Chart(document.getElementById("instrucear-vertical-chart"), {
        type: "bar",
        data: {
          labels: allTimeCourses.map(course => course.title),
          datasets: [
            {
              label: "Students",
              data: allTimeCourses.map(course => course.students.length),
              backgroundColor: "#3F51B5",
              borderRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.parsed.y} enrollments`;
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Number of Enrollments'
              }
            }
          }
        },
      });
    }

    return () => {
      if (barChartRef.current) barChartRef.current.destroy();
      if (verticalChartRef.current) verticalChartRef.current.destroy();
    };
  }, [coursesData]);

  if (loading) return (
    <Container fluid className="instrucear-container">
      <div className="text-center py-5">Loading course data...</div>
    </Container>
  );

  if (error) return (
    <Container fluid className="instrucear-container">
      <div className="text-center py-5 text-danger">
        Error loading dashboard: {error}
        <div className="mt-3">
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            {t('Try Again')}
          </button>
        </div>
      </div>
    </Container>
  );

  if (!coursesData?.courses || coursesData.courses.length === 0) return (
    <Container fluid className="instrucear-container">
      <div className="text-center py-5">
        {t('No courses found. Create your first course to see performance data!')}
      </div>
    </Container>
  );

  return (
    <Container fluid className="instrucear-container">
      <h2 className="instrucear-title">{t('Your Achievements')}</h2>
      <p className="instrucear-subtitle mb-5">
        {t("Track your success and see how much you've evolved from your courses")}
      </p>

      <Row className="instrucear-content">
        <Col md={6} className="instrucear-chart-container">
          <canvas id="instrucear-bar-chart"></canvas>
          <p className="instrucear-label instrucear-earnings">{t("This Month's Top Courses")}</p>
        </Col>

        <Col md={6} className="instrucear-chart-container">
          <canvas id="instrucear-vertical-chart"></canvas>
          <p className="instrucear-label instrucear-top-courses">{t('Top 3 Courses')}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default EarningsDashboard;