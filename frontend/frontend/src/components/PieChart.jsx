// frontend/src/components/PieChart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ month }) => {
    const [data, setData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetchPieChartData();
    }, [month]);

    const fetchPieChartData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/pie-chart', {
                params: { month }
            });

            const labels = Object.keys(response.data);
            const values = Object.values(response.data);

            setData({
                labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF',
                        ],
                    },
                ],
            });
        } catch (error) {
            console.error(error);
        }
    };

    return <Pie data={data} />;
};

export default PieChart;
