import { ReactNode } from 'react';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'switch'
  | 'password'
  | 'date';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType; // mặc định 'text'
  required?: boolean;
  placeholder?: string;
  /** Lựa chọn tĩnh cho select */
  options?: SelectOption[];
  /** Nạp lựa chọn từ resource tham chiếu (key trong REFERENCES) */
  optionsResource?: string;
  /** Hiển thị trong bảng (mặc định true) */
  inTable?: boolean;
  /** Hiển thị trong form (mặc định true) */
  inForm?: boolean;
  /** Có cho sửa ở form Edit (mặc định true) */
  editable?: boolean;
  /** Có ở form Create (mặc định true) */
  creatable?: boolean;
  /** Cắt ngắn cột dài */
  ellipsis?: boolean;
  width?: number;
  /** Render tuỳ biến trong bảng */
  render?: (value: any, record: any) => ReactNode;
  /** Bắt buộc chỉ khi tạo mới (vd: mật khẩu) */
  requiredOnCreate?: boolean;
}

export interface RowAction {
  key: string;
  label: string;
  /** method + url để gọi; nếu trả về undefined thì bỏ qua */
  request: (record: any) => { method: 'put' | 'post'; url: string; body?: any };
  confirm?: string;
  danger?: boolean;
}

export interface ResourceConfig {
  key: string; // dùng cho route /:key và menu
  title: string; // tên hiển thị menu/trang
  icon?: ReactNode;
  group?: string; // nhóm trong menu

  /** Endpoint danh sách (GET) */
  list: string;
  /** Gửi page/limit/search lên server (true) hay phân trang client (false) */
  serverPagination?: boolean;
  searchable?: boolean;
  /** Tham số cố định gắn vào mọi request list */
  listParams?: Record<string, any>;
  /** Bộ lọc bổ sung hiển thị trên thanh công cụ */
  filters?: {
    name: string;
    label: string;
    options: SelectOption[];
  }[];

  /** Endpoint tạo (POST). Bỏ trống = không cho tạo */
  create?: string;
  /** Endpoint sửa (hàm theo id). Bỏ trống = không cho sửa */
  update?: (id: string | number) => string;
  updateMethod?: 'put' | 'patch';
  /** Endpoint xoá (hàm theo id). Bỏ trống = không cho xoá */
  remove?: (id: string | number) => string;

  idField?: string; // mặc định 'id'
  fields: FieldConfig[];

  /** Biến đổi values form trước khi gửi create/update */
  toPayload?: (values: any, mode: 'create' | 'update') => any;
  /** Biến đổi record từ API thành giá trị khởi tạo form Edit */
  toForm?: (record: any) => any;

  /** Hành động tuỳ biến trên mỗi dòng (vd: ghim/khoá topic) */
  rowActions?: RowAction[];

  /** Ghi chú giới hạn hiển thị đầu trang */
  note?: string;

  /** Cấu hình nhập hàng loạt từ CSV (hiện nút "Nhập CSV" + "Tải file mẫu") */
  import?: ImportConfig;
}

export interface ImportColumn {
  /** Khoá gửi lên API (cũng là tiêu đề cột trong file mẫu) */
  key: string;
  /** Mô tả ngắn cho cột */
  label: string;
  /** Giá trị ví dụ trong file mẫu */
  sample: string;
}

export interface ImportConfig {
  /** Endpoint POST nhận `{ rows: [...] }` */
  endpoint: string;
  /** Tên file mẫu khi tải về */
  templateName: string;
  /** Định nghĩa các cột CSV */
  columns: ImportColumn[];
}

/** Map resource tham chiếu → endpoint + nhãn, dùng cho các select khoá ngoại */
export interface ReferenceConfig {
  url: string;
  label: (record: any) => string;
  value?: (record: any) => string | number;
}
