import { useRef, useEffect } from 'react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

export const QuizPerformanceChart = ({ quizStats }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (quizStats && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (chartRef.current.chart) {
                chartRef.current.chart.destroy();
            }

            chartRef.current.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Average Score', 'Highest Score', 'Lowest Score', 'Total Attempts'],
                    datasets: [{
                        label: 'Quiz Scores (%)',
                        data: [
                            quizStats.average,
                            quizStats.max,
                            quizStats.min,
                            quizStats.totalAttempts
                        ],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(6, 90, 235, 0.6)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(6, 90, 235, 0.6)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Percentage (%)'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Quiz Performance Overview',
                            font: { size: 16 }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => `${context.dataset.label}: ${context.raw.toFixed(1)}%`
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartRef.current?.chart) {
                chartRef.current.chart.destroy();
            }
        };
    }, [quizStats]);

    return <canvas ref={chartRef} height="300"></canvas>;
};