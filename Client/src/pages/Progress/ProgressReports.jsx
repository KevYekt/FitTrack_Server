import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './ProgressReports.scss';
import {jwtDecode} from 'jwt-decode';

import { CategoryScale, Chart, LinearScale, PointElement, LineElement } from "chart.js";



const ProgressReports = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

  Chart.register(CategoryScale);
  Chart.register(LinearScale);
  Chart.register(PointElement);
  Chart.register(LineElement);

  const [weightData, setWeightData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeightData = async () => {
      const token = localStorage.getItem('token');   
      console.log('Token:', token);
   
      if (!token) {
        setError('Authentication token not found.');
        return;
      }

      try {
        const { userId } = jwtDecode(token);
        const response = await axios.get(`${BASE_URL}api/selections/weight/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      setWeightData(response.data);
      } catch (error) {
        console.error('Failed to fetch weight data:', error);
        setError('Failed to fetch weight data.');
      }
    };

    fetchWeightData();
  }, []);

  // Data for the chart
  const data = {
    labels: weightData.map(entry => entry.date),
    datasets: [{
      label: 'Weight',
      data: weightData.map(entry => entry.weight),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return (
    <div className="progress-reports-page">
      <h1>Progress Reports</h1>
      {error ? <p>{error}</p> : <Line data={data} />}
    </div>
  );
};

export default ProgressReports;