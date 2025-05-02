import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizMeta, setQuizMeta] = useState(null);
    const [courseTitle, setCourseTitle] = useState('');

    const finishQuiz = useCallback(() => {
        const correctAnswers = answers.reduce((count, userAnswer, index) => {
            const question = questions[index];
            if (!question || userAnswer === undefined) return count;

            const correctAnswer = question.answers[0]?.isCorrect;
            return count + (userAnswer === correctAnswer ? 1 : 0);
        }, 0);

        setScore(correctAnswers);
        setQuizFinished(true);
    }, [answers, questions]);

    const startQuiz = (quizData) => {
        setQuestions(quizData.questions);
        setQuizMeta({
            timeLimit: quizData.timeLimit
        });
        setTimeLeft(quizData.timeLimit * 60);
        setAnswers(Array(quizData.questions.length).fill(null));
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizStarted(true);
        setQuizFinished(false);
    };

    useEffect(() => {
        if (!quizStarted || quizFinished || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    finishQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizStarted, quizFinished, timeLeft, finishQuiz]);

    const submitAnswer = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            finishQuiz();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <QuizContext.Provider value={{
            quizStarted,
            quizFinished,
            currentQuestionIndex,
            questions,
            answers,
            courseTitle,
            setCourseTitle,
            score,
            timeLeft,
            formatTime,
            startQuiz,
            submitAnswer,
            finishQuiz,
            setCurrentQuestionIndex
        }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => useContext(QuizContext);