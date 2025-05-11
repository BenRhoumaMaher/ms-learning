import { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

export const TopInteractiveLessonsChart = ({ topInteractiveLessons }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!topInteractiveLessons || topInteractiveLessons.length === 0) return;

        const ctx = chartRef.current.getContext('2d');

        if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
        }

        chartRef.current.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topInteractiveLessons.map(lesson => lesson.title),
                datasets: [
                    {
                        label: 'Pauses',
                        data: topInteractiveLessons.map(lesson => lesson.pauses),
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Replays',
                        data: topInteractiveLessons.map(lesson => lesson.replays),
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Video Segment Interactions',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw}`
                        }
                    },
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Interactions'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Lessons'
                        }
                    }
                }
            }
        });

        return () => {
            if (chartRef.current?.chart) {
                chartRef.current.chart.destroy();
            }
        };
    }, [topInteractiveLessons]);

    return <canvas ref={chartRef} height="300"></canvas>;
};