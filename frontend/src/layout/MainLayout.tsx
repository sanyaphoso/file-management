import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>

      {/* Top Navbar - fixed เต็มความกว้างหน้าจอ */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          width: "100%",
        }}
      >
        <Navbar />
      </div>

      <Layout style={{ marginTop: 64 }}> {/* ดัน content ลงมาใต้ Navbar */}

        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main Content */}
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 220,
            transition: "all 0.2s",
          }}
        >
          <Content
            style={{
              padding: 24,
              minHeight: "calc(100vh - 64px)",
              background: "#f5f5f5",
            }}
          >
            <Outlet />
          </Content>
        </Layout>

      </Layout>
    </Layout>
  );
};

export default MainLayout;