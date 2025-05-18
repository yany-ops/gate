import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import DashboardPage from "./pages/dashboard";
import ClusterDetailsPage from "./pages/cluster";
import PageLayout from "./pages/layout";
import ClustersPage from "./pages/clusters";
import AddClusterPage from "./pages/add-cluster";
import RbacPage from "./pages/rbac";
import RolesPage from "./pages/roles";
import EditRolePage from "./pages/role-edit";
import RoleDetailsPage from "./pages/role";
import AddRolePage from "./pages/role-add";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="dashboard">
            <Route index element={<DashboardPage />} />
            <Route path="clusters">
              <Route index element={<ClustersPage />} />
              <Route path=":clusterId" element={<ClusterDetailsPage />} />
              <Route path="add" element={<AddClusterPage />} />
            </Route>
            <Route path="rbac">
              <Route index element={<RbacPage />} />
              <Route path="roles">
                <Route index element={<RolesPage />} />
                <Route path=":roleId" element={<RoleDetailsPage />} />
                <Route path=":roleId/edit" element={<EditRolePage />} />
                <Route path="add" element={<AddRolePage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </PageLayout>
    </BrowserRouter>
  </StrictMode>,
);
