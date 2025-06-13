import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';

interface Topic {
  _id: string;
  name: string;
  questionCount: number;
}

const StudentDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch topics from API
    const fetchTopics = async () => {
      try {
        // Simulated data for now
        setTopics([
          { _id: '1', name: 'Anatomy', questionCount: 50 },
          { _id: '2', name: 'Physiology', questionCount: 45 },
          { _id: '3', name: 'Pharmacology', questionCount: 30 },
        ]);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Continue your learning journey with StudyPulse
          </p>
        </div>

        {/* Topics Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 px-4 sm:px-0">
            Available Topics
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading topics...</p>
              </div>
            ) : (
              topics.map((topic) => (
                <div
                  key={topic._id}
                  className="card hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {topic.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {topic.questionCount} questions available
                  </p>
                  <div className="mt-4">
                    <Link
                      to={`/quiz/${topic._id}`}
                      className="btn-primary inline-block"
                    >
                      Start Quiz
                    </Link>
                    <Link
                      to={`/theory/${topic._id}`}
                      className="btn-secondary inline-block ml-3"
                    >
                      Theory Review
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 px-4 sm:px-0">
            Recent Activity
          </h2>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {/* TODO: Add recent quiz attempts */}
              <li className="px-4 py-4">
                <p className="text-sm text-gray-600">No recent activity</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 