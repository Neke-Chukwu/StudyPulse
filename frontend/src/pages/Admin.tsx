import { useState } from 'react';
import { useUploadPDFMutation, useQuestionsQuery, useDeleteQuestionMutation } from '../api/admin';
import { useAuth } from '../hooks/useAuth';

export const Admin = () => {
  const { isAdmin } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadPDFMutation = useUploadPDFMutation();
  const questionsQuery = useQuestionsQuery({
    page: 1,
    limit: 10,
  });
  const deleteQuestionMutation = useDeleteQuestionMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadPDFMutation.mutateAsync(selectedFile);
      setUploadProgress(100);
      // Refresh questions list
      questionsQuery.refetch();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteQuestionMutation.mutateAsync(id);
      questionsQuery.refetch();
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* PDF Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload PDF</h2>
        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {selectedFile && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{selectedFile.name}</span>
              <button
                onClick={handleUpload}
                disabled={uploadPDFMutation.isPending}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                {uploadPDFMutation.isPending ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          )}
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Questions List Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Questions</h2>
        {questionsQuery.isLoading ? (
          <div>Loading questions...</div>
        ) : questionsQuery.isError ? (
          <div>Error loading questions</div>
        ) : (
          <div className="space-y-4">
            {questionsQuery.data?.questions.map((question) => (
              <div key={question.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{question.question}</p>
                    <p className="text-sm text-gray-500">
                      Type: {question.type} | Difficulty: {question.difficulty} | Topic: {question.topic}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 