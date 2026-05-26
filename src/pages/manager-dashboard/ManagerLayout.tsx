import { Outlet } from "react-router-dom";

import ManagerSidebar from "@/components/ManagerSidebar";
import UserProfileMenu from "@/components/UserProfileMenu";

const ManagerLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 flex justify-end">
          <UserProfileMenu />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerLayout;
