import { useMemo, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Popconfirm,
  Typography,
  Modal,
  Form,
  App as AntApp,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchList, mutate } from '../api/client';
import {
  Permission,
  methodTag,
  systemModuleTag,
  METHOD_OPTIONS,
  SYSTEM_MODULE_OPTIONS,
} from '../rbac/constants';

const dateRender = (v: any) => (v ? dayjs(v).format('DD/MM/YYYY') : '—');

export default function PermissionsPage() {
  const { message } = AntApp.useApp();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [systemModule, setSystemModule] = useState<string | undefined>();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Permission | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const params = useMemo(() => {
    const p: Record<string, any> = { page, limit: pageSize };
    if (search) p.search = search;
    if (systemModule) p.system_module = systemModule;
    return p;
  }, [page, pageSize, search, systemModule]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['rbac-permissions', params],
    queryFn: () => fetchList<Permission>('/rbac/permissions', params),
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  function openCreate() {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ method: 'GET', system_module: 'BUSINESS' });
    setOpen(true);
  }

  function openEdit(record: Permission) {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  }

  async function handleSubmit() {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing) {
        await mutate('put', `/rbac/permissions/${editing.id}`, values);
        message.success('Đã cập nhật quyền');
      } else {
        await mutate('post', '/rbac/permissions', values);
        message.success('Đã thêm quyền');
      }
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['rbac-permissions'] });
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(record: Permission) {
    try {
      await mutate('delete', `/rbac/permissions/${record.id}`);
      message.success('Đã xoá');
      queryClient.invalidateQueries({ queryKey: ['rbac-permissions'] });
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Xoá thất bại');
    }
  }

  const columns: ColumnsType<Permission> = [
    { title: 'Tên quyền', dataIndex: 'name', key: 'name' },
    {
      title: 'API Path',
      dataIndex: 'api_path',
      key: 'api_path',
      render: (v: string) => (
        <Typography.Text code>{v}</Typography.Text>
      ),
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      width: 110,
      render: methodTag,
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      render: (v: string) => <Typography.Text>{v}</Typography.Text>,
    },
    {
      title: 'System Module',
      dataIndex: 'system_module',
      key: 'system_module',
      width: 180,
      render: systemModuleTag,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 130,
      render: dateRender,
    },
    {
      title: 'Thao tác',
      key: '__actions',
      fixed: 'right',
      width: 100,
      render: (_: any, record: Permission) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Xoá quyền này?"
            onConfirm={() => handleDelete(record)}
            okText="Xoá"
            okButtonProps={{ danger: true }}
            cancelText="Huỷ"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Quyền hạn
      </Typography.Title>
      <Typography.Text type="secondary">Quản lý quyền API</Typography.Text>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '16px 0',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm quyền
        </Button>
        <Space wrap>
          <Input.Search
            allowClear
            placeholder="Tìm theo tên / apiPath / module"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
            style={{ width: 280 }}
          />
          <Select
            allowClear
            placeholder="Lọc theo System Module"
            style={{ width: 220 }}
            options={SYSTEM_MODULE_OPTIONS}
            value={systemModule}
            onChange={(v) => {
              setSystemModule(v);
              setPage(1);
            }}
          />
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Tải lại
          </Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={rows}
        loading={isFetching}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `Tổng ${t} mặt hàng`,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
      />

      <Modal
        title={editing ? 'Cập nhật Permission' : 'Thêm Permission'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        okText="Đồng ý"
        cancelText="Huỷ"
        destroyOnClose
      >
        <Form form={form} layout="vertical" requiredMark>
          <Form.Item
            name="name"
            label="Tên quyền"
            rules={[{ required: true, message: 'Nhập tên quyền' }]}
          >
            <Input placeholder="Vd: Xem danh sách thơ" />
          </Form.Item>
          <Form.Item
            name="api_path"
            label="API Path"
            rules={[{ required: true, message: 'Nhập API path' }]}
          >
            <Input placeholder="/poems" />
          </Form.Item>
          <Form.Item
            name="method"
            label="HTTP Method"
            rules={[{ required: true, message: 'Chọn method' }]}
          >
            <Select options={METHOD_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="module"
            label="Module"
            rules={[{ required: true, message: 'Nhập module' }]}
          >
            <Input placeholder="Vd: Quản lý thơ" />
          </Form.Item>
          <Form.Item
            name="system_module"
            label="System Module"
            rules={[{ required: true, message: 'Chọn system module' }]}
          >
            <Select options={SYSTEM_MODULE_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
