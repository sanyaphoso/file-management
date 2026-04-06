import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import FileManagement from "../pages/FileManagement";
import MainLayout from "../layout/MainLayout";
import Credential from "../pages/Circular"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
            <Route path="/dashboard"      element={<FileManagement />} />
            <Route path="/circular"       element={<Credential />} />
            <Route path="/consult"        element={<FileManagement />} />
            <Route path="/execution"      element={<FileManagement />} />
            <Route path="/civil"          element={<FileManagement />} />
            <Route path="/administrative" element={<FileManagement />} />
            <Route path="/measures"       element={<FileManagement />} />
            <Route path="/bankruptcy"     element={<FileManagement />} />
            <Route path="/general"        element={<FileManagement />} />
            <Route path="/finance"        element={<FileManagement />} />
            <Route path="/project"        element={<FileManagement />} />
            <Route path="/others"         element={<FileManagement />} />
            <Route path="/files"          element={<FileManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;