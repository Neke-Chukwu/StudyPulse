import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface QuizProgress {
  topicId: string;
  topicName: string;
  completedQuizzes: number;
  totalQuizzes: number;
  averageScore: number;
  lastAttempt: string;
}

const ProgressTracker = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [progress, setProgress] = useState<QuizProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // TODO: Implement progress fetching API call
        // For now, using sample data
        setProgress([
          {
            topicId: '1',
            topicName: 'Anatomy and Physiology',
            completedQuizzes: 3,
            totalQuizzes: 5,
            averageScore: 85,
            lastAttempt: '2024-03-15',
          },
          {
            topicId: '2',
            topicName: 'Medical-Surgical Nursing',
            completedQuizzes: 2,
            totalQuizzes: 4,
            averageScore: 78,
            lastAttempt: '2024-03-14',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Your Progress
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Track your quiz completion and performance across different topics
          </p>
        </div>

        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Topic
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Progress
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Average Score
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Attempt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {progress.map((item) => (
                  <tr key={item.topicId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.topicName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{
                              width: `${
                                (item.completedQuizzes / item.totalQuizzes) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {item.completedQuizzes}/{item.totalQuizzes}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.averageScore}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.lastAttempt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker; 