-- ════════════════════════════════════════════════════════
--  Database Schema: ระบบบริหารจัดการแฟ้มข้อมูล
--  รัน: psql -U postgres -d filemanagement_db -f schema.sql
-- ════════════════════════════════════════════════════════

-- สร้าง Database (รันแยก ถ้ายังไม่มี)
-- CREATE DATABASE filemanagement_db;

-- ── ลบตารางเดิมถ้ามี (dev เท่านั้น) ──────────────────────
DROP TABLE IF EXISTS users CASCADE;

-- ── ตาราง users ──────────────────────────────────────────
CREATE TABLE users (
  id           SERIAL        PRIMARY KEY,
  username     VARCHAR(50)   NOT NULL UNIQUE,
  password     VARCHAR(255)  NOT NULL,           -- bcrypt hash
  full_name    VARCHAR(100)  NOT NULL,
  email        VARCHAR(100)  UNIQUE,
  role         VARCHAR(20)   NOT NULL DEFAULT 'user'
                              CHECK (role IN ('admin', 'user', 'viewer')),
  is_active    BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  last_login   TIMESTAMPTZ
);

-- ── Index ─────────────────────────────────────────────────
CREATE INDEX idx_users_username ON users (username);

-- ── Trigger: auto-update updated_at ──────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ════════════════════════════════════════════════════════
--  Seed Data (บัญชีตัวอย่าง password = "1234" ทุกคน)
--  Hash สร้างจาก: bcrypt.hashSync('1234', 10)
-- ════════════════════════════════════════════════════════
INSERT INTO users (username, password, full_name, email, role) VALUES
  (
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'นายสมชาย ใจดี',
    'somchai@example.com',
    'admin'
  ),
  (
    'user01',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'น.ส.ใจใส รักงาน',
    'jaisai@example.com',
    'user'
  ),
  (
    'viewer01',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'นายวิชัย มานะ',
    'wichai@example.com',
    'viewer'
  );
