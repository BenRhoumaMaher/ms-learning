import { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

export const VideoMetricsChart = ({ videoAnalytics }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!videoAnalytics) return;

        const ctx = chartRef.current.getContext('2d');

        if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
        }

        chartRef.current.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Average Watch Time (min)', 'Average Completion (%)', 'Total Views'],
                datasets: [{
                    label: 'Video Metrics',
                    data: [
                        videoAnalytics.averageWatchTime / 60,
                        videoAnalytics.averageCompletion,
                        videoAnalytics.totalViews
                    ],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Video Engagement Metrics',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                if (context.label.includes('Time')) {
                                    return `${context.dataset.label}: ${context.raw.toFixed(1)} min`;
                                } else if (context.label.includes('Completion')) {
                                    return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
                                }
                                return `${context.dataset.label}: ${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Value'
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
    }, [videoAnalytics]);

    return <canvas ref={chartRef} height="300"></canvas>;
};