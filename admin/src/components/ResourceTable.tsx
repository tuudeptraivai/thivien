import { useMemo, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  Select,
  Alert,
  App as AntApp,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchList, mutate } from '../api/client';
import { ResourceConfig } from '../resources/types';
import ResourceForm from './ResourceForm';
import ImportCsvButton from './ImportCsvButton';

export default function ResourceTable({
  resource,
}: {
  resource: ResourceConfig;
}) {
  const { message } = AntApp.useApp();
  const queryClient = useQueryClient();
  const idField = resource.idField ?? 'id';

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const params = useMemo(() => {
    const p: Record<string, any> = { ...(resource.listParams ?? {}) };
    if (resource.serverPagination) {
      p.page = page;
      p.limit = pageSize;
    } else {
      p.limit = 1000;
    }
    if (resource.searchable && search) p.search = search;
    Object.entries(filterValues).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') p[k] = v;
    });
    return p;
  }, [resource, page, pageSize, search, filterValues]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: [resource.key, params],
    queryFn: () => fetchList(resource.list, params),
  });

  const rows = data?.rows ?? [];
  const total = resource.serverPagination
    ? data?.total ?? 0
    : rows.length;

  async function handleDelete(record: any) {
    if (!resource.remove) return;
    try {
      await mutate('delete', resource.remove(record[idField]));
      message.success('Đã xoá');
      queryClient.invalidateQueries({ queryKey: [resource.key] });
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Xoá thất bại');
    }
  }

  async function runRowAction(action: NonNullable<ResourceConfig['rowActions']>[number], record: any) {
    try {
      const req = action.request(record);
      await mutate(req.method, req.url, req.body);
      message.success('Thành công');
      queryClient.invalidateQueries({ queryKey: [resource.key] });
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Thao tác thất bại');
    }
  }

  const columns: ColumnsType<any> = useMemo(() => {
    const cols: ColumnsType<any> = resource.fields
      .filter((f) => f.inTable !== false)
      .map((f) => ({
        title: f.label,
        dataIndex: f.name,
        key: f.name,
        width: f.width,
        ellipsis: f.ellipsis,
        render: f.render
          ? (value: any, record: any) => f.render!(value, record)
          : undefined,
      }));

    const hasActions =
      resource.update || resource.remove || (resource.rowActions?.length ?? 0) > 0;

    if (hasActions) {
      cols.push({
        title: 'Thao tác',
        key: '__actions',
        fixed: 'right',
        width: 90 + (resource.rowActions?.length ?? 0) * 70,
        render: (_: any, record: any) => (
          <Space size="small" wrap>
            {resource.update && (
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditing(record);
                  setFormOpen(true);
                }}
              />
            )}
            {resource.rowActions?.map((action) => (
              <Popconfirm
                key={action.key}
                title={action.confirm ?? 'Xác nhận?'}
                onConfirm={() => runRowAction(action, record)}
                okText="Đồng ý"
                cancelText="Huỷ"
                disabled={!action.confirm}
              >
                <Button
                  size="small"
                  danger={action.danger}
                  onClick={
                    action.confirm
                      ? undefined
                      : () => runRowAction(action, record)
                  }
                >
                  {action.label}
                </Button>
              </Popconfirm>
            ))}
            {resource.remove && (
              <Popconfirm
                title="Xoá mục này?"
                onConfirm={() => handleDelete(record)}
                okText="Xoá"
                okButtonProps={{ danger: true }}
                cancelText="Huỷ"
              >
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
          </Space>
        ),
      });
    }
    return cols;
  }, [resource]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          {resource.title}
        </Typography.Title>
        <Space wrap>
          {resource.searchable && (
            <Input.Search
              allowClear
              placeholder="Tìm kiếm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onSearch={(v) => {
                setSearch(v);
                setPage(1);
              }}
              style={{ width: 240 }}
            />
          )}
          {resource.filters?.map((filter) => (
            <Select
              key={filter.name}
              allowClear
              placeholder={filter.label}
              style={{ width: 180 }}
              options={filter.options}
              value={filterValues[filter.name]}
              onChange={(v) => {
                setFilterValues((prev) => ({ ...prev, [filter.name]: v }));
                setPage(1);
              }}
            />
          ))}
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Tải lại
          </Button>
          {resource.import && (
            <ImportCsvButton
              config={resource.import}
              resourceKey={resource.key}
            />
          )}
          {resource.create && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              Thêm
            </Button>
          )}
        </Space>
      </div>

      {resource.note && (
        <Alert
          type="info"
          showIcon
          message={resource.note}
          style={{ marginBottom: 16 }}
        />
      )}

      <Table
        rowKey={idField}
        columns={columns}
        dataSource={rows}
        loading={isFetching}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `Tổng ${t} mục`,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
      />

      <ResourceForm
        resource={resource}
        open={formOpen}
        record={editing}
        onClose={() => setFormOpen(false)}
      />
    </div>
  );
}
