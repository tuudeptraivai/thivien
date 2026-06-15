import { ReferenceConfig } from './types';

/**
 * Các nguồn dữ liệu tham chiếu cho select khoá ngoại (author_id, country_id...).
 * Mỗi nguồn trả mảng record; `label` tạo nhãn hiển thị, `value` mặc định là id.
 */
export const REFERENCES: Record<string, ReferenceConfig> = {
  authors: {
    url: '/authors?limit=1000&sort=poems',
    label: (r) => r.name,
  },
  countries: {
    url: '/countries',
    label: (r) => r.name,
  },
  eras: {
    url: '/eras',
    label: (r) => r.name,
  },
  'poem-categories': {
    url: '/poem-categories',
    label: (r) => r.name,
  },
  'forum-categories': {
    url: '/forum/categories',
    label: (r) => r.name,
  },
};
