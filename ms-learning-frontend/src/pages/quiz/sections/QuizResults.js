import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useQuiz } from "./QuizContext";
import ReactConfetti from "react-confetti";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Certificate from "./Certificate";
import { saveQuizScore, getQuizComparisonData } from "../../../helpers/api";
import CompareResults from "./CompareResults";

const QuizResults = () => {
  const { quizFinished, questions, answers, score, courseTitle } = useQuiz();
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const user = JSON.parse(atob(token.split(".")[1]));
    const userId = user?.user_id;
    const quizId = questions?.[0]?.quiz?.id || questions?.[0]?.quizId || null;
    const passingScore = questions.length * 0.7;

    const submitScoreOnce = async () => {
      try {
        if (score >= passingScore) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 8000);
        }

        console.log("Saving score with:", {
          userId,
          quizId,
          score,
          totalQuestions: questions.length
        });

        if (!comparisonData) {
          await saveQuizScore(userId, quizId, score, questions.length);
          const data = await getQuizComparisonData(quizId, userId, score, questions.length);
          setComparisonData(data);
        }
      } catch (err) {
        console.error("Error saving score or fetching comparison data", err);
      }
    };

    if (quizFinished && questions.length > 0) {
      submitScoreOnce();
    }
  }, [quizFinished, questions, score]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!quizFinished) return null;

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const passingScore = questions.length * 0.7;
  const passed = score >= passingScore;

  return (
    <Container className="quiz-results py-4">
      {showConfetti && (
        <ReactConfetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      <h3 className="fw-bold">Your Results</h3>
      <p className="congrats-message mb-5">
        Congratulations, you've completed the quiz
      </p>

      <div className="text-center mb-5">
        <p className="final-score">
          <strong>Final Score:</strong>
          <span className="score-text">
            {score}/{questions.length} – {passed ? "Great job" : "Keep practicing"}
          </span>
        </p>

        {passed && user && (
          <PDFDownloadLink
            document={
              <Certificate
                username={user.username}
                courseTitle={courseTitle}
                score={score}
                totalQuestions={questions.length}
              />
            }
            fileName="certificate.pdf"
          >
            {({ loading }) => (
              <Button variant="primary" className="mt-3">
                {loading ? "Generating certificate..." : "Download Your Certificate"}
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </div>

      <Row>
        {questions.map((question, index) => {
          const userAnswer = answers[index];
          const correctAnswer = question.answers[0]?.isCorrect;
          const isCorrect = userAnswer === correctAnswer;

          return (
            <Col md={6} key={index} className="mb-3">
              <div className={`question-box ${isCorrect ? "correct" : "incorrect"}`}>
                <span className="question-number">{index + 1}</span>
                <p className="question-text">{question.text}</p>
                <p>Your answer: {userAnswer ? "True" : "False"}</p>
                <p>Correct answer: {correctAnswer ? "True" : "False"}</p>
              </div>
            </Col>
          );
        })}
      </Row>

      {comparisonData && (
        <CompareResults
          averageScore={comparisonData.averageScore}
          highestScore={comparisonData.highestScore}
          totalAttempts={comparisonData.totalAttempts}
          ranking={comparisonData.ranking}
          userScore={score}
        />
      )}
    </Container>
  );
};

export default QuizResults;
