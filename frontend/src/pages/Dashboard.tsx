import { useQuizAnalyticsQuery } from '../api/quiz';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Dashboard = () => {
  const { data: analytics, isLoading } = useQuizAnalyticsQuery();

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (!analytics) {
    return <div>No data available</div>;
  }

  // Prepare data for charts
  const recentScores = analytics.recentAttempts.map((attempt) => attempt.score);
  const recentDates = analytics.recentAttempts.map((attempt) =>
    new Date(attempt.createdAt).toLocaleDateString()
  );

  const topicPerformance = {
    labels: analytics.topicPerformance.map((tp) => tp.topic),
    datasets: [
      {
        label: 'Average Score by Topic',
        data: analytics.topicPerformance.map((tp) => tp.averageScore),
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1,
      },
    ],
  };

  const scoreHistory = {
    labels: recentDates,
    datasets: [
      {
        label: 'Quiz Scores',
        data: recentScores,
        borderColor: 'rgb(79, 70, 229)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Summary Cards */}
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
          <h3 className="text-lg font-medium text-gray-900">Highest Score</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {analytics.highestScore.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Accuracy</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {analytics.accuracy.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Score History</h3>
          <Line
            data={scoreHistory}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Topic Performance</h3>
          <Bar
            data={topicPerformance}
            options={{
              responsive: true,
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

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {analytics.recentAttempts.map((attempt) => (
            <div
              key={attempt._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">
                  Quiz completed on {new Date(attempt.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Score: {attempt.score.toFixed(1)}% | Questions: {attempt.totalQuestions}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Time: {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 