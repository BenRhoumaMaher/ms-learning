import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card } from 'react-bootstrap';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const InstructorChart = ({ instructorStats }) => {
    const chartData = {
        labels: ['Courses', 'Students', 'Reviews'],
        datasets: [
            {
                label: 'Instructor Statistics',
                data: [
                    instructorStats.totalCourses,
                    instructorStats.totalStudents,
                    instructorStats.totalReviews
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Instructor Overview',
                font: {
                    size: 16
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <Card className="mb-5 shadow-sm">
            <Card.Body>
                <div style={{ height: '300px' }}>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </Card.Body>
        </Card>
    );
};