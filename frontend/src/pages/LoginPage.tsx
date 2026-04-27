import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ConfigProvider,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Alert,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  FileTextOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

import axios, { AxiosError } from "axios";

import { loginApi } from "../services/auth";

const { Title, Text, Link } = Typography;

// ── Types ─────────────────────────────────────────────────────────────────────
interface LoginFormValues {
  identifier: string;
  password: string;
  remember: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError("");

    try {
      const res = await loginApi({
        identifier: values.identifier, // ⚠️ backend ใช้ identifier
        password: values.password,
      });

      // ✅ เก็บ token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 👉 redirect
      navigate("/files");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
      } else {
        setError("เกิดข้อผิดพลาดที่ไม่คาดคิด");
      }
    }

    setLoading(false);
  };

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: "#1677ff", borderRadius: 8 } }}
    >
      <div style={styles.page}>
        {/* ── Left panel ── */}
        <div style={styles.left}>
          <div style={styles.leftInner}>
            <div style={styles.logoMark}>
              <FileTextOutlined style={{ fontSize: 36, color: "#fff" }} />
            </div>
            <Title level={2} style={styles.leftTitle}>
              ระบบบริหารจัดการแฟ้มข้อมูล
            </Title>
            <Text style={styles.leftSub}>
              ระบบงานสารบรรณอิเล็กทรอนิกส์
              <br />
              สำหรับการจัดเก็บและบริหารแฟ้มเอกสาร
            </Text>

            <div style={styles.featureList}>
              {[
                "จัดการแฟ้มเอกสารได้ครบวงจร",
                "ค้นหาและกรองข้อมูลได้อย่างรวดเร็ว",
                "รองรับการอัพโหลดไฟล์ PDF",
                "ระบบสิทธิ์การเข้าถึงตามบทบาท",
              ].map((f) => (
                <div key={f} style={styles.featureItem}>
                  <SafetyCertificateOutlined
                    style={{ color: "#93c5fd", marginRight: 10, flexShrink: 0 }}
                  />
                  <Text style={{ color: "#e2e8f0", fontSize: 14 }}>{f}</Text>
                </div>
              ))}
            </div>
          </div>

          {/* decorative circles */}
          <div
            style={{
              ...styles.circle,
              width: 320,
              height: 320,
              top: -80,
              right: -80,
              opacity: 0.06,
            }}
          />
          <div
            style={{
              ...styles.circle,
              width: 200,
              height: 200,
              bottom: 60,
              left: -60,
              opacity: 0.08,
            }}
          />
        </div>

        {/* ── Right panel (form) ── */}
        <div style={styles.right}>
          <div style={styles.formCard}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <div style={styles.formLogo}>
                <FileTextOutlined style={{ fontSize: 22, color: "#1677ff" }} />
              </div>
              <Title
                level={3}
                style={{ margin: "0 0 6px", color: "#0f172a", fontWeight: 700 }}
              >
                เข้าสู่ระบบ
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ
              </Text>
            </div>

            {/* Error alert */}
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => setError("")}
                style={{ marginBottom: 20, borderRadius: 8 }}
              />
            )}

            {/* Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              initialValues={{ remember: true }}
            >
              <Form.Item
                name="identifier"
                label={<span style={styles.label}>ชื่อผู้ใช้งาน</span>}
                rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้งาน" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#94a3b8" }} />}
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  size="large"
                  style={styles.input}
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span style={styles.label}>รหัสผ่าน</span>}
                rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                  placeholder="กรอกรหัสผ่าน"
                  size="large"
                  style={styles.input}
                  autoComplete="current-password"
                  iconRender={(visible) =>
                    visible ? (
                      <EyeTwoTone />
                    ) : (
                      <EyeInvisibleOutlined style={{ color: "#94a3b8" }} />
                    )
                  }
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>
                      <Text style={{ fontSize: 13, color: "#475569" }}>
                        จดจำการเข้าสู่ระบบ
                      </Text>
                    </Checkbox>
                  </Form.Item>
                  <Link href="#" style={{ fontSize: 13, color: "#1677ff" }}>
                    ลืมรหัสผ่าน?
                  </Link>
                </div>
              </Form.Item>

              <Form.Item style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  block
                  style={styles.submitBtn}
                >
                  {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </Button>
              </Form.Item>
            </Form>

            <Divider
              style={{ margin: "4px 0 20px", borderColor: "#e2e8f0" }}
            ></Divider>

            <Text
              type="secondary"
              style={{
                display: "block",
                textAlign: "center",
                fontSize: 12,
                marginTop: 24,
              }}
            >
              © 2569 ระบบบริหารจัดการแฟ้มข้อมูล · สงวนลิขสิทธิ์
            </Text>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
    backgroundColor: "#f0f4ff",
  },
  left: {
    flex: "0 0 44%",
    background:
      "linear-gradient(150deg, #1d4ed8 0%, #1677ff 60%, #0ea5e9 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 56px",
    position: "relative",
    overflow: "hidden",
  },
  leftInner: {
    position: "relative",
    zIndex: 1,
    maxWidth: 400,
  },
  logoMark: {
    width: 68,
    height: 68,
    borderRadius: 18,
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  leftTitle: {
    color: "#ffffff",
    fontWeight: 800,
    fontSize: 26,
    lineHeight: 1.3,
    marginBottom: 12,
  },
  leftSub: {
    color: "#bfdbfe",
    fontSize: 15,
    lineHeight: 1.7,
    display: "block",
    marginBottom: 36,
  },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    borderRadius: "50%",
    background: "#fff",
  },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    overflowY: "auto",
  },
  formCard: {
    width: "100%",
    maxWidth: 420,
    background: "#ffffff",
    borderRadius: 20,
    padding: "40px 40px 32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
  },
  formLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    borderRadius: 8,
    fontSize: 14,
  },
  submitBtn: {
    height: 46,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    background: "linear-gradient(90deg, #1d4ed8, #1677ff)",
    border: "none",
    boxShadow: "0 4px 12px rgba(22,119,255,0.35)",
    letterSpacing: 0.3,
  },
  demoBox: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  demoBtn: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "10px 14px",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.15s, border-color 0.15s",
    width: "100%",
  },
};

export default LoginPage;