import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Sidebar from '../../components/admin/Sidebar';
import { getLogLevelStats } from '../../helpers/api';

Chart.register(...registerables);

const COLORS = [
  '#0088FE', 
  '#00C49F', 
  '#FFBB28', 
  '#FF8042', 
  '#8884d8', 
  '#FF6B6B', 
  '#48D12E'  
];

const LogsDashboard = () => {
    const [logLevelStats, setLogLevelStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const kibanaUrl = 'http://localhost:5601/app/dashboards#/view/0e348598-80c5-4798-9b87-202547ce2bf4?_g=(filters:!(),refreshInterval:(pause:!t,value:60000),time:(from:now-1y%2Fd,to:now))';

    const fetchLogStats = async () => {
        try {
            setIsLoading(true);
            const data = await getLogLevelStats();
            setLogLevelStats(data);
            setError(null);
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to load data. Check console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogStats();
    }, []);

    const pieChartData = {
        labels: logLevelStats.map(item => item.level),
        datasets: [{
            data: logLevelStats.map(item => item.count),
            backgroundColor: COLORS,
            borderWidth: 1,
        }],
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'right' },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className='d-flex'>
            <Sidebar />
            <div className="p-4 w-100">
                <h1 className="text-2xl font-bold mb-6">Application Logs Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Log Level Distribution</h2>
                        <div className="h-[300px]">
                            <Pie data={pieChartData} options={pieChartOptions} />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Kibana Dashboard</h2>
                        <div className="kibana-iframe-container" style={{ height: '500px' }}>
                            <iframe
                                src={kibanaUrl}
                                title="Kibana Dashboard"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogsDashboard;