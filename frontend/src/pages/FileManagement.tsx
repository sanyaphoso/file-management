import React, { useState, useMemo } from 'react';
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
  ConfigProvider,
  Modal,
  Form,
  Select,
  Upload,
  message,
  DatePicker,
  Badge,
  Divider,
  Popconfirm,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  UserOutlined,
  FileTextOutlined,
  InboxOutlined,
  ClearOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;
const { RangePicker } = DatePicker;

// --- Interfaces ---
interface FileRecord {
  key: React.Key;
  id: number;
  fileCode: string;
  bkNumber: string;
  subject: string;
  createdAt: string;
  creator: string;
  status: 'ว่าง' | 'ถูกยืม' | 'ดำเนินการ';
  lastBorrower: string;
  pdfFile?: UploadFile;
}

interface FilterValues {
  dateRange: [Dayjs, Dayjs] | null;
  status: string[];
  creator: string[];
}

// --- Mock Data ---
const initialData: FileRecord[] = [
  {
    key: '1', id: 1, fileCode: 'A-2-001', bkNumber: 'สธ 0101/2567/001',
    subject: 'บันทึกข้อความขออนุมัติโครงการจัดซื้อวัสดุสำนักงาน',
    createdAt: '2024-03-10',
    creator: 'นายสมชาย ใจดี', status: 'ว่าง', lastBorrower: '-',
  },
  {
    key: '2', id: 2, fileCode: 'A-2-002', bkNumber: 'สธ 0101/2567/005',
    subject: 'รายงานการประชุมคณะกรรมการบริหารจัดการข้อมูลแฟ้ม',
    createdAt: '2024-03-12',
    creator: 'น.ส.ใจใส รักงาน', status: 'ถูกยืม', lastBorrower: 'นายวิชัย มานะ',
  },
  {
    key: '3', id: 3, fileCode: 'B-1-003', bkNumber: 'สธ 0101/2566/120',
    subject: 'สรุปผลการดำเนินงานประจำปีงบประมาณ 2566',
    createdAt: '2023-11-20', 
    creator: 'นายสมชาย ใจดี', status: 'ว่าง', lastBorrower: 'น.ส.ระพีพรรณ รุ่งเรือง',
  },
  {
    key: '4', id: 4, fileCode: 'C-3-004', bkNumber: 'สธ 0202/2567/012',
    subject: 'คำสั่งแต่งตั้งคณะทำงานปรับปรุงระบบสารสนเทศ',
    createdAt: '2024-02-15', 
    creator: 'น.ส.ใจใส รักงาน', status: 'ดำเนินการ', lastBorrower: '-',
  },
  {
    key: '5', id: 5, fileCode: 'B-2-005', bkNumber: 'สธ 0303/2567/008',
    subject: 'แนวทางการดำเนินงานด้านการบริหารงบประมาณ',
    createdAt: '2024-01-20', 
    creator: 'นายวิชัย มานะ', status: 'ว่าง', lastBorrower: '-',
  },
  {
    key: '6', id: 6, fileCode: 'A-3-006', bkNumber: 'สธ 0303/2566/099',
    subject: 'รายงานผลการตรวจสอบภายในประจำปี 2566',
    createdAt: '2023-09-05', 
    creator: 'น.ส.ระพีพรรณ รุ่งเรือง', status: 'ถูกยืม', lastBorrower: 'นายสมชาย ใจดี',
  },
];

const FISCAL_YEARS = ['2568', '2567', '2566', '2565', '2564'];
const CREATORS = ['นายสมชาย ใจดี', 'น.ส.ใจใส รักงาน', 'นายวิชัย มานะ', 'น.ส.ระพีพรรณ รุ่งเรือง'];
const STATUS_OPTIONS = ['ว่าง', 'ถูกยืม', 'ดำเนินการ'] as const;
const DEFAULT_FILTERS: FilterValues = { dateRange: null, status: [], creator: [] };

const countActiveFilters = (f: FilterValues) =>
  (f.dateRange ? 1 : 0) + f.status.length + f.creator.length;

// ─────────────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const [allData, setAllData] = useState<FileRecord[]>(initialData);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Filter
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  // Add modal
  const [addOpen, setAddOpen] = useState(false);
  const [addPdfList, setAddPdfList] = useState<UploadFile[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [addForm] = Form.useForm();

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FileRecord | null>(null);
  const [editPdfList, setEditPdfList] = useState<UploadFile[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm] = Form.useForm();

  // ── Filtered data ───────────────────────────────────────────────────────────
  const dataSource = useMemo(() => {
    const f = appliedFilters;
    return allData.filter((r) => {
      if (searchText) {
        const q = searchText.toLowerCase();
        if (![r.fileCode, r.bkNumber, r.subject, r.creator, r.status, r.lastBorrower]
          .some((v) => v.toLowerCase().includes(q))) return false;
      }
      if (f.dateRange) {
        const d = dayjs(r.createdAt);
        if (!d.isBetween(f.dateRange[0].startOf('day'), f.dateRange[1].endOf('day'), null, '[]')) return false;
      }
      if (f.status.length && !f.status.includes(r.status)) return false;
      if (f.creator.length && !f.creator.includes(r.creator)) return false;
      return true;
    });
  }, [allData, searchText, appliedFilters]);

  const activeFilterCount = countActiveFilters(appliedFilters);

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = (key: React.Key) => {
    setAllData((prev) => prev.filter((r) => r.key !== key));
    setSelectedRowKeys((prev) => prev.filter((k) => k !== key));
    message.success('ลบข้อมูลแฟ้มเรียบร้อยแล้ว');
  };

  // ── Edit open ───────────────────────────────────────────────────────────────
  const openEdit = (record: FileRecord) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      fileCode: record.fileCode,
      bkNumber: record.bkNumber,
      subject: record.subject,
      creator: record.creator,
      status: record.status,
      lastBorrower: record.lastBorrower,
    });
    setEditPdfList(record.pdfFile ? [record.pdfFile] : []);
    setEditOpen(true);
  };

  // ── Edit submit ─────────────────────────────────────────────────────────────
  const handleEditOk = async () => {
    if (!editingRecord) return;
    try {
      const values = await editForm.validateFields();
      setEditLoading(true);
      await new Promise((r) => setTimeout(r, 300));
      setAllData((prev) =>
        prev.map((r) =>
          r.key === editingRecord.key
            ? {
                ...r,
                fileCode: values.fileCode,
                bkNumber: values.bkNumber,
                subject: values.subject,
                creator: values.creator,
                status: values.status,
                lastBorrower: values.status !== 'ถูกยืม' ? '-' : values.lastBorrower || r.lastBorrower,
                pdfFile: editPdfList[0] ?? r.pdfFile,
              }
            : r
        )
      );
      message.success('แก้ไขข้อมูลแฟ้มเรียบร้อยแล้ว');
      setEditLoading(false);
      setEditOpen(false);
      setEditingRecord(null);
    } catch {
      setEditLoading(false);
    }
  };

  // ── Add submit ──────────────────────────────────────────────────────────────
  const handleAddOk = async () => {
    try {
      const values = await addForm.validateFields();
      setAddLoading(true);
      await new Promise((r) => setTimeout(r, 300));
      const newId = allData.length > 0 ? Math.max(...allData.map((r) => r.id)) + 1 : 1;
      setAllData((prev) => [
        ...prev,
        {
          key: String(newId), id: newId,
          fileCode: values.fileCode, bkNumber: values.bkNumber,
          subject: values.subject,
          createdAt: new Date().toISOString().split('T')[0],
          creator: values.creator,
          status: 'ว่าง', lastBorrower: '-',
          pdfFile: addPdfList[0] ?? undefined,
        },
      ]);
      message.success('เพิ่มข้อมูลแฟ้มเรียบร้อยแล้ว');
      setAddLoading(false);
      setAddOpen(false);
      addForm.resetFields();
      setAddPdfList([]);
    } catch {
      setAddLoading(false);
    }
  };

  // ── Columns ─────────────────────────────────────────────────────────────────
  const columns: ColumnsType<FileRecord> = [
    { title: 'ลำดับ', dataIndex: 'id', key: 'id', width: 70, align: 'center' },
    {
      title: 'รหัสแฟ้ม (ตู้-ชั้น-เลขแฟ้ม)', dataIndex: 'fileCode', key: 'fileCode', width: 200, align: 'center',
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: 'เลข บค.', dataIndex: 'bkNumber', key: 'bkNumber', width: 180, align: 'center',
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: 'เรื่อง', dataIndex: 'subject', key: 'subject', ellipsis: true,
      render: (t) => <span title={t}>{t}</span>,
    },
    { title: 'วันที่สร้าง', dataIndex: 'createdAt', key: 'createdAt', width: 120, align: 'center' },
    {
      title: 'ผู้ตั้งแฟ้ม', dataIndex: 'creator', key: 'creator', align: 'center',
      render: (t) => <Space><UserOutlined style={{ color: '#bfbfbf' }} />{t}</Space>,
    },
    {
      title: 'สถานะ', key: 'status', width: 160, align: 'center',
      render: (_: unknown, r: FileRecord) => {
        const colorMap: Record<string, string> = { 'ว่าง': 'green', 'ถูกยืม': 'orange', 'ดำเนินการ': 'blue' };
        return (
          <Space direction="vertical" size={2}>
            <Tag color={colorMap[r.status] ?? 'default'}>{r.status}</Tag>
            {r.status === 'ถูกยืม' && r.lastBorrower !== '-' && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                <UserOutlined style={{ marginRight: 4 }} />{r.lastBorrower}
              </Text>
            )}
          </Space>
        );
      },
    },
    {
      title: 'ไฟล์เอกสาร', key: 'fileDoc', width: 100, align: 'center',
      render: (_: unknown, r: FileRecord) => (
        <Button type="text"
          icon={<FileTextOutlined style={{ fontSize: 20, color: '#E53935' }} />}
          onClick={() => {
            if (r.pdfFile?.originFileObj) {
              window.open(URL.createObjectURL(r.pdfFile.originFileObj as Blob), '_blank');
            } else {
              window.open(`/files/pdf/${encodeURIComponent(r.bkNumber)}.pdf`, '_blank');
            }
          }}
        />
      ),
    },
    // ── Action column ─────────────────────────────────────────────────────────
    {
      title: 'Action',
      key: 'action',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_: unknown, record: FileRecord) => (
        <Space size={4}>
          <Tooltip title="แก้ไข">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#1677ff' }} />}
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Tooltip title="ลบ">
            <Popconfirm
              title="ยืนยันการลบ"
              description={`ต้องการลบแฟ้ม "${record.fileCode}" ใช่หรือไม่?`}
              okText="ลบ"
              cancelText="ยกเลิก"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.key)}
            >
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // ── Active filter tags ──────────────────────────────────────────────────────
  const ActiveFilterTags: React.FC = () => {
    if (activeFilterCount === 0) return null;
    const f = appliedFilters;
    return (
      <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>กรองโดย:</Text>
        {f.dateRange && (
          <Tag closable color="blue" onClose={() => setAppliedFilters((p) => ({ ...p, dateRange: null }))}>
            {f.dateRange[0].format('DD/MM/YYYY')} – {f.dateRange[1].format('DD/MM/YYYY')}
          </Tag>
        )}
        {f.status.map((s) => (
          <Tag key={s} closable color="orange"
            onClose={() => setAppliedFilters((p) => ({ ...p, status: p.status.filter((x) => x !== s) }))}>
            {s}
          </Tag>
        ))}
        {f.creator.map((c) => (
          <Tag key={c} closable color="cyan"
            onClose={() => setAppliedFilters((p) => ({ ...p, creator: p.creator.filter((x) => x !== c) }))}>
            {c}
          </Tag>
        ))}
        <Button type="link" size="small" icon={<ClearOutlined />}
          onClick={() => { setAppliedFilters(DEFAULT_FILTERS); setDraftFilters(DEFAULT_FILTERS); }}
          style={{ padding: 0, fontSize: 12 }}>
          ล้างทั้งหมด
        </Button>
      </div>
    );
  };

  // ── Shared PDF upload props ─────────────────────────────────────────────────
  const makePdfUploadProps = (
    fileList: UploadFile[],
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>
  ) => ({
    name: 'pdf',
    accept: '.pdf',
    maxCount: 1 as const,
    fileList,
    beforeUpload: (file: File) => {
      if (file.type !== 'application/pdf') { message.error('อัพโหลดได้เฉพาะไฟล์ PDF เท่านั้น'); return Upload.LIST_IGNORE; }
      if (file.size / 1024 / 1024 > 20) { message.error('ขนาดไฟล์ต้องไม่เกิน 20 MB'); return Upload.LIST_IGNORE; }
      setFileList([{ uid: (file as UploadFile).uid ?? '-1', name: file.name, status: 'done', originFileObj: file as UploadFile['originFileObj'] }]);
      return false;
    },
    onRemove: () => setFileList([]),
  });

  // ── Shared form fields (reused in add + edit) ───────────────────────────────
  const renderFormFields = (showStatus = false) => (
    <>
      <Space style={{ display: 'flex', gap: 12 }} align="start">
        <Form.Item name="fileCode" label="รหัสแฟ้ม (ตู้-ชั้น-เลขแฟ้ม)"
          rules={[{ required: true, message: 'กรุณากรอกรหัสแฟ้ม' }]}
          style={{ flex: 1, marginBottom: 0 }}>
          <Input placeholder="เช่น A-2-005" />
        </Form.Item>
        <Form.Item name="bkNumber" label="เลข บค."
          rules={[{ required: true, message: 'กรุณากรอกเลข บค.' }]}
          style={{ flex: 1, marginBottom: 0 }}>
          <Input placeholder="เช่น สธ 0101/2567/010" />
        </Form.Item>
      </Space>

      <div style={{ marginTop: 16 }} />

      <Form.Item name="subject" label="เรื่อง"
        rules={[{ required: true, message: 'กรุณากรอกเรื่อง' }]}>
        <Input.TextArea rows={3} placeholder="ระบุเรื่องของแฟ้มเอกสาร" />
      </Form.Item>

      <Space style={{ display: 'flex', gap: 12 }} align="start">
        <Form.Item name="creator" label="ผู้ตั้งแฟ้ม"
          rules={[{ required: true, message: 'กรุณาเลือกผู้ตั้งแฟ้ม' }]}
          style={{ flex: 1, marginBottom: 0 }}>
          <Select placeholder="เลือกผู้ตั้งแฟ้ม" showSearch>
            {CREATORS.map((c) => (
              <Option key={c} value={c}>
                <UserOutlined style={{ marginRight: 6, color: '#bfbfbf' }} />{c}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Space>

      {showStatus && (
        <>
          <div style={{ marginTop: 16 }} />
          <Form.Item name="status" label="สถานะ"
            rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}>
            <Select placeholder="เลือกสถานะ">
              {STATUS_OPTIONS.map((s) => {
                const colorMap: Record<string, string> = { 'ว่าง': 'green', 'ถูกยืม': 'orange', 'ดำเนินการ': 'blue' };
                return (
                  <Option key={s} value={s}>
                    <Tag color={colorMap[s]} style={{ margin: 0 }}>{s}</Tag>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </>
      )}
    </>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1677ff', borderRadius: 8 } }}>
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Content style={{ padding: '24px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Breadcrumb style={{ marginBottom: 16 }}>
              <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
            </Breadcrumb>

            <Card bordered={false} style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
              {/* Header */}
              <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <Title level={3} style={{ marginBottom: 8 }}>รายละเอียดข้อมูลแฟ้ม</Title>
                  <Text type="secondary">จัดการและค้นหาข้อมูลแฟ้มเอกสารในระบบสารบรรณอิเล็กทรอนิกส์</Text>
                </div>
                <Space>
                  <Button icon={<PlusOutlined />} type="primary" onClick={() => { addForm.resetFields(); setAddPdfList([]); setAddOpen(true); }}>
                    เพิ่มข้อมูลแฟ้ม
                  </Button>
                  <Badge count={activeFilterCount} size="small">
                    <Button icon={<FilterOutlined />} onClick={() => { setDraftFilters({ ...appliedFilters }); setFilterOpen(true); }}
                      type={activeFilterCount > 0 ? 'primary' : 'default'} ghost={activeFilterCount > 0}>
                      ตัวกรอง
                    </Button>
                  </Badge>
                </Space>
              </div>

              {/* Search */}
              <div style={{ marginBottom: 12, background: '#fafafa', padding: 16, borderRadius: 8 }}>
                <Input
                  placeholder="ค้นหาด้วยเลขหนังสือ, ชื่อเรื่อง, ผู้สร้าง หรือสถานะ..."
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  size="large" allowClear value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ maxWidth: 500 }}
                />
              </div>

              <ActiveFilterTags />

              {selectedRowKeys.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <Tag color="blue">เลือกแล้ว {selectedRowKeys.length} รายการ</Tag>
                  <Button type="link" size="small" onClick={() => setSelectedRowKeys([])}>ล้างการเลือก</Button>
                </div>
              )}

              <Table
                rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
                columns={columns}
                dataSource={dataSource}
                rowKey="key"
                scroll={{ x: 'max-content' }}
                pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `ทั้งหมด ${t} รายการ` }}
                locale={{ emptyText: 'ไม่พบข้อมูลที่ตรงเงื่อนไข' }}
              />
            </Card>
          </div>
        </Content>
      </Layout>

      {/* ════ Modal: ตัวกรอง ════════════════════════════════════════════════════ */}
      <Modal
        title={<Space><FilterOutlined />ตัวกรองข้อมูล</Space>}
        open={filterOpen}
        onCancel={() => setFilterOpen(false)}
        width={520}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button icon={<ClearOutlined />} danger
              onClick={() => setDraftFilters(DEFAULT_FILTERS)}>
              รีเซ็ต
            </Button>
            <Space>
              <Button onClick={() => setFilterOpen(false)}>ยกเลิก</Button>
              <Button type="primary" onClick={() => { setAppliedFilters({ ...draftFilters }); setFilterOpen(false); }}>
                นำตัวกรองไปใช้
              </Button>
            </Space>
          </div>
        }
      >
        <div style={{ marginTop: 8 }}>
          <div style={{ marginBottom: 20 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>ช่วงวันที่สร้าง</Text>
            <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY"
              placeholder={['วันที่เริ่มต้น', 'วันที่สิ้นสุด']}
              value={draftFilters.dateRange as [Dayjs, Dayjs] | null}
              onChange={(dates) => setDraftFilters((p) => ({ ...p, dateRange: dates ? [dates[0]!, dates[1]!] : null }))}
              allowClear />
          </div>
          <Divider style={{ margin: '0 0 20px' }} />
          <div style={{ marginBottom: 20 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>สถานะ</Text>
            <Select mode="multiple" style={{ width: '100%' }} placeholder="เลือกสถานะ"
              value={draftFilters.status} onChange={(v) => setDraftFilters((p) => ({ ...p, status: v }))} allowClear>
              {STATUS_OPTIONS.map((s) => {
                const colorMap: Record<string, string> = { 'ว่าง': 'green', 'ถูกยืม': 'orange', 'ดำเนินการ': 'blue' };
                return <Option key={s} value={s}><Tag color={colorMap[s]} style={{ margin: 0 }}>{s}</Tag></Option>;
              })}
            </Select>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>ผู้ตั้งแฟ้ม</Text>
            <Select mode="multiple" style={{ width: '100%' }} placeholder="เลือกผู้ตั้งแฟ้ม"
              value={draftFilters.creator} onChange={(v) => setDraftFilters((p) => ({ ...p, creator: v }))}
              allowClear showSearch>
              {CREATORS.map((c) => (
                <Option key={c} value={c}><UserOutlined style={{ marginRight: 6, color: '#bfbfbf' }} />{c}</Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>

      {/* ════ Modal: เพิ่มข้อมูลแฟ้ม ════════════════════════════════════════════ */}
      <Modal
        title="เพิ่มข้อมูลแฟ้มใหม่"
        open={addOpen} onOk={handleAddOk} onCancel={() => setAddOpen(false)}
        okText="บันทึก" cancelText="ยกเลิก"
        confirmLoading={addLoading} width={560} destroyOnClose
      >
        <Form form={addForm} layout="vertical" requiredMark="optional" style={{ marginTop: 16 }}>
          {renderFormFields(false)}
          <div style={{ marginTop: 16 }} />
          <Form.Item label="ไฟล์เอกสาร (PDF)">
            <Dragger {...makePdfUploadProps(addPdfList, setAddPdfList)}>
              <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: '#1677ff' }} /></p>
              <p className="ant-upload-text">คลิกหรือลากไฟล์ PDF มาวางที่นี่</p>
              <p className="ant-upload-hint" style={{ fontSize: 12 }}>รองรับเฉพาะ .pdf ขนาดไม่เกิน 20 MB</p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* ════ Modal: แก้ไขข้อมูลแฟ้ม ════════════════════════════════════════════ */}
      <Modal
        title={
          <Space>
            <EditOutlined style={{ color: '#1677ff' }} />
            แก้ไขข้อมูลแฟ้ม
            {editingRecord && <Text type="secondary" style={{ fontSize: 13 }}>({editingRecord.fileCode})</Text>}
          </Space>
        }
        open={editOpen} onOk={handleEditOk} onCancel={() => { setEditOpen(false); setEditingRecord(null); }}
        okText="บันทึกการแก้ไข" cancelText="ยกเลิก"
        confirmLoading={editLoading} width={560} destroyOnClose
      >
        <Form form={editForm} layout="vertical" requiredMark="optional" style={{ marginTop: 16 }}>
          {renderFormFields(true)}
          <div style={{ marginTop: 16 }} />
          <Form.Item label="ไฟล์เอกสาร (PDF)">
            <Dragger {...makePdfUploadProps(editPdfList, setEditPdfList)}>
              <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: '#1677ff' }} /></p>
              <p className="ant-upload-text">คลิกหรือลากไฟล์ PDF มาแทนที่ไฟล์เดิม</p>
              <p className="ant-upload-hint" style={{ fontSize: 12 }}>รองรับเฉพาะ .pdf ขนาดไม่เกิน 20 MB</p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>

    </ConfigProvider>
  );
};

export default App;