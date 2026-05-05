import type { ReactElement } from "react";

import AdminDashboard from "@/pages/AdminDashboard";
import DispatcherDashboard from "@/pages/DispatcherDashboard";
import Login from "@/pages/Login";
import ManagerDashboard from "@/pages/ManagerDashboard";
import OperatorDashboard from "@/pages/OperatorDashboard";
import RoleSelect from "@/pages/RoleSelect";
import SpecialistMobile from "@/pages/SpecialistMobile";

export type Murojaat24Route = {
  path: string;
  element: ReactElement;
};

export const murojaat24Routes: Murojaat24Route[] = [
  { path: "/login", element: <Login /> },
  { path: "/role-select", element: <RoleSelect /> },
  { path: "/operator-dashboard", element: <OperatorDashboard /> },
  { path: "/dispatcher-dashboard", element: <DispatcherDashboard /> },
  { path: "/specialist-mobile", element: <SpecialistMobile /> },
  { path: "/manager-dashboard", element: <ManagerDashboard /> },
  { path: "/admin-dashboard", element: <AdminDashboard /> },
];
