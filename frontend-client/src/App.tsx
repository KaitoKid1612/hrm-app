import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/features/auth';
import { LoginPage, RegisterPage } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import { ProfilePage, ResumePage } from '@/features/profile';
import { HomePage, JobDetailPage, JobListPage, SavedJobsPage } from '@/features/jobs';
import { MyApplicationsPage } from '@/features/applications';
import {
  EmployerDashboardPage,
  CompanyProfilePage,
  PostJobPage,
  ManageJobsPage,
  ManageApplicationsPage,
  ApplicationDetailPage,
  SearchCandidatesPage,
} from '@/features/company';
import ProtectedRoute from '@/routes/ProtectedRoute';
import PublicRoute from '@/routes/PublicRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmployerDashboardLayout } from '@/components/layout/EmployerDashboardLayout';
import { ROUTES } from '@/constants';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Không cần đăng nhập */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.JOBS} element={<JobListPage />} />
          <Route path={ROUTES.JOB_DETAIL} element={<JobDetailPage />} />

          {/* Auth Routes - Redirect nếu đã đăng nhập */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes - Cần đăng nhập */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MY_RESUME}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ResumePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SAVED_JOBS}
            element={
              <ProtectedRoute>
                <SavedJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MY_APPLICATIONS}
            element={
              <ProtectedRoute>
                <MyApplicationsPage />
              </ProtectedRoute>
            }
          />

          {/* Employer Routes */}
          <Route
            path={ROUTES.COMPANY_DASHBOARD}
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <EmployerDashboardPage />
                </EmployerDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.COMPANY_PROFILE}
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <CompanyProfilePage />
                </EmployerDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.POST_JOB}
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <PostJobPage />
                </EmployerDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MANAGE_JOBS}
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <ManageJobsPage />
                </EmployerDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MANAGE_APPLICATIONS}
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <ManageApplicationsPage />
                </EmployerDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${ROUTES.MANAGE_APPLICATIONS}/:id`}
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <ApplicationDetailPage />
                </EmployerDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CANDIDATES}
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <SearchCandidatesPage />
                </EmployerDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
