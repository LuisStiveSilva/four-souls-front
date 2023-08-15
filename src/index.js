import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";
import './index.css';
import Home from './views/Home';
import Admin from './views/Admin';
import CreateCard from './views/CreateCard';
import Container from './components/Container';
import Tournaments from './views/Tournaments';
import SingleTournament from './views/SingleTournament';
import CreateTournament from './views/CreateTournament';

// const router = createBrowserRouter([
//   {
//     path: "/four-souls-front",
//     element: <Home />,
//   },
//   {
//     path: "/four-souls-front/admin",
//     element: <Admin />,
//   },
//   {
//     path: "/four-souls-front/admin/card/:id",
//     element: <CreateCard />,
//   },
//   {
//     path: "/four-souls-front/tournaments",
//     element: <Tournaments />,
//   },
//   {
//     path: "/four-souls-front/tournaments/:id",
//     element: <SingleTournament />,
//   },
//   {
//     path: "/four-souls-front/tournaments/create",
//     element: <CreateTournament />,
//   }
// ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Container>
      {/* <RouterProvider router={router} /> */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/card/:id" element={<CreateCard />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournaments/:id" element={<SingleTournament />} />
          <Route path="/tournaments/create" element={<CreateTournament />} />
        </Routes>
      </HashRouter>
    </Container>
  </React.StrictMode>
);
