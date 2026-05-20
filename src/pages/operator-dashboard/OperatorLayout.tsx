import { Outlet } from "react-router-dom";
import OperatorSidebar from "@/components/OperatorSidebar";
import UserProfileMenu from "@/components/UserProfileMenu";

const OperatorLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <OperatorSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 flex justify-end">
          <UserProfileMenu />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default OperatorLayout;
