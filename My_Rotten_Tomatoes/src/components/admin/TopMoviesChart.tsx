'use client';
import { TopMovie } from '@/types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopMoviesChartProps {
  movies: TopMovie[];
}

export default function TopMoviesChart({ movies }: TopMoviesChartProps) {
  const data = {
    labels: movies.map(movie => movie.title),
    datasets: [
      {
        label: 'Note moyenne',
        data: movies.map(movie => movie.averageRating),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Films les mieux notés'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5
      }
    }
  };

  return (
    <div className="h-[400px]">
      <Bar data={data} options={options} />
    </div>
  );
}