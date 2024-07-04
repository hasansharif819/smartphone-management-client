import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { managerPaths } from "./manager.routes";
import { routeGenerator } from "../utils/routesGenerator";
// import { facultyPaths } from "./faculty.routes";
import { sellerPaths } from "./seller.routes";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import ChangePassword from "../pages/ChangePassword";
import { superAdminPaths } from "./superAdmin.route";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/superAdmin",
    element: (
      <ProtectedRoute role="superAdmin">
        <App />
      </ProtectedRoute>
    ),
    children: routeGenerator(superAdminPaths),
  },
  {
    path: "/manager",
    element: (
      <ProtectedRoute role="manager">
        <App />
      </ProtectedRoute>
    ),
    children: routeGenerator(managerPaths),
  },
  {
    path: "/seller",
    element: (
      <ProtectedRoute role="seller">
        <App />
      </ProtectedRoute>
    ),
    children: routeGenerator(sellerPaths),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
