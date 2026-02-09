import { StrictMode, lazy, Suspense } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import ReactDOM from "react-dom/client";
import './index.css'
import Layout from './Layout';
import LoadingSpinner from './Components/LoadingSpinner';
import { AuthProvider } from './Context/AuthContext.jsx';
import { AppointmentProvider } from './Context/AppointmentContext.jsx';
import { MessageProvider } from './Context/MessageContext.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';

const Home = lazy(() => import('./Pages/Home'));
const Contact = lazy(() => import('./Pages/Contact'));
const Login = lazy(() => import('./Pages/Login'));
const Register = lazy(() => import('./Pages/Register'));
const Account = lazy(() => import('./Pages/User Panel/Account'));


const Router = createBrowserRouter(
  createRoutesFromElements(
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
      <Route path='/admin' element={
        <Suspense fallback={<LoadingSpinner />}>
          <ProtectedRoute requiredRole="admin">
            {/* <AdminDashboard /> */}
          </ProtectedRoute>
        </Suspense>
      } />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MessageProvider>
      <AuthProvider>
        <AppointmentProvider>
          <RouterProvider router={Router} />
        </AppointmentProvider>
      </AuthProvider>
    </MessageProvider>
  </StrictMode>
);
