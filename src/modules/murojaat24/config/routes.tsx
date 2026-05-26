import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import DispatcherDashboardRoutes from "@/pages/dispatcher-dashboard/DispatcherDashboardRoutes";
import Login from "@/pages/login/Login";
import ManagerDashboardRoutes from "@/pages/manager-dashboard/ManagerDashboardRoutes";
import ManagerUsersPage from "@/pages/manager-users/ManagerUsersPage";
import OperatorDashboardRoutes from "@/pages/operator-dashboard/OperatorDashboardRoutes";
import Profile from "@/pages/profile/Profile";
import SpecialistMobile from "@/pages/specialist-mobile/SpecialistMobile";
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
    path: "/operator-dashboard/*",
    element: <OperatorDashboardRoutes />,
    requiredRoles: ["operator", "admin"],
  },
  {
    path: "/dispatcher-dashboard/*",
    element: <DispatcherDashboardRoutes />,
    requiredRoles: ["dispatcher", "admin"],
  },
  {
    path: "/specialist-mobile",
    element: <SpecialistMobile />,
    requiredRoles: ["specialist", "admin"],
  },
  {
    path: "/manager-dashboard",
    element: <Navigate to="/manager/nazorat" replace />,
    requiredRoles: ["manager", "admin"],
  },
  {
    path: "/manager/*",
    element: <ManagerDashboardRoutes />,
    requiredRoles: ["manager", "admin"],
  },
  {
    path: "/manager/foydalanuvchilar",
    element: <ManagerUsersPage />,
    requiredRoles: ["manager", "admin"],
  },
  {
    path: "/profile",
    element: <Profile />,
    requiredRoles: ["admin", "operator", "dispatcher", "specialist", "manager"],
  },
  {
    path: "/admin-dashboard",
    element: <Navigate to="/ecosystem/modullar" replace />,
    requiredRoles: ["admin"],
  },
];
