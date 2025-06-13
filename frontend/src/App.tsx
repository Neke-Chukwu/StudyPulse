import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Quiz from './pages/Quiz';
import QuizResults from './pages/QuizResults';
import TheoryReview from './pages/TheoryReview';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:topicId"
              element={
                <ProtectedRoute requiredRole="student">
                  <Quiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz-results/:topicId"
              element={
                <ProtectedRoute requiredRole="student">
                  <QuizResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/theory/:topicId"
              element={
                <ProtectedRoute requiredRole="student">
                  <TheoryReview />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect root to dashboard or login */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
      </div>
      </Router>
    </Provider>
  );
}

export default App;
