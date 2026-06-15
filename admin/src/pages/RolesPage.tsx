import { useMemo, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  Typography,
  Modal,
  Form,
  Tag,
  Collapse,
  Switch,
  Checkbox,
  Empty,
  Spin,
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
import { fetchList, fetchOne, mutate } from '../api/client';
import {
  Permission,
  Role,
  methodTag,
  SYSTEM_MODULES,
} from '../rbac/constants';

const dateRender = (v: any) => (v ? dayjs(v).format('DD/MM/YYYY') : '—');

const ROLE_COLOR: Record<string, string> = {
  admin: 'red',
  member: 'blue',
  user: 'blue',
};

/** Cây phân nhóm: System Module → Module → quyền */
interface ModuleGroup {
  module: string;
  permissions: Permission[];
}
interface SystemGroup {
  value: string;
  label: string;
  color: string;
  modules: ModuleGroup[];
}

function buildTree(perms: Permission[]): SystemGroup[] {
  return SYSTEM_MODULES.map((sm) => {
    const inSystem = perms.filter((p) => p.system_module === sm.value);
    const byModule = new Map<string, Permission[]>();
    inSystem.forEach((p) => {
      const arr = byModule.get(p.module) ?? [];
      arr.push(p);
      byModule.set(p.module, arr);
    });
    return {
      value: sm.value,
      label: sm.label,
      color: sm.color,
      modules: Array.from(byModule.entries()).map(([module, permissions]) => ({
        module,
        permissions,
      })),
    };
  }).filter((g) => g.modules.length > 0);
}

export default function RolesPage() {
  const { message } = AntApp.useApp();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [form] = Form.useForm();

  const params = useMemo(() => {
    const p: Record<string, any> = { page, limit: pageSize };
    if (search) p.search = search;
    return p;
  }, [page, pageSize, search]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['rbac-roles', params],
    queryFn: () => fetchList<Role>('/rbac/roles', params),
  });

  // Toàn bộ quyền để dựng cây toggle trong modal
  const { data: permData } = useQuery({
    queryKey: ['rbac-permissions-all'],
    queryFn: () => fetchList<Permission>('/rbac/permissions', { limit: 1000 }),
  });
  const allPermissions = permData?.rows ?? [];
  const tree = useMemo(() => buildTree(allPermissions), [allPermissions]);

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  function setMany(ids: number[], checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  }

  function openCreate() {
    setEditing(null);
    form.resetFields();
    setSelected(new Set());
    setOpen(true);
  }

  async function openEdit(record: Role) {
    setEditing(record);
    form.setFieldsValue({ name: record.name, description: record.description });
    setOpen(true);
    setLoadingDetail(true);
    try {
      const detail = await fetchOne<Role>(`/rbac/roles/${record.id}`);
      setSelected(new Set(detail.permission_ids ?? []));
    } catch {
      message.error('Không tải được chi tiết vai trò');
      setSelected(new Set());
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleSubmit() {
    const values = await form.validateFields();
    const payload = { ...values, permission_ids: Array.from(selected) };
    setSaving(true);
    try {
      if (editing) {
        await mutate('put', `/rbac/roles/${editing.id}`, payload);
        message.success('Đã cập nhật vai trò');
      } else {
        await mutate('post', '/rbac/roles', payload);
        message.success('Đã thêm vai trò');
      }
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['rbac-roles'] });
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(record: Role) {
    try {
      await mutate('delete', `/rbac/roles/${record.id}`);
      message.success('Đã xoá');
      queryClient.invalidateQueries({ queryKey: ['rbac-roles'] });
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Xoá thất bại');
    }
  }

  const totalPerms = allPermissions.length;
  const selectedCount = selected.size;

  const columns: ColumnsType<Role> = [
    {
      title: 'Tên role',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (v: string) => <Tag color={ROLE_COLOR[v] ?? 'default'}>{v}</Tag>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 220,
      render: (v: string) => v || '—',
    },
    {
      title: 'Modules',
      dataIndex: 'modules',
      key: 'modules',
      render: (mods: string[]) =>
        mods?.length ? (
          <Space size={[4, 4]} wrap>
            {mods.map((m) => (
              <Tag key={m} color="cyan">
                {m}
              </Tag>
            ))}
          </Space>
        ) : (
          '—'
        ),
    },
    {
      title: 'Quyền hạn',
      dataIndex: 'permission_count',
      key: 'permission_count',
      width: 110,
      render: (v: number) => <Tag color="green">{v} quyền</Tag>,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 130,
      render: dateRender,
    },
    {
      title: 'Người tạo',
      dataIndex: 'created_by',
      key: 'created_by',
      width: 110,
      render: (v: string) => v || '—',
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'updated_by',
      key: 'updated_by',
      width: 120,
      render: (v: string) => v || '—',
    },
    {
      title: 'Thao tác',
      key: '__actions',
      fixed: 'right',
      width: 100,
      render: (_: any, record: Role) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Xoá vai trò này?"
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
        Vai trò
      </Typography.Title>
      <Typography.Text type="secondary">
        Quản lý vai trò người dùng
      </Typography.Text>

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
          Thêm vai trò
        </Button>
        <Space wrap>
          <Input.Search
            allowClear
            placeholder="Tìm theo tên / mã vai trò"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
            style={{ width: 260 }}
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
        title={editing ? 'Cập nhật Vai trò' : 'Thêm Vai trò'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        okText="Đồng ý"
        cancelText="Huỷ"
        width={760}
        destroyOnClose
      >
        <Form form={form} layout="vertical" requiredMark>
          <Form.Item
            name="name"
            label="Tên vai trò"
            rules={[{ required: true, message: 'Nhập tên vai trò' }]}
          >
            <Input placeholder="Vd: editor" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input placeholder="Mô tả ngắn về vai trò" />
          </Form.Item>
        </Form>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Typography.Text strong>Quyền truy cập</Typography.Text>
          <Space>
            <Typography.Text type="secondary">
              {selectedCount}/{totalPerms}
            </Typography.Text>
            <Checkbox
              checked={totalPerms > 0 && selectedCount === totalPerms}
              indeterminate={selectedCount > 0 && selectedCount < totalPerms}
              onChange={(e) =>
                setMany(
                  allPermissions.map((p) => p.id),
                  e.target.checked,
                )
              }
            >
              Chọn tất cả
            </Checkbox>
          </Space>
        </div>

        <Spin spinning={loadingDetail}>
          {tree.length === 0 ? (
            <Empty description="Chưa có quyền nào" />
          ) : (
            <Collapse
              defaultActiveKey={tree.map((t) => t.value)}
              items={tree.map((sys) => {
                const sysIds = sys.modules.flatMap((m) =>
                  m.permissions.map((p) => p.id),
                );
                const sysSelected = sysIds.filter((id) =>
                  selected.has(id),
                ).length;
                return {
                  key: sys.value,
                  label: (
                    <Space>
                      <Tag color={sys.color}>{sys.label}</Tag>
                      <Typography.Text type="secondary">
                        {sysSelected}/{sysIds.length}
                      </Typography.Text>
                    </Space>
                  ),
                  extra: (
                    <Checkbox
                      checked={
                        sysIds.length > 0 && sysSelected === sysIds.length
                      }
                      indeterminate={
                        sysSelected > 0 && sysSelected < sysIds.length
                      }
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setMany(sysIds, e.target.checked)}
                    >
                      Chọn tất cả
                    </Checkbox>
                  ),
                  children: (
                    <Space
                      direction="vertical"
                      size={12}
                      style={{ width: '100%' }}
                    >
                      {sys.modules.map((mod) => {
                        const modIds = mod.permissions.map((p) => p.id);
                        const modSelected = modIds.filter((id) =>
                          selected.has(id),
                        ).length;
                        return (
                          <div
                            key={mod.module}
                            style={{
                              border: '1px solid #f0f0f0',
                              borderRadius: 8,
                              padding: 12,
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 8,
                              }}
                            >
                              <Tag color="purple">{mod.module}</Tag>
                              <Checkbox
                                checked={
                                  modIds.length > 0 &&
                                  modSelected === modIds.length
                                }
                                indeterminate={
                                  modSelected > 0 &&
                                  modSelected < modIds.length
                                }
                                onChange={(e) =>
                                  setMany(modIds, e.target.checked)
                                }
                              >
                                Chọn tất cả
                              </Checkbox>
                            </div>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 8,
                              }}
                            >
                              {mod.permissions.map((p) => (
                                <div
                                  key={p.id}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 8,
                                    border: '1px solid #fafafa',
                                    background: '#fafafa',
                                    borderRadius: 6,
                                    padding: '6px 10px',
                                  }}
                                >
                                  <Space size={6} wrap>
                                    {methodTag(p.method)}
                                    <span>{p.name}</span>
                                  </Space>
                                  <Switch
                                    size="small"
                                    checked={selected.has(p.id)}
                                    onChange={(checked) =>
                                      setMany([p.id], checked)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </Space>
                  ),
                };
              })}
            />
          )}
        </Spin>
      </Modal>
    </div>
  );
}
