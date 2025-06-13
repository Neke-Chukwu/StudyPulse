import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Quiz } from './pages/Quiz';
import { Admin } from './pages/Admin';
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="text-center py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      Welcome to StudyPulse
                    </h1>
                    <p className="text-xl text-gray-600">
                      Your personalized learning platform
                    </p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Layout>
                  <Quiz />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <Admin />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
