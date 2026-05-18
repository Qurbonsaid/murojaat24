import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import DispatcherDashboard from "@/pages/dispatcher-dashboard/DispatcherDashboard";
import Login from "@/pages/login/Login";
import ManagerDashboard from "@/pages/manager-dashboard/ManagerDashboard";
import ManagerUsersPage from "@/pages/manager-users/ManagerUsersPage";
import OperatorDashboard from "@/pages/operator-dashboard/OperatorDashboard";
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
