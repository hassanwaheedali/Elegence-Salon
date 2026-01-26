import { StrictMode, lazy, Suspense } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import ReactDOM from "react-dom/client";
import './index.css'
import Layout from './Layout';
import LoadingSpinner from './Components/LoadingSpinner';

const Home = lazy(() => import('./Pages/Home'));
const Contact = lazy(() => import('./Pages/Contact'));


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
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={Router} />
  </StrictMode>
);
