import { Navigate, Route, Routes } from "react-router-dom";
import OperatorLayout from "./OperatorLayout";
import OperatorNewAppeal from "./OperatorNewAppeal";
import OperatorAppealsList from "./OperatorAppealsList";

const OperatorDashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<OperatorLayout />}>
        <Route index element={<Navigate to="new" replace />} />
        <Route path="new" element={<OperatorNewAppeal />} />
        <Route path="list" element={<OperatorAppealsList />} />
      </Route>
    </Routes>
  );
};

export default OperatorDashboardRoutes;
