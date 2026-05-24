import { Navigate, Route, Routes } from "react-router-dom";

import DispatcherAssignments from "./DispatcherAssignments";
import DispatcherLayout from "./DispatcherLayout";
import DispatcherNewAppeals from "./DispatcherNewAppeals";

const DispatcherDashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<DispatcherLayout />}>
        <Route index element={<Navigate to="appeals" replace />} />
        <Route path="appeals" element={<DispatcherNewAppeals />} />
        <Route path="assignments" element={<DispatcherAssignments />} />
      </Route>
    </Routes>
  );
};

export default DispatcherDashboardRoutes;
