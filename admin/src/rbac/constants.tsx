import { Tag } from 'antd';

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

export const METHOD_COLOR: Record<string, string> = {
  GET: 'blue',
  POST: 'green',
  PUT: 'gold',
  PATCH: 'cyan',
  DELETE: 'red',
};

export const methodTag = (v: string) => (
  <Tag color={METHOD_COLOR[v] ?? 'default'} style={{ fontWeight: 600 }}>
    {v}
  </Tag>
);

export interface SystemModuleMeta {
  value: string;
  label: string;
  color: string;
}

export const SYSTEM_MODULES: SystemModuleMeta[] = [
  { value: 'BUSINESS', label: 'BUSINESS', color: 'cyan' },
  { value: 'SYSTEM_MANAGEMENT', label: 'SYSTEM_MANAGEMENT', color: 'geekblue' },
  { value: 'OTHER', label: 'OTHER', color: 'default' },
];

export const SYSTEM_MODULE_MAP: Record<string, SystemModuleMeta> =
  Object.fromEntries(SYSTEM_MODULES.map((s) => [s.value, s]));

export const systemModuleTag = (v: string) => {
  const meta = SYSTEM_MODULE_MAP[v];
  return <Tag color={meta?.color ?? 'default'}>{meta?.label ?? v}</Tag>;
};

export const SYSTEM_MODULE_OPTIONS = SYSTEM_MODULES.map((s) => ({
  label: s.label,
  value: s.value,
}));

export const METHOD_OPTIONS = HTTP_METHODS.map((m) => ({ label: m, value: m }));

export interface Permission {
  id: number;
  name: string;
  api_path: string;
  method: string;
  module: string;
  system_module: string;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  modules: string[];
  permission_count: number;
  permission_ids?: number[];
  created_by: string | null;
  updated_by: string | null;
  created_at?: string;
  updated_at?: string;
}
