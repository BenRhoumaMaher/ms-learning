import { useEffect, useRef } from 'react';
import { Chart, PolarAreaController, ArcElement, RadialLinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(PolarAreaController, ArcElement, RadialLinearScale, Tooltip, Legend);

export const TopLessonsChart = ({ topLessons, courses }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!topLessons || topLessons.length === 0) return;

        const ctx = chartRef.current.getContext('2d');

        if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
        }

        const lessonTitles = topLessons.map(lesson => {
            for (const course of courses) {
                for (const module of course.modules) {
                    const foundLesson = module.lessons.find(l => l.id === lesson.lessonId);
                    if (foundLesson) return foundLesson.title;
                }
            }
            return `Lesson ${lesson.lessonId}`;
        });

        const backgroundColors = topLessons.map((_, index) => {
            const hue = (index * (360 / topLessons.length)) % 360;
            return `hsla(${hue}, 70%, 60%, 0.7)`;
        });

        chartRef.current.chart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: lessonTitles,
                datasets: [{
                    label: 'Engagement Metrics',
                    data: topLessons.map(lesson => lesson.totalViews),
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Top Lessons by Views (Polar Area)',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const lesson = topLessons[context.dataIndex];
                                return [
                                    `Views: ${lesson.totalViews}`,
                                    `Completion: ${lesson.averageCompletion.toFixed(1)}%`
                                ];
                            }
                        }
                    },
                    legend: {
                        position: 'right',
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        ticks: {
                            display: false
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
    }, [topLessons, courses]);

    return <canvas ref={chartRef} height="400"></canvas>;
};