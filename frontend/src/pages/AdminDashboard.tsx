import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { RootState } from '../store';
import { pageTransition, fadeIn, staggerContainer, listItem } from '../utils/animations';

interface Topic {
  _id: string;
  name: string;
  questionCount: number;
  mcqCount: number;
  theoryCount: number;
}

const AdminDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // TODO: Implement API call to fetch topics
        // For now, using sample data
        setTopics([
          {
            _id: '1',
            name: 'Anatomy and Physiology',
            questionCount: 50,
            mcqCount: 35,
            theoryCount: 15,
          },
          {
            _id: '2',
            name: 'Medical-Surgical Nursing',
            questionCount: 75,
            mcqCount: 50,
            theoryCount: 25,
          },
        ]);
      } catch (error) {
        toast.error('Failed to load topics');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      // TODO: Implement file upload API call
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated upload
      toast.success('File uploaded successfully');
      setSelectedFile(null);
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="space-y-8">
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="bg-white shadow rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome, {user?.name}
          </h2>
          <p className="text-gray-600">
            Manage your study materials and track student progress
          </p>
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="bg-white shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Upload Study Material
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                htmlFor="file-upload"
                className="btn-secondary cursor-pointer"
              >
                Choose File
              </motion.label>
              <span className="text-sm text-gray-500">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="btn-primary disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Topics Overview
            </h3>
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
                      Total Questions
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      MCQ Questions
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Theory Questions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topics.map((topic) => (
                    <motion.tr
                      key={topic._id}
                      variants={listItem}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {topic.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {topic.questionCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {topic.mcqCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {topic.theoryCount}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard; 