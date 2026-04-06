import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Input, 
  Table, 
  Tag, 
  Space, 
  Card, 
  Breadcrumb, 
  Button,
  ConfigProvider
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  FilterOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Content } = Layout;
const { Title, Text } = Typography;

// --- Interfaces ---
interface FileRecord {
  key: React.Key;
  id: number;
  docNumber: string;
  subject: string;
  createdAt: string;
  fiscalYear: string;
  creator: string;
  status: 'ว่าง' | 'ถูกยืม' | 'ดำเนินการ';
  lastBorrower: string;
}

// --- Mock Data ---
const initialData: FileRecord[] = [
  {
    key: '1',
    id: 1,
    docNumber: 'สธ 0101/2567/001',
    subject: 'บันทึกข้อความขออนุมัติโครงการจัดซื้อวัสดุสำนักงาน',
    createdAt: '2024-03-10',
    fiscalYear: '2567',
    creator: 'นายสมชาย ใจดี',
    status: 'ว่าง',
    lastBorrower: '-',
  },
  {
    key: '2',
    id: 2,
    docNumber: 'สธ 0101/2567/005',
    subject: 'รายงานการประชุมคณะกรรมการบริหารจัดการข้อมูลแฟ้ม',
    createdAt: '2024-03-12',
    fiscalYear: '2567',
    creator: 'น.ส.ใจใส รักงาน',
    status: 'ถูกยืม',
    lastBorrower: 'นายวิชัย มานะ',
  },
  {
    key: '3',
    id: 3,
    docNumber: 'สธ 0101/2566/120',
    subject: 'สรุปผลการดำเนินงานประจำปีงบประมาณ 2566',
    createdAt: '2023-11-20',
    fiscalYear: '2566',
    creator: 'นายสมชาย ใจดี',
    status: 'ว่าง',
    lastBorrower: 'น.ส.ระพีพรรณ รุ่งเรือง',
  },
  {
    key: '4',
    id: 4,
    docNumber: 'สธ 0202/2567/012',
    subject: 'คำสั่งแต่งตั้งคณะทำงานปรับปรุงระบบสารสนเทศ',
    createdAt: '2024-02-15',
    fiscalYear: '2567',
    creator: 'น.ส.ใจใส รักงาน',
    status: 'ดำเนินการ',
    lastBorrower: '-',
  },
];

const App: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<FileRecord[]>(initialData);

  // --- Search Logic ---
  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = initialData.filter((entry) =>
      Object.values(entry).some((val) =>
        val.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filteredData);
  };

  // --- Table Columns Definition ---
  const columns: ColumnsType<FileRecord> = [
    {
      title: 'ลำดับ',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      align: 'center',
    },
    {
      title: 'เลขหนังสือ',
      dataIndex: 'docNumber',
      key: 'docNumber',
      width: 180,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'เรื่อง',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
      render: (text) => <span title={text}>{text}</span>,
    },
    {
      title: 'วันที่สร้าง',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: 'ปีงบประมาณ',
      dataIndex: 'fiscalYear',
      key: 'fiscalYear',
      width: 110,
      align: 'center',
    },
    {
      title: 'ผู้สร้าง',
      dataIndex: 'creator',
      key: 'creator',
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: '#bfbfbf' }} />
          {text}
        </Space>
      ),
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status: string) => {
        let color = 'default';
        if (status === 'ว่าง') color = 'green';
        if (status === 'ถูกยืม') color = 'orange';
        if (status === 'ดำเนินการ') color = 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'ผู้ยืมล่าสุด',
      dataIndex: 'lastBorrower',
      key: 'lastBorrower',
    },
  ];

  // --- Row Selection Config ---
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        {/* <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Space>
            <FileTextOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
            <Title level={4} style={{ margin: 0 }}>ระบบบริหารจัดการแฟ้มข้อมูล</Title>
          </Space>
        </Header> */}

        <Content style={{ padding: '24px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Breadcrumb style={{ marginBottom: 16 }}>
              <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              <Breadcrumb.Item>รายละเอียดข้อมูลแฟ้ม</Breadcrumb.Item>
            </Breadcrumb>

            <Card bordered={false} style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)' }}>
              <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <Title level={3} style={{ marginBottom: 8 }}>หนังสือเวียน</Title>
                  <Text type="secondary">จัดการและค้นหาข้อมูลแฟ้มเอกสารในระบบสารบรรณอิเล็กทรอนิกส์</Text>
                </div>
                
                <Space>
                  <Button icon={<PlusOutlined />} type="primary">เพิ่มข้อมูลแฟ้ม</Button>
                  <Button icon={<FilterOutlined />}>ตัวกรอง</Button>
                </Space>
              </div>

              {/* Search Section */}
              <div style={{ marginBottom: 20, background: '#fafafa', padding: '16px', borderRadius: '8px' }}>
                <Input
                  placeholder="ค้นหาด้วยเลขหนังสือ, ชื่อเรื่อง, ผู้สร้าง หรือสถานะ..."
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  size="large"
                  allowClear
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ maxWidth: 500 }}
                />
              </div>

              {/* Selection Info */}
              {selectedRowKeys.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Tag color="blue">เลือกแล้ว {selectedRowKeys.length} รายการ</Tag>
                  <Button type="link" size="small" onClick={() => setSelectedRowKeys([])}>ล้างการเลือก</Button>
                </div>
              )}

              {/* Data Table */}
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `ทั้งหมด ${total} รายการ`,
                }}
                locale={{
                  emptyText: 'ไม่พบข้อมูลที่ค้นหา',
                }}
              />
            </Card>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default App;