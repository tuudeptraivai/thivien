import { Card, Col, Row, Statistic, Typography, Spin } from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  GlobalOutlined,
  UserOutlined,
  TranslationOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchOne } from '../api/client';
import { useAuth } from '../auth/AuthContext';

interface Summary {
  total_poems: number;
  total_authors: number;
  total_countries: number;
  total_members: number;
  total_translations: number;
}

const CARDS: {
  key: keyof Summary;
  title: string;
  icon: JSX.Element;
  color: string;
}[] = [
  { key: 'total_poems', title: 'Tác phẩm', icon: <BookOutlined />, color: '#8e2424' },
  { key: 'total_authors', title: 'Tác giả', icon: <TeamOutlined />, color: '#2f6b4f' },
  { key: 'total_translations', title: 'Bản dịch', icon: <TranslationOutlined />, color: '#b5852a' },
  { key: 'total_members', title: 'Thành viên', icon: <UserOutlined />, color: '#3b5b9b' },
  { key: 'total_countries', title: 'Quốc gia', icon: <GlobalOutlined />, color: '#6d4c9b' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['statistics-summary'],
    queryFn: () => fetchOne<Summary>('/statistics/summary'),
  });

  return (
    <div>
      <Typography.Title level={3}>
        Xin chào, {user?.display_name} 👋
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Bảng điều khiển quản trị Thi Uyển. Chọn một mục ở menu bên trái để quản lý dữ liệu.
      </Typography.Paragraph>

      <Spin spinning={isLoading}>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {CARDS.map((c) => (
            <Col xs={12} md={8} lg={6} xl={4} key={c.key}>
              <Card>
                <Statistic
                  title={c.title}
                  value={data?.[c.key] ?? 0}
                  prefix={<span style={{ color: c.color }}>{c.icon}</span>}
                  valueStyle={{ color: c.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>
    </div>
  );
}
