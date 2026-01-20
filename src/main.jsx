import { StrictMode } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import ReactDOM from "react-dom/client";
import './index.css'
import Layout from './Layout';
import Home from './Pages/Home';
// import About from './Pages/About';
// import Services from './Pages/Services';
// import Contact from './Pages/Contact';


const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} >
      <Route path='' element={<Home />} />
      {/* <Route path='/about' element={<About />} />
      <Route path='/services' element={<Services />} />
      <Route path='/contact' element={<Contact />} /> */}
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={Router} />
  </StrictMode>
);
