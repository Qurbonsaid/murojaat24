import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import DispatcherDashboard from "@/pages/DispatcherDashboard";
import Login from "@/pages/Login";
import ManagerDashboard from "@/pages/ManagerDashboard";
import OperatorDashboard from "@/pages/OperatorDashboard";
import SpecialistMobile from "@/pages/SpecialistMobile";
import type { UserRole } from "@/lib/api/auth";

export type Murojaat24Route = {
  path: string;
  element: ReactElement;
  public?: boolean;
  requiredRoles?: UserRole[];
};

export const murojaat24Routes: Murojaat24Route[] = [
  { path: "/login", element: <Login />, public: true },
  {
    path: "/role-select",
    element: <Navigate to="/login" replace />,
    public: true,
  },
  {
    path: "/operator-dashboard",
    element: <OperatorDashboard />,
    requiredRoles: ["operator", "admin"],
  },
  {
    path: "/dispatcher-dashboard",
    element: <DispatcherDashboard />,
    requiredRoles: ["dispatcher", "admin"],
  },
  {
    path: "/specialist-mobile",
    element: <SpecialistMobile />,
    requiredRoles: ["specialist", "admin"],
  },
  {
    path: "/manager-dashboard",
    element: <ManagerDashboard />,
    requiredRoles: ["manager", "admin"],
  },
  {
    path: "/admin-dashboard",
    element: <Navigate to="/ecosystem/modullar" replace />,
    requiredRoles: ["admin"],
  },
];
