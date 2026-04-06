import React from 'react';
import { Layout, Avatar, Badge, Space, Typography, Dropdown, Tooltip, Button } from 'antd';
import type { MenuProps } from 'antd';
import { 
  BellOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Text, Title } = Typography;

/**
 * Interface สำหรับข้อมูลผู้ใช้
 */
interface UserProfile {
  name: string;
  lastName: string;
  position: string;
  imageUrl?: string;
}

const App: React.FC = () => {
  // ข้อมูลจำลองของผู้ใช้
  const user: UserProfile = {
    name: "สมชาย",
    lastName: "ใจดี",
    position: "เจ้าพนักงานบังคับคดีชำนาญการ",
    // imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai", // ลองเปิดใช้เพื่อดูการแสดงผลรูปภาพ
  };

  // ฟังก์ชันหาตัวอักษรย่อสำหรับ Avatar
  const getInitials = (name: string, lastName: string) => {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // เมนูสำหรับ User Dropdown
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'ข้อมูลส่วนตัว',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: 'ตั้งค่าระบบ',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'ออกจากระบบ',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <Layout>
      <Header 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          padding: '0 24px',
          height: '80px', // ขยายความสูงเพื่อให้รองรับข้อความ 2 บรรทัด
          boxShadow: '0 2px 8px #f0f1f2',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%'
        }}
      >
        {/* ส่วนซ้าย: โลโก้ และ ชื่อระบบ */}
        <div style={{ display: 'flex', alignItems: 'center', lineHeight: '1.2' }}>
          {/* โลโก้วงกลม (จำลอง) */}
          <div 
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '50%', 
              backgroundColor: '#1677ff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '12px',
              flexShrink: 0
            }}
          >
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>LED</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Title level={5} style={{ margin: 0, color: '#1a3353', fontSize: '16px' }}>
              ระบบสืบค้นแฟ้ม ส่วนบังคับคดี
            </Title>
            <Text type="secondary" style={{ fontSize: '12px', color: '#595959' }}>
              Legal Execution Division File Search System
            </Text>
          </div>
        </div>

        {/* ส่วนขวา: แจ้งเตือน, รายงาน, ผู้ใช้ */}
        <Space size={24}>
          {/* แจ้งเตือน */}
          <Tooltip title="แจ้งเตือน">
            <Badge count={5} size="small" offset={[2, 0]}>
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: '20px' }} />}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              />
            </Badge>
          </Tooltip>

          {/* รายงาน */}
          <Tooltip title="รายงาน">
            <Button
              type="text"
              icon={<FileTextOutlined style={{ fontSize: '20px' }} />}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
          </Tooltip>

          {/* ข้อมูลผู้ใช้ และ Profile */}
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s'
              }}
              className="user-profile-trigger"
            >
              <Avatar 
                size={40} 
                src={user.imageUrl}
                style={{ 
                  backgroundColor: user.imageUrl ? 'transparent' : '#87d068',
                  verticalAlign: 'middle',
                  marginRight: '5px'
                }}
              >
                {!user.imageUrl && getInitials(user.name, user.lastName)}
              </Avatar>
              
              <div style={{ textAlign: 'left', marginRight: '12px', lineHeight: '1.4' }}>
                <div style={{ fontWeight: 600, color: '#262626', display: 'block' }}>
                  {user.name} {user.lastName}
                </div>
                <div style={{ fontSize: '11px', color: '#8c8c8c', display: 'block' }}>
                  {user.position}
                </div>
              </div>

              
            </div>
          </Dropdown>
        </Space>
      </Header>

      <style>{`
        .user-profile-trigger:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </Layout>
  );
};

export default App;