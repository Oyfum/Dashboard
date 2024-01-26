import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // Import the Chart.js date-fns adapter
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

const MyChartComponent = () => {
  const [timescale, setTimescale] = useState('week'); // Initial timescale is set to 'week'
  const chartRef = useRef(null);

  const getLabels = (selectedTimescale) => {
    const now = new Date();
    switch (selectedTimescale) {
      case 'day':
        return Array.from({ length: 7 }, (_, index) => addDays(now, index));
      case 'week':
        return Array.from({ length: 7 }, (_, index) => addWeeks(now, index));
      case 'month':
        return Array.from({ length: 7 }, (_, index) => addMonths(now, index));
      case 'year':
        return Array.from({ length: 7 }, (_, index) => addYears(now, index));
      default:
        return [];
    }
  };

  const data = {
    labels: getLabels(timescale),
    datasets: [
      {
        label: 'Sales',
        data: [18, 12, 6, 9, 12, 3, 9],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: 'bar',
    data,
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: timescale,
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart
      chartRef.current.destroy();
    }

    // Create new chart
    const newChart = new Chart(document.getElementById('myChart'), config);
    chartRef.current = newChart;

    // Cleanup when component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [config]);

  const handleTimescaleChange = (newTimescale) => {
    setTimescale(newTimescale);

    // Update chart labels and options based on the selected timescale
    const newConfig = {
      ...config,
      data: {
        ...config.data,
        labels: getLabels(newTimescale),
      },
      options: {
        ...config.options,
        scales: {
          ...config.options.scales,
          x: {
            ...config.options.scales.x,
            time: {
              ...config.options.scales.x.time,
              unit: newTimescale,
            },
          },
        },
      },
    };

    if (chartRef.current) {
      // Destroy existing chart
      chartRef.current.destroy();
    }

    // Create new chart
    const newChart = new Chart(document.getElementById('myChart'), newConfig);
    chartRef.current = newChart;
  };

  return (
    <div className ='w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white'>
      <div className='flex space-x-4'>
        <button className='bg-blue-300 text-white p-3 rounded-lg inline-block' onClick={() => handleTimescaleChange('day')}>Day</button>
        <button className='bg-yellow-300 text-white p-3 rounded-lg inline-block' onClick={() => handleTimescaleChange('week')}>Week</button>
        <button className='bg-green-300 text-white p-3 rounded-lg inline-block' onClick={() => handleTimescaleChange('month')}>Month</button>
        <button className='bg-red-300 text-white p-3 rounded-lg inline-block' onClick={() => handleTimescaleChange('year')}>Year</button>
      </div>
      <div>
        <canvas id="myChart"></canvas>
      </div>
    </div>
  );
};

export default MyChartComponent;
