import { Outlet } from "react-router-dom";

import DispatcherSidebar from "@/components/DispatcherSidebar";
import UserProfileMenu from "@/components/UserProfileMenu";

const DispatcherLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <DispatcherSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 flex justify-end">
          <UserProfileMenu />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default DispatcherLayout;
