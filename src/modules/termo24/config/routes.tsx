import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import Login from "@/pages/login/Login";
import Profile from "@/pages/profile/Profile";
import type { UserRole } from "@/lib/api/auth";

export type Termo24Route = {
  path: string;
  element: ReactElement;
  public?: boolean;
  requiredRoles?: UserRole[];
};

export const termo24Routes: Termo24Route[] = [
  { path: "/login", element: <Login />, public: true },
  {
    path: "/role-select",
    element: <Navigate to="/login" replace />,
    public: true,
  },
  {
    path: "/profile",
    element: <Profile />,
    requiredRoles: ["admin", "operator", "dispatcher", "specialist", "manager"],
  },
  {
    path: "/admin-dashboard",
    element: <Navigate to="/ecosystem/modules" replace />,
    requiredRoles: ["admin"],
  },
];
