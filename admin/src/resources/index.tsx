import { Tag } from 'antd';
import dayjs from 'dayjs';
import { ResourceConfig, SelectOption } from './types';

// ─── Helpers render ───────────────────────────────────────────────
const dateRender = (v: any) =>
  v ? dayjs(v).format('DD/MM/YYYY HH:mm') : '—';

const boolTag = (v: any) =>
  v ? <Tag color="green">Có</Tag> : <Tag>Không</Tag>;

const ROLE_COLOR: Record<string, string> = {
  admin: 'red',
  moderator: 'volcano',
  poet: 'geekblue',
  member: 'default',
};
const roleTag = (v: string) => <Tag color={ROLE_COLOR[v] ?? 'default'}>{v}</Tag>;

const POEM_STATUS_COLOR: Record<string, string> = {
  draft: 'default',
  pending: 'orange',
  published: 'green',
};
const poemStatusTag = (v: string) => (
  <Tag color={POEM_STATUS_COLOR[v] ?? 'default'}>{v}</Tag>
);

const COMMENT_STATUS_COLOR: Record<string, string> = {
  pending: 'orange',
  approved: 'green',
  spam: 'red',
};
const commentStatusTag = (v: string) => (
  <Tag color={COMMENT_STATUS_COLOR[v] ?? 'default'}>{v}</Tag>
);

// ─── Option sets ──────────────────────────────────────────────────
export const ROLE_OPTIONS: SelectOption[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Moderator', value: 'moderator' },
  { label: 'Poet (Nhà thơ)', value: 'poet' },
  { label: 'Member', value: 'member' },
];

const POEM_STATUS_OPTIONS: SelectOption[] = [
  { label: 'Nháp (draft)', value: 'draft' },
  { label: 'Chờ duyệt (pending)', value: 'pending' },
  { label: 'Xuất bản (published)', value: 'published' },
];

const COMMENT_STATUS_OPTIONS: SelectOption[] = [
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đã duyệt', value: 'approved' },
  { label: 'Spam', value: 'spam' },
];

const ANNOTATION_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Từ vựng', value: 'vocabulary' },
  { label: 'Điển tích', value: 'allusion' },
  { label: 'Địa danh', value: 'location' },
];

const ENTITY_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Bài thơ', value: 'poem' },
  { label: 'Tác giả', value: 'author' },
  { label: 'Chủ đề diễn đàn', value: 'forum_topic' },
];

// ─── Resource configs ─────────────────────────────────────────────
export const RESOURCES: ResourceConfig[] = [
  // 1. Người dùng
  {
    key: 'users',
    title: 'Người dùng',
    group: 'Hệ thống',
    list: '/users',
    serverPagination: true,
    searchable: true,
    create: '/users',
    update: (id) => `/users/${id}`,
    remove: (id) => `/users/${id}`,
    filters: [{ name: 'role', label: 'Vai trò', options: ROLE_OPTIONS }],
    fields: [
      { name: 'id', label: 'ID', width: 64, inForm: false },
      { name: 'username', label: 'Username', required: true },
      { name: 'email', label: 'Email', required: true },
      { name: 'display_name', label: 'Tên hiển thị', required: true },
      {
        name: 'password',
        label: 'Mật khẩu',
        type: 'password',
        inTable: false,
        requiredOnCreate: true,
        placeholder: 'Để trống nếu không đổi',
      },
      {
        name: 'role',
        label: 'Vai trò',
        type: 'select',
        options: ROLE_OPTIONS,
        render: roleTag,
      },
      {
        name: 'is_active',
        label: 'Kích hoạt',
        type: 'switch',
        render: boolTag,
      },
      { name: 'avatar_url', label: 'Avatar URL', inTable: false },
      {
        name: 'created_at',
        label: 'Tạo lúc',
        inForm: false,
        render: dateRender,
      },
    ],
  },

  // 2. Tác giả
  {
    key: 'authors',
    title: 'Tác giả',
    group: 'Nội dung',
    list: '/authors',
    serverPagination: true,
    searchable: true,
    create: '/authors',
    update: (id) => `/authors/${id}`,
    remove: (id) => `/authors/${id}`,
    fields: [
      { name: 'id', label: 'ID', width: 64, inForm: false },
      { name: 'name', label: 'Tên', required: true },
      { name: 'real_name', label: 'Tên thật / Hiệu' },
      { name: 'birth_year', label: 'Năm sinh', width: 100 },
      { name: 'death_year', label: 'Năm mất', width: 100 },
      {
        name: 'country',
        label: 'Quốc gia',
        inForm: false,
        render: (v) => v ?? '—',
      },
      {
        name: 'country_id',
        label: 'Quốc gia',
        type: 'select',
        optionsResource: 'countries',
        inTable: false,
      },
      {
        name: 'era',
        label: 'Thời kỳ',
        inForm: false,
        render: (v) => v ?? '—',
      },
      {
        name: 'era_id',
        label: 'Thời kỳ',
        type: 'select',
        optionsResource: 'eras',
        inTable: false,
      },
      {
        name: 'poem_count',
        label: 'Số bài',
        width: 90,
        inForm: false,
      },
      {
        name: 'biography',
        label: 'Tiểu sử',
        type: 'textarea',
        inTable: false,
      },
      { name: 'portrait_url', label: 'Ảnh chân dung', inTable: false },
    ],
  },

  // 3. Thơ
  {
    key: 'poems',
    title: 'Thơ',
    group: 'Nội dung',
    list: '/poems',
    serverPagination: true,
    searchable: true,
    listParams: { status: 'all' },
    create: '/poems',
    update: (id) => `/poems/${id}`,
    remove: (id) => `/poems/${id}`,
    filters: [{ name: 'status', label: 'Trạng thái', options: POEM_STATUS_OPTIONS }],
    import: {
      endpoint: '/poems/import',
      templateName: 'mau-nhap-tho.csv',
      columns: [
        { key: 'title', label: 'Tiêu đề (bắt buộc)', sample: 'Cảnh nhàn' },
        {
          key: 'content',
          label: 'Nội dung bài thơ (xuống dòng được)',
          sample: 'Thu ăn măng trúc, đông ăn giá\nXuân tắm hồ sen, hạ tắm ao',
        },
        { key: 'author_name', label: 'Tên tác giả (tự tạo nếu chưa có)', sample: 'Nguyễn Bỉnh Khiêm' },
        { key: 'category', label: 'Tên thể loại (khớp tên có sẵn)', sample: 'Thất ngôn bát cú' },
        { key: 'era', label: 'Tên thời kỳ (khớp tên có sẵn)', sample: 'Hậu Lê' },
        { key: 'source_info', label: 'Xuất xứ / nguồn', sample: 'Bạch Vân quốc ngữ thi tập' },
        { key: 'status', label: 'draft | pending | published', sample: 'published' },
      ],
    },
    note: 'Tạo / sửa bài thơ kèm nội dung bản chính. Dùng "Nhập CSV" để thêm hàng loạt — bấm "Tải file mẫu" để xem định dạng.',
    fields: [
      { name: 'id', label: 'ID', width: 64, inForm: false },
      { name: 'title', label: 'Tiêu đề', required: true },
      {
        name: 'content',
        label: 'Nội dung bài thơ',
        type: 'textarea',
        ellipsis: true,
        width: 300,
        render: (v) =>
          v ? String(v).split('\n').slice(0, 2).join(' / ') : '—',
      },
      {
        name: 'author',
        label: 'Tác giả',
        inForm: false,
        render: (v) => v?.name ?? '—',
      },
      {
        name: 'author_id',
        label: 'Tác giả',
        type: 'select',
        optionsResource: 'authors',
        inTable: false,
      },
      {
        name: 'category',
        label: 'Thể loại',
        inForm: false,
        render: (v) => v?.name ?? '—',
      },
      {
        name: 'category_id',
        label: 'Thể loại',
        type: 'select',
        optionsResource: 'poem-categories',
        inTable: false,
      },
      {
        name: 'era_id',
        label: 'Thời kỳ',
        type: 'select',
        optionsResource: 'eras',
        inTable: false,
      },
      { name: 'source_info', label: 'Xuất xứ', inTable: false },
      {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: POEM_STATUS_OPTIONS,
        render: poemStatusTag,
      },
      {
        name: 'is_member_poem',
        label: 'Thơ thành viên',
        type: 'switch',
        render: boolTag,
      },
      { name: 'view_count', label: 'Lượt xem', width: 100, inForm: false },
      {
        name: 'created_at',
        label: 'Tạo lúc',
        inForm: false,
        render: dateRender,
      },
    ],
    toForm: (r) => ({
      ...r,
      author_id: r.author?.id,
      category_id: r.category?.id,
    }),
  },

  // 4. Bản dịch
  {
    key: 'translations',
    title: 'Bản dịch',
    group: 'Nội dung',
    list: '/translations/member',
    serverPagination: true,
    update: (id) => `/translations/${id}`,
    remove: (id) => `/translations/${id}`,
    note: 'Liệt kê bản dịch do thành viên đóng góp. Khi sửa, để trống "Nội dung" sẽ giữ nguyên bản gốc.',
    fields: [
      { name: 'id', label: 'ID', width: 64, inForm: false },
      { name: 'translation_title', label: 'Tiêu đề bản dịch' },
      {
        name: 'poem',
        label: 'Bài thơ',
        inForm: false,
        render: (v) => v?.title ?? '—',
      },
      {
        name: 'translator',
        label: 'Dịch giả',
        inForm: false,
        render: (v) => v?.name ?? '—',
      },
      { name: 'translation_type', label: 'Thể loại' },
      {
        name: 'excerpt',
        label: 'Trích đoạn',
        inForm: false,
        ellipsis: true,
        width: 280,
      },
      {
        name: 'content',
        label: 'Nội dung (sửa để thay thế)',
        type: 'textarea',
        inTable: false,
      },
      {
        name: 'created_at',
        label: 'Tạo lúc',
        inForm: false,
        render: dateRender,
      },
    ],
    toForm: (r) => ({
      translation_title: r.translation_title,
      translation_type: r.translation_type,
    }),
  },

  // 5. Chủ đề diễn đàn
  {
    key: 'forum-topics',
    title: 'Chủ đề diễn đàn',
    group: 'Diễn đàn',
    list: '/forum/topics',
    serverPagination: true,
    create: '/forum/topics',
    update: (id) => `/forum/topics/${id}`,
    remove: (id) => `/forum/topics/${id}`,
    rowActions: [
      {
        key: 'pin',
        label: 'Ghim',
        request: (r) => ({ method: 'put', url: `/forum/topics/${r.id}/pin` }),
      },
      {
        key: 'lock',
        label: 'Khoá',
        request: (r) => ({ method: 'put', url: `/forum/topics/${r.id}/lock` }),
      },
    ],
    note: 'Khi tạo mới cần chọn chuyên mục + nội dung bài mở đầu. Dùng nút Ghim/Khoá để bật tắt nhanh.',
    fields: [
      { name: 'id', label: 'ID', width: 64, inForm: false },
      { name: 'title', label: 'Tiêu đề', required: true },
      {
        name: 'category',
        label: 'Chuyên mục',
        inForm: false,
        render: (v) => v ?? '—',
      },
      {
        name: 'category_id',
        label: 'Chuyên mục',
        type: 'select',
        optionsResource: 'forum-categories',
        inTable: false,
        requiredOnCreate: true,
      },
      {
        name: 'content',
        label: 'Nội dung bài mở đầu',
        type: 'textarea',
        inTable: false,
        editable: false,
        requiredOnCreate: true,
      },
      { name: 'author_name', label: 'Người tạo', inForm: false },
      { name: 'reply_count', label: 'Trả lời', width: 90, inForm: false },
      { name: 'view_count', label: 'Lượt xem', width: 100, inForm: false },
      {
        name: 'pinned',
        label: 'Ghim',
        inForm: false,
        render: boolTag,
      },
    ],
    toForm: (r) => ({ title: r.title }),
  },

  // 6. Bài đăng diễn đàn
  {
    key: 'forum-posts',
    title: 'Bài đăng diễn đàn',
    group: 'Diễn đàn',
    list: '/forum/posts',
    serverPagination: true,
    searchable: true,
    update: (id) => `/forum/posts/${id}`,
    remove: (id) => `/forum/posts/${id}`,
    note: 'Bài đăng được tạo trong từng chủ đề ở frontend. Tại đây bạn có thể sửa nội dung hoặc xoá.',
    fields: [
      { name: 'id', label: 'ID', width: 64, inForm: false },
      {
        name: 'topic_title',
        label: 'Chủ đề',
        inForm: false,
        ellipsis: true,
        width: 220,
      },
      { name: 'author_name', label: 'Tác giả', inForm: false },
      {
        name: 'content',
        label: 'Nội dung',
        type: 'textarea',
        ellipsis: true,
        width: 360,
      },
      {
        name: 'created_at',
        label: 'Tạo lúc',
        inForm: false,
        render: dateRender,
      },
    ],
    toForm: (r) => ({ content: r.content }),
  },

  // 7. Bình luận
  {
    key: 'comments',
    title: 'Bình luận',
    group: 'Diễn đàn',
    list: '/comments/admin',
    serverPagination: true,
    searchable: true,
    update: (id) => `/comments/${id}`,
    remove: (id) => `/comments/${id}`,
    filters: [
      { name: 'status', label: 'Trạng thái', options: COMMENT_STATUS_OPTIONS },
      { name: 'entity_type', label: 'Loại', options: ENTITY_TYPE_OPTIONS },
    ],
    fields: [
      { name: 'id', label: 'ID', width: 64, inForm: false },
      {
        name: 'entity_type',
        label: 'Loại',
        inForm: false,
        width: 110,
      },
      { name: 'entity_id', label: 'ID thực thể', inForm: false, width: 100 },
      {
        name: 'author',
        label: 'Người gửi',
        inForm: false,
        render: (v) => v?.display_name ?? '—',
      },
      {
        name: 'content',
        label: 'Nội dung',
        type: 'textarea',
        ellipsis: true,
        width: 340,
      },
      {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: COMMENT_STATUS_OPTIONS,
        render: commentStatusTag,
      },
      {
        name: 'created_at',
        label: 'Tạo lúc',
        inForm: false,
        render: dateRender,
      },
    ],
    toForm: (r) => ({ content: r.content, status: r.status }),
  },

  // 8. Chú giải / Từ điển
  {
    key: 'annotations',
    title: 'Chú giải / Điển tích',
    group: 'Nội dung',
    list: '/annotations',
    serverPagination: true,
    searchable: true,
    create: '/annotations',
    update: (id) => `/annotations/${id}`,
    remove: (id) => `/annotations/${id}`,
    filters: [{ name: 'type', label: 'Loại', options: ANNOTATION_TYPE_OPTIONS }],
    fields: [
      { name: 'id', label: 'ID', width: 64, inForm: false },
      {
        name: 'keyword',
        label: 'Từ khoá',
        required: true,
        editable: false,
      },
      {
        name: 'explanation',
        label: 'Giải nghĩa',
        type: 'textarea',
        required: true,
        ellipsis: true,
        width: 360,
      },
      {
        name: 'type',
        label: 'Loại',
        type: 'select',
        options: ANNOTATION_TYPE_OPTIONS,
        render: (v) => <Tag>{v}</Tag>,
      },
      { name: 'source', label: 'Nguồn' },
    ],
  },

  // 9. Quốc gia
  {
    key: 'countries',
    title: 'Quốc gia',
    group: 'Danh mục',
    list: '/countries',
    searchable: false,
    create: '/countries',
    update: (id) => `/countries/${id}`,
    remove: (id) => `/countries/${id}`,
    fields: [
      { name: 'id', label: 'ID', width: 64, inForm: false },
      { name: 'name', label: 'Tên quốc gia', required: true },
      { name: 'iso_code', label: 'Mã ISO', width: 120 },
      { name: 'flag_url', label: 'Ảnh cờ', inTable: false },
    ],
  },

  // 10. Thời kỳ
  {
    key: 'eras',
    title: 'Thời kỳ / Triều đại',
    group: 'Danh mục',
    list: '/eras',
    create: '/eras',
    update: (id) => `/eras/${id}`,
    remove: (id) => `/eras/${id}`,
    fields: [
      { name: 'id', label: 'ID', width: 64, inForm: false },
      { name: 'name', label: 'Tên thời kỳ', required: true },
      {
        name: 'description',
        label: 'Mô tả',
        type: 'textarea',
        inTable: false,
      },
      { name: 'start_year', label: 'Năm bắt đầu', type: 'number', width: 120 },
      { name: 'end_year', label: 'Năm kết thúc', type: 'number', width: 120 },
    ],
  },

  // 11. Thể loại thơ
  {
    key: 'poem-categories',
    title: 'Thể loại thơ',
    group: 'Danh mục',
    list: '/poem-categories',
    create: '/poem-categories',
    update: (id) => `/poem-categories/${id}`,
    remove: (id) => `/poem-categories/${id}`,
    fields: [
      { name: 'id', label: 'ID', width: 64, inForm: false },
      { name: 'name', label: 'Tên thể loại', required: true },
      {
        name: 'slug',
        label: 'Slug',
        placeholder: 'Để trống sẽ tự sinh',
      },
      {
        name: 'description',
        label: 'Mô tả',
        type: 'textarea',
        inTable: false,
      },
    ],
  },
];

export const RESOURCE_MAP: Record<string, ResourceConfig> = Object.fromEntries(
  RESOURCES.map((r) => [r.key, r]),
);
