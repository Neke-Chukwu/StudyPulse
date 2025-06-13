import { useQuizAnalyticsQuery } from '../api/quiz';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const Analytics = () => {
  const { data: analytics, isLoading } = useQuizAnalyticsQuery();

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  // Prepare data for charts
  const scoreDistribution = {
    labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
    datasets: [
      {
        data: analytics.scoreDistribution,
        backgroundColor: [
          'rgba(239, 68, 68, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(79, 70, 229, 0.5)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(234, 179, 8)',
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(79, 70, 229)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topicPerformance = {
    labels: analytics.topicPerformance.map((tp) => tp.topic),
    datasets: [
      {
        label: 'Average Score',
        data: analytics.topicPerformance.map((tp) => tp.averageScore),
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1,
      },
      {
        label: 'Attempts',
        data: analytics.topicPerformance.map((tp) => tp.attempts),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const timeAnalysis = {
    labels: analytics.timeAnalysis.map((ta) => ta.timeRange),
    datasets: [
      {
        label: 'Average Score by Time',
        data: analytics.timeAnalysis.map((ta) => ta.averageScore),
        borderColor: 'rgb(79, 70, 229)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Detailed Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Quizzes</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{analytics.totalAttempts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Average Score</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {analytics.averageScore.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Accuracy</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {analytics.accuracy.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Topics Covered</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {analytics.topicPerformance.length}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Score Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Score Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={scoreDistribution}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* Topic Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Topic Performance</h3>
          <div className="h-64">
            <Bar
              data={topicPerformance}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Time Analysis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Time Analysis</h3>
          <div className="h-64">
            <Line
              data={timeAnalysis}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Performance Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Trends</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Improvement Rate</p>
              <p className="text-2xl font-bold text-indigo-600">
                {analytics.improvementRate > 0 ? '+' : ''}
                {analytics.improvementRate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Consistency Score</p>
              <p className="text-2xl font-bold text-indigo-600">
                {analytics.consistencyScore.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Best Performing Topic</p>
              <p className="text-2xl font-bold text-indigo-600">
                {analytics.bestPerformingTopic}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 