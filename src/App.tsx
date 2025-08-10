import React from 'react';
import { QuotationProvider, useQuotation } from './context/QuotationContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Step1ScopeOfWork from './components/steps/Step1ScopeOfWork';
import Step2MaterialOptions from './components/steps/Step2MaterialOptions';
import Step3WorktopLayout from './components/steps/Step3WorktopLayout';
import Step5DesignOptions from './components/steps/Step5DesignOptions';
import Step6Timeline from './components/steps/Step6Timeline';
import Step7ProjectType from './components/steps/Step8ProjectType';
import Step9ContactInfo from './components/steps/Step9ContactInfo';
import QuoteSummary from './components/QuoteSummary';
import AdminPanel from './components/admin/AdminPanel';
import AdminLogin from './components/admin/AdminLogin';
import SuperAdmin from './components/admin/SuperAdmin';
import SuperAdminLogin from './components/admin/SuperAdminLogin';
import LoginRouter from './components/auth/LoginRouter';
import MainLogin from './components/auth/MainLogin';
import Dashboard from './components/auth/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Unauthorized from './components/auth/Unauthorized';
import ErrorBoundary from './components/ErrorBoundary';

const QuotationApp: React.FC = () => {
  const { currentStep, isQuoteSubmitted } = useQuotation();

  if (isQuoteSubmitted) {
    return <QuoteSummary />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ScopeOfWork />;
      case 2:
        return <Step2MaterialOptions />;
      case 3:
        return <Step3WorktopLayout />;
      case 4:
        return <Step5DesignOptions />;
      case 5:
        return <Step6Timeline />;
      case 6:
        return <Step7ProjectType />;
      case 7:
        return <Step9ContactInfo />;
      default:
        return <Step1ScopeOfWork />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-8">
        {renderStep()}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<MainLogin />} />
            <Route path="/super-admin-login" element={<SuperAdminLogin />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <QuotationProvider>
                  <Dashboard />
                </QuotationProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/quotation" element={
              <ProtectedRoute>
                <QuotationProvider>
                  <QuotationApp />
                </QuotationProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <QuotationProvider>
                  <Dashboard />
                </QuotationProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-panel" element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <ErrorBoundary>
                  <AdminPanel />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <ErrorBoundary>
                  <AdminPanel />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            
            <Route path="/admin-login" element={<LoginRouter />} />
            <Route path="/user-login" element={<LoginRouter />} />
            
            <Route path="/super-admin" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <ErrorBoundary>
                  <QuotationProvider>
                    <SuperAdmin />
                  </QuotationProvider>
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            
            {/* Unauthorized page */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Redirect all other routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;