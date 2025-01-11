import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Standings from './Standings.tsx'
import ErrorPage from "./error-page.tsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/standings",
    element: <Standings />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
