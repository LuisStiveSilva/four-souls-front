import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Home from './views/Home';
import Admin from './views/Admin';
import CreateCard from './views/CreateCard';
import Container from './components/Container';
import Tournaments from './views/Tournaments';
import SingleTournament from './views/SingleTournament';
import CreateTournament from './views/CreateTournament';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/card/:id",
    element: <CreateCard />,
  },
  {
    path: "/tournaments",
    element: <Tournaments />,
  },
  {
    path: "/tournaments/:id",
    element: <SingleTournament />,
  },
  {
    path: "/tournaments/create",
    element: <CreateTournament />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Container>
      <RouterProvider router={router} />
    </Container>
  </React.StrictMode>
);
