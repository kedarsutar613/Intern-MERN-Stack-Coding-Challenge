// frontend/src/components/BarChart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ month }) => {
    const [data, setData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetchBarChartData();
    }, [month]);

    const fetchBarChartData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/bar-chart', {
                params: { month }
            });
            
            const labels = ["0-100", "101-200", "201-300", "301-400", "401-500", "501-600", "601-700", "701-800", "801-900", "901-above"];
            const counts = labels.map(label => response.data[label] || 0);

            setData({
                labels,
                datasets: [
                    {
                        label: 'Price Ranges',
                        data: counts,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                ],
            });
        } catch (error) {
            console.error(error);
        }
    };

    return <Bar data={data} />;
};

export default BarChart;
