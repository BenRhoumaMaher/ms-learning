import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/styles.css';
import QuizHero from './sections/QuizHero';
import QuizQuestion from './sections/QuizQuestion';
import QuizResults from './sections/QuizResults';
import CompareResults from './sections/CompareResults';
import KeepLearning from './sections/KeepLearning';
import Footer from '../../layouts/Footer';
import { QuizProvider } from './sections/QuizContext';
import { useQuiz } from './sections/QuizContext';
import ReactConfetti from 'react-confetti';
import { getLessonInfo } from '../../helpers/api';

const Quiz = () => {
  const { id: lessonId } = useParams();

  return (
    <QuizProvider>
      <QuizContent lessonId={lessonId} />
    </QuizProvider>
  );
};

const QuizContent = ({ lessonId }) => {
  const { quizStarted, quizFinished, setCourseTitle } = useQuiz();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await getLessonInfo(lessonId);
        setCourseData(response);
        setCourseTitle(response.course.title);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourseData();
  }, [lessonId, setCourseTitle]);

  useEffect(() => {
    if (quizFinished && courseData) {
      const passingScore = courseData.course.quiz.passing_score || Math.ceil(courseData.course.quiz.questions * 0.7);
      const score = JSON.parse(localStorage.getItem('quizScore'));

      if (score >= passingScore) {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 8000);
        return () => clearTimeout(timer);
      }
    }
  }, [quizFinished, courseData]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section>
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      <section className='section-container'>
        <QuizHero lessonId={lessonId} />
      </section>

      {quizStarted && !quizFinished && (
        <section className='section-container'>
          <QuizQuestion />
        </section>
      )}

      {quizFinished && (
        <>
          <section className='section-container'>
            <QuizResults />
          </section>
          <section className='section-container'>
            <CompareResults />
          </section>
        </>
      )}

      <section className='section-container'>
        <KeepLearning lessonId={lessonId} />
      </section>
      <Footer />
    </section>
  );
};

export default Quiz;