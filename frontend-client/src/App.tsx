import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth';
import { LoginPage, RegisterPage } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import { ProfilePage, ResumePage } from '@/features/profile';
import {
  HomePage,
  JobDetailPage,
  JobListPage,
  SavedJobsPage,
  CompanyListPage,
  CompanyDetailPage,
} from '@/features/jobs';
import { MyApplicationsPage } from '@/features/applications';
import { NotificationsPage } from '@/features/notifications';
import { SettingsPage } from '@/features/settings';
import {
  EmployerDashboardPage,
  CompanyProfilePage,
  PostJobPage,
  EditJobPage,
  ManageJobsPage,
  ManageApplicationsPage,
  ApplicationDetailPage,
  SearchCandidatesPage,
  InterviewsPage,
  InterviewDetailPage,
  ScheduleInterviewPage,
  AnalyticsDashboardPage,
  InviteCandidatesPage,
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
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          {/* Public Routes - Không cần đăng nhập */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.JOBS} element={<JobListPage />} />
          <Route path={ROUTES.JOB_DETAIL} element={<JobDetailPage />} />
          <Route path={ROUTES.COMPANIES} element={<CompanyListPage />} />
          <Route path={ROUTES.COMPANY_DETAIL} element={<CompanyDetailPage />} />

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
            path={ROUTES.NOTIFICATIONS}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <NotificationsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SETTINGS}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SettingsPage />
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
            path="/company/jobs/:id/edit"
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <EditJobPage />
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
          <Route
            path={ROUTES.COMPANY_INTERVIEWS}
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <InterviewsPage />
                </EmployerDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${ROUTES.COMPANY_INTERVIEWS}/:id`}
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <InterviewDetailPage />
                </EmployerDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.COMPANY_SCHEDULE_INTERVIEW}
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <ScheduleInterviewPage />
                </EmployerDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.COMPANY_ANALYTICS}
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <AnalyticsDashboardPage />
                </EmployerDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.INVITE_CANDIDATES}
            element={
              <ProtectedRoute>
                <EmployerDashboardLayout>
                  <InviteCandidatesPage />
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
