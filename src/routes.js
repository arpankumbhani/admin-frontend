import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const User = React.lazy(() => import("./views/users/User"));
const Finance = React.lazy(() => import("./views/accountList/Finance"));
const Client = React.lazy(() => import("./views/clientList/Client"));
const Income = React.lazy(() => import("./views/incomeList/Income"));
const Expense = React.lazy(() => import("./views/expenseData/Expense"));
const Report = React.lazy(() => import("./views/reportData/Report"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/users", name: "User", element: User },
  { path: "/accountList", name: "Finance", element: Finance },
  { path: "/clientList", name: "Client", element: Client },
  { path: "/incomeList", name: "Income", element: Income },
  { path: "/expenseData", name: "Expense", element: Expense },
  { path: "/reportData", name: "Report", element: Report },
];

export default routes;
