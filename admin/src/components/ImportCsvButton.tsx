import { useState } from 'react';
import {
  Button,
  Modal,
  Upload,
  Space,
  Typography,
  Alert,
  Table,
  App as AntApp,
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { mutate } from '../api/client';
import { ImportConfig } from '../resources/types';
import {
  parseCsv,
  csvToObjects,
  toCsv,
  downloadFile,
  decodeCsvBuffer,
} from '../lib/csv';

interface ImportResult {
  total: number;
  created: number;
  failed: number;
  errors: { row: number; title: string; message: string }[];
}

export default function ImportCsvButton({
  config,
  resourceKey,
}: {
  config: ImportConfig;
  resourceKey: string;
}) {
  const { message } = AntApp.useApp();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const allowedKeys = config.columns.map((c) => c.key);

  function reset() {
    setRows([]);
    setFileName('');
    setResult(null);
  }

  function downloadTemplate() {
    const headers = config.columns.map((c) => c.key);
    const sample = [config.columns.map((c) => c.sample)];
    downloadFile(config.templateName, toCsv(headers, sample));
  }

  function handleFile(file: File): boolean {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = decodeCsvBuffer(reader.result as ArrayBuffer);
        const objs = csvToObjects(parseCsv(text)).map((o) => {
          // chỉ giữ các cột hợp lệ
          const clean: Record<string, string> = {};
          allowedKeys.forEach((k) => {
            if (o[k] !== undefined) clean[k] = o[k];
          });
          return clean;
        });
        setRows(objs);
        setFileName(file.name);
        setResult(null);
        if (objs.length === 0) {
          message.warning('Không đọc được dòng dữ liệu nào trong file.');
        }
      } catch {
        message.error('Không đọc được file CSV.');
      }
    };
    reader.readAsArrayBuffer(file);
    return false; // chặn Upload tự gửi
  }

  async function submit() {
    if (rows.length === 0) return;
    setSubmitting(true);
    try {
      const data = (await mutate('post', config.endpoint, { rows })) as ImportResult;
      setResult(data);
      queryClient.invalidateQueries({ queryKey: [resourceKey] });
      if (data.failed === 0) {
        message.success(`Đã nhập ${data.created} bài thơ`);
      } else {
        message.warning(
          `Nhập ${data.created}/${data.total} dòng, ${data.failed} dòng lỗi`,
        );
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Nhập thất bại');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button icon={<DownloadOutlined />} onClick={downloadTemplate}>
        Tải file mẫu
      </Button>
      <Button
        icon={<UploadOutlined />}
        onClick={() => {
          reset();
          setOpen(true);
        }}
      >
        Nhập CSV
      </Button>

      <Modal
        title="Nhập bài thơ từ CSV"
        open={open}
        onCancel={() => setOpen(false)}
        width={680}
        destroyOnClose
        footer={[
          <Button key="tpl" icon={<DownloadOutlined />} onClick={downloadTemplate}>
            Tải file mẫu
          </Button>,
          <Button key="close" onClick={() => setOpen(false)}>
            Đóng
          </Button>,
          <Button
            key="run"
            type="primary"
            loading={submitting}
            disabled={rows.length === 0}
            onClick={submit}
          >
            Bắt đầu nhập {rows.length > 0 ? `(${rows.length} dòng)` : ''}
          </Button>,
        ]}
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Alert
            type="info"
            showIcon
            message="Các cột"
            description={
              <span>
                {config.columns.map((c) => (
                  <div key={c.key}>
                    <Typography.Text code>{c.key}</Typography.Text> — {c.label}
                  </div>
                ))}
              </span>
            }
          />

          <Upload.Dragger
            accept=".csv,text/csv"
            multiple={false}
            maxCount={1}
            beforeUpload={handleFile}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Kéo thả hoặc bấm chọn file CSV
            </p>
          </Upload.Dragger>

          {fileName && (
            <Typography.Text type="secondary">
              Đã đọc <b>{rows.length}</b> dòng từ <b>{fileName}</b>
            </Typography.Text>
          )}

          {result && (
            <>
              <Alert
                type={result.failed === 0 ? 'success' : 'warning'}
                showIcon
                message={`Nhập ${result.created}/${result.total} bài thơ thành công${
                  result.failed ? `, ${result.failed} dòng lỗi` : ''
                }`}
              />
              {result.errors.length > 0 && (
                <Table
                  size="small"
                  rowKey={(r) => `${r.row}`}
                  dataSource={result.errors}
                  pagination={false}
                  scroll={{ y: 200 }}
                  columns={[
                    { title: 'Dòng', dataIndex: 'row', width: 70 },
                    { title: 'Tiêu đề', dataIndex: 'title', ellipsis: true },
                    { title: 'Lỗi', dataIndex: 'message' },
                  ]}
                />
              )}
            </>
          )}
        </Space>
      </Modal>
    </>
  );
}
