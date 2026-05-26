import { Navigate, Route, Routes } from "react-router-dom";

import ManagerLayout from "./ManagerLayout";
import ManagerReviewPage from "./ManagerReviewPage";
import ManagerStatisticsPage from "./ManagerStatisticsPage";

const ManagerDashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<ManagerLayout />}>
        <Route index element={<Navigate to="nazorat" replace />} />
        <Route path="nazorat" element={<ManagerReviewPage />} />
        <Route path="statistika" element={<ManagerStatisticsPage />} />
      </Route>
    </Routes>
  );
};

export default ManagerDashboardRoutes;
