import type { ReactElement } from "react";

import { Navigate, useLocation } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/client";
import type { UserRole } from "@/lib/api/auth";
import { useCurrentUser } from "@/lib/api/auth";
import Forbidden from "@/pages/Forbidden";

type ProtectedRouteProps = {
  children: ReactElement;
  requiredRoles?: UserRole[];
};

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const currentUserQuery = useCurrentUser();

  if (currentUserQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (currentUserQuery.error) {
    const status =
      currentUserQuery.error instanceof ApiError
        ? currentUserQuery.error.status
        : 0;

    if (status === 401 || status === 403) {
      return (
        <Navigate
          to="/login"
          replace
          state={{ from: location.pathname + location.search }}
        />
      );
    }

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-lg font-semibold">Xatolik</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Server bilan bog'lanishda muammo yuz berdi. Keyinroq qayta urinib
            ko'ring.
          </p>
        </div>
      </div>
    );
  }

  const user = currentUserQuery.data;

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (requiredRoles?.length && !requiredRoles.includes(user.role)) {
    return <Forbidden />;
  }

  return children;
};

export default ProtectedRoute;
