import React from 'react';
import { Button, Typography, Row, Col, Space, ConfigProvider } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    // สไตล์สำหรับหน้าจอหลัก
    const containerStyle: React.CSSProperties = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000033 0%, #000b29 100%)', // สีพื้นหลังโทนเข้มตามภาพ
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#ffffff',
        overflow: 'hidden',
    };

    const imageContainerStyle: React.CSSProperties = {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    // จำลองภาพประกอบด้วย SVG เพื่อความสวยงามและไม่ต้องการไฟล์ภายนอก
    const Illustration = () => (
        <svg width="400" height="400" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M150 300C150 244.772 194.772 200 250 200C305.228 200 350 244.772 350 300H150Z" fill="#A855F7" fillOpacity="0.8" />
            <rect x="100" y="300" width="300" height="120" rx="10" fill="#1E1E1E" />
            <rect x="120" y="250" width="60" height="80" rx="5" fill="#BBF7D0" transform="rotate(-10 120 250)" />
            <rect x="180" y="240" width="60" height="80" rx="5" fill="#FECACA" transform="rotate(-5 180 240)" />
            <rect x="240" y="245" width="60" height="80" rx="5" fill="#BAE6FD" />
            <rect x="300" y="260" width="60" height="80" rx="5" fill="#86EFAC" transform="rotate(5 300 260)" />
            <rect x="50" y="200" width="60" height="60" rx="12" fill="#BEF264" />
            <path d="M65 230C65 220 75 220 80 230S95 240 80 245" stroke="#1A2E05" strokeWidth="3" />
        </svg>
    );

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                    borderRadius: 30, // ให้ปุ่มมีความโค้งมนมากเป็นพิเศษตามภาพ
                },
            }}
        >
            <div style={containerStyle}>
                <Row gutter={[48, 48]} align="middle" style={{ maxWidth: 1200, width: '100%' }}>
                    {/* ส่วนของภาพประกอบ (Left Side) */}
                    <Col xs={24} md={12} style={imageContainerStyle}>
                        <div className="illustration-wrapper">
                            <Illustration />
                        </div>
                    </Col>

                    {/* ส่วนของเนื้อหา (Right Side) */}
                    <Col xs={24} md={12}>
                        <Space direction="vertical" size="large" >
                            <div>
                                <Title style={{ color: '#fff', fontSize: '3.5rem', marginBottom: 0, fontWeight: 700 }}>
                                    ยินดีต้อนรับ
                                </Title>
                                <Title level={2} style={{ color: '#fff', marginTop: 10, fontWeight: 300, opacity: 0.9 }}>
                                    ระบบสืบค้นแฟ้ม
                                </Title>
                                <Title level={2} style={{ color: '#fff', marginTop: -5, fontWeight: 300, opacity: 0.9 }}>
                                    ส่วนบังคับคดี
                                </Title>
                                <Title level={2} style={{ color: '#fff', marginTop: -5, fontWeight: 300, opacity: 0.9 }}>
                                    สำนักกิจการคดี
                                </Title>
                            </div>

                            <div style={{ marginTop: 24 }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    // style={{
                                    //     height: 56,
                                    //     padding: '0 48px',
                                    //     fontSize: 18,
                                    //     background: 'rgba(24, 144, 255, 0.2)',
                                    //     border: '1px solid #1890ff',
                                    //     backdropFilter: 'blur(10px)',
                                    //     display: 'flex',
                                    //     alignItems: 'center',
                                    //     gap: 12
                                    // }}
                                    style={{
                                        height: 56,
                                        padding: "0 48px",
                                        fontSize: 18,
                                        background: "rgba(24,144,255,0.2)",
                                        border: "1px solid #1890ff",
                                        backdropFilter: "blur(10px)",
                                        transition: "all 0.3s ease"
                                    }}
                                    onClick={() => navigate("/login")}
                                >
                                    เข้าสู่ระบบ
                                </Button>
                            </div>

                            {/* <div style={{ marginTop: 40, display: 'flex', gap: 24, opacity: 0.5 }}>
                                <Space>
                                    <CloudServerOutlined />
                                    <Text style={{ color: '#fff' }}>ระบบฐานข้อมูลกลาง</Text>
                                </Space>
                                <Space>
                                    <FileSearchOutlined />
                                    <Text style={{ color: '#fff' }}>สืบค้นรวดเร็ว</Text>
                                </Space>
                            </div> */}
                        </Space>
                    </Col>
                </Row>

                <style>
                    {`

                    .ant-btn-primary:hover {
  background: #1890ff !important;
}
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0px); }
            }
            .illustration-wrapper {
              animation: float 4s ease-in-out infinite;
            }
            @media (max-width: 768px) {
              h1 { font-size: 2.5rem !important; }
              .illustration-wrapper svg { width: 300px; height: 300px; }
            }
          `}
                </style>
            </div>
        </ConfigProvider>
    );
};

export default LandingPage;