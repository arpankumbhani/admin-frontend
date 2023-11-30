import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const User = React.lazy(() => import("./views/users/User"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/users", name: "User", element: User },
];

export default routes;
