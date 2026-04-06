import React from "react";
import { Layout, Menu, Button } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

import {
  HomeOutlined,
  MailOutlined,
  CommentOutlined,
  TeamOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  DollarOutlined,
  ProjectOutlined,
  EllipsisOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps["items"] = [
    { key: "/dashboard", icon: <HomeOutlined />, label: "หน้าหลัก" },
    { key: "/circular", icon: <MailOutlined />, label: "หนังสือเวียน" },
    { key: "/consult", icon: <CommentOutlined />, label: "หารือ" },
    { key: "/execution", icon: <TeamOutlined />, label: "บังคับคดีแทน" },
    { key: "/civil", icon: <BankOutlined />, label: "คดีแพ่ง" },
    { key: "/administrative", icon: <SafetyCertificateOutlined />, label: "คดีปกครอง" },
    { key: "/measures", icon: <ThunderboltOutlined />, label: "มาตรการฯ" },
    { key: "/bankruptcy", icon: <GlobalOutlined />, label: "ล้มละลาย" },
    { key: "/general", icon: <EllipsisOutlined />, label: "ทั่วไป" },
    { key: "/finance", icon: <DollarOutlined />, label: "การเงิน" },
    { key: "/project", icon: <ProjectOutlined />, label: "โครงการฯ" },
    { key: "/others", icon: <EllipsisOutlined />, label: "อื่นๆ" }
  ];

  return (
    <Sider
      width={220}
      collapsed={collapsed}
      theme="light"
      style={{
        position: "fixed",
        left: 0,
        top: 80,
        bottom: 0,
        height: "calc(100vh - 80px)",
        overflow: "auto",
        boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        zIndex: 999
      }}
    >

      {/* Collapse Button */}
      <div
        style={{
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-end",
          padding: "8px"
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{
          borderRight: 0
        }}
      />

      <style>{`
        .ant-layout-sider-children::-webkit-scrollbar {
          width: 4px;
        }
        .ant-layout-sider-children::-webkit-scrollbar-thumb {
          background: #d9d9d9;
          border-radius: 4px;
        }
      `}</style>

    </Sider>
  );
};

export default Sidebar;