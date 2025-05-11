import { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

export const FrequentTermsBarChart = ({ terms, title, color }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!terms || terms.length === 0) return;

        const ctx = chartRef.current.getContext('2d');

        if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
        }

        chartRef.current.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: terms.map(t => t.term),
                datasets: [{
                    label: 'Frequency',
                    data: terms.map(t => t.count),
                    backgroundColor: color,
                    borderColor: color.replace('0.6', '1'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Count'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: title,
                        font: { size: 14 }
                    }
                }
            }
        });

        return () => {
            if (chartRef.current?.chart) {
                chartRef.current.chart.destroy();
            }
        };
    }, [terms, title, color]);

    return <canvas ref={chartRef} height="300"></canvas>;
};