import { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Spin,
  App as AntApp,
} from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchList, mutate } from '../api/client';
import { FieldConfig, ResourceConfig, SelectOption } from '../resources/types';
import { REFERENCES } from '../resources/references';

interface Props {
  resource: ResourceConfig;
  open: boolean;
  record: any | null; // null = tạo mới
  onClose: () => void;
}

function useReferenceOptions(fields: FieldConfig[]) {
  // Gom các resource tham chiếu cần nạp
  const refKeys = Array.from(
    new Set(
      fields
        .filter((f) => f.type === 'select' && f.optionsResource)
        .map((f) => f.optionsResource as string),
    ),
  );

  return useQuery({
    queryKey: ['references', refKeys],
    enabled: refKeys.length > 0,
    queryFn: async () => {
      const result: Record<string, SelectOption[]> = {};
      await Promise.all(
        refKeys.map(async (key) => {
          const ref = REFERENCES[key];
          if (!ref) {
            result[key] = [];
            return;
          }
          const { rows } = await fetchList(ref.url);
          result[key] = rows.map((r: any) => ({
            label: ref.label(r),
            value: ref.value ? ref.value(r) : r.id,
          }));
        }),
      );
      return result;
    },
  });
}

export default function ResourceForm({
  resource,
  open,
  record,
  onClose,
}: Props) {
  const [form] = Form.useForm();
  const { message } = AntApp.useApp();
  const queryClient = useQueryClient();
  const isEdit = !!record;
  const idField = resource.idField ?? 'id';

  const { data: refOptions, isLoading: refLoading } = useReferenceOptions(
    resource.fields,
  );

  useEffect(() => {
    if (!open) return;
    if (record) {
      const init = resource.toForm ? resource.toForm(record) : record;
      form.setFieldsValue(init);
    } else {
      form.resetFields();
    }
  }, [open, record]);

  const formFields = resource.fields.filter((f) => {
    if (f.inForm === false) return false;
    if (isEdit && f.editable === false) return false;
    if (!isEdit && f.creatable === false) return false;
    return true;
  });

  async function handleOk() {
    let values: any;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }
    const payload = resource.toPayload
      ? resource.toPayload(values, isEdit ? 'update' : 'create')
      : values;

    try {
      if (isEdit) {
        if (!resource.update) return;
        await mutate(
          resource.updateMethod ?? 'put',
          resource.update(record[idField]),
          payload,
        );
        message.success('Cập nhật thành công');
      } else {
        if (!resource.create) return;
        await mutate('post', resource.create, payload);
        message.success('Tạo mới thành công');
      }
      queryClient.invalidateQueries({ queryKey: [resource.key] });
      onClose();
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || err?.message || 'Thao tác thất bại',
      );
    }
  }

  function renderInput(field: FieldConfig) {
    switch (field.type) {
      case 'textarea':
        return <Input.TextArea rows={4} placeholder={field.placeholder} />;
      case 'number':
        return <InputNumber style={{ width: '100%' }} placeholder={field.placeholder} />;
      case 'password':
        return <Input.Password placeholder={field.placeholder} />;
      case 'switch':
        return <Switch />;
      case 'select':
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder={field.placeholder}
            options={
              field.options ??
              (field.optionsResource ? refOptions?.[field.optionsResource] : []) ??
              []
            }
            loading={!!field.optionsResource && refLoading}
          />
        );
      default:
        return <Input placeholder={field.placeholder} />;
    }
  }

  return (
    <Modal
      open={open}
      title={`${isEdit ? 'Sửa' : 'Thêm'} · ${resource.title}`}
      onOk={handleOk}
      onCancel={onClose}
      okText={isEdit ? 'Lưu' : 'Tạo'}
      cancelText="Huỷ"
      width={640}
      destroyOnClose
    >
      <Spin spinning={refLoading}>
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          {formFields.map((field) => {
            const required =
              field.required || (!isEdit && field.requiredOnCreate);
            return (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                valuePropName={field.type === 'switch' ? 'checked' : 'value'}
                rules={
                  required
                    ? [{ required: true, message: `Nhập ${field.label.toLowerCase()}` }]
                    : undefined
                }
              >
                {renderInput(field)}
              </Form.Item>
            );
          })}
        </Form>
      </Spin>
    </Modal>
  );
}
