import { StrictMode, lazy, Suspense } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom'
import ReactDOM from "react-dom/client";
import './index.css'
import Layout from './Layout';
import AdminLayout from './AdminLayout';
import LoadingSpinner from './Components/LoadingSpinner';
import { AuthProvider } from './Context/AuthContext.jsx';
import { AppointmentProvider } from './Context/AppointmentContext.jsx';
import { MessageProvider } from './Context/MessageContext.jsx';
import { StaffProvider } from './Context/StaffContext.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';

const Home = lazy(() => import('./Pages/Home'));
const Contact = lazy(() => import('./Pages/Contact'));
const Login = lazy(() => import('./Pages/Login'));
const Register = lazy(() => import('./Pages/Register'));
const Account = lazy(() => import('./Pages/User Panel/Account'));
const Dashboard = lazy(() => import('./Pages/Admin/Dashboard'));
const Appointments = lazy(() => import('./Pages/Admin/Appointments'));
const Staffs = lazy(() => import('./Pages/Admin/Staffs'));
const StaffLayout = lazy(() => import('./StaffLayout'));
const StaffDashboard = lazy(() => import('./Pages/Staff/StaffDashboard'));
const StaffAppointments = lazy(() => import('./Pages/Staff/StaffAppointments'));
const StaffProfile = lazy(() => import('./Pages/Staff/StaffProfile'));


const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Regular pages with footer */}
      <Route path='/' element={<Layout />} >
        <Route path='' element={
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        } />
        <Route path='/contact' element={
          <Suspense fallback={<LoadingSpinner />}>
            <Contact />
          </Suspense>
        } />
        <Route path='/login' element={
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        } />
        <Route path='/register' element={
          <Suspense fallback={<LoadingSpinner />}>
            <Register />
          </Suspense>
        } />
        <Route path='/account' element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute requiredRole="client">
              <Account />
            </ProtectedRoute>
          </Suspense>
        } />
      </Route>

      {/* Staff pages without footer */}
      <Route path='/staff' element={<StaffLayout />} >
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute requiredRole="staff">
              <Navigate to="/staff/dashboard" replace />
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path='/staff/dashboard' element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path='/staff/appointments' element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute requiredRole="staff">
              <StaffAppointments />
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path='/staff/profile' element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute requiredRole="staff">
              <StaffProfile />
            </ProtectedRoute>
          </Suspense>
        } />
      </Route>

      {/* Admin pages without footer */}
      <Route path='/admin' element={<AdminLayout />} >
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute requiredRole="admin">
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path='/admin/dashboard' element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path='/admin/appointments' element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute requiredRole="admin">
              <Appointments />
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path='/admin/staffs' element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute requiredRole="admin">
              <Staffs />
            </ProtectedRoute>
          </Suspense>
        } />
      </Route>
    </>
  )
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MessageProvider>
      <AuthProvider>
        <StaffProvider>
          <AppointmentProvider>
            <RouterProvider router={Router} />
          </AppointmentProvider>
        </StaffProvider>
      </AuthProvider>
    </MessageProvider>
  </StrictMode>
);
