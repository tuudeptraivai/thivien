import { useMemo, useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Typography, theme } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  KeyOutlined,
  BookOutlined,
  EditOutlined,
  TranslationOutlined,
  MessageOutlined,
  CommentOutlined,
  GlobalOutlined,
  HistoryOutlined,
  TagsOutlined,
  ReadOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { RESOURCES } from '../resources';

const { Header, Sider, Content } = Layout;

const ICONS: Record<string, JSX.Element> = {
  users: <UserOutlined />,
  authors: <TeamOutlined />,
  poems: <BookOutlined />,
  translations: <TranslationOutlined />,
  'forum-topics': <MessageOutlined />,
  'forum-posts': <CommentOutlined />,
  comments: <CommentOutlined />,
  annotations: <ReadOutlined />,
  countries: <GlobalOutlined />,
  eras: <HistoryOutlined />,
  'poem-categories': <TagsOutlined />,
};

const GROUP_ORDER = ['Hệ thống', 'Nội dung', 'Diễn đàn', 'Danh mục'];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: 'Tổng quan',
      },
    ];

    GROUP_ORDER.forEach((group) => {
      const inGroup = RESOURCES.filter((r) => r.group === group);
      const children = inGroup.map((r) => ({
        key: `/${r.key}`,
        icon: ICONS[r.key],
        label: r.title,
      }));
      if (group === 'Hệ thống') {
        children.push(
          {
            key: '/roles',
            icon: <SafetyOutlined />,
            label: 'Vai trò (Roles)',
          },
          {
            key: '/permissions',
            icon: <KeyOutlined />,
            label: 'Quyền (Permissions)',
          },
        );
      }
      items.push({
        key: `group-${group}`,
        label: group,
        type: 'group',
        children,
      } as any);
    });

    return items;
  }, []);

  const userMenu: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        width={240}
        style={{ borderRight: '1px solid #f0f0f0' }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: collapsed ? 16 : 20,
            color: '#8e2424',
          }}
        >
          {collapsed ? 'TU' : 'Thi Uyển'}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderInlineEnd: 'none' }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: colorBgContainer,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar
                src={user?.avatar_url || undefined}
                icon={<UserOutlined />}
                style={{ background: '#8e2424' }}
              />
              <div style={{ lineHeight: 1.2 }}>
                <Typography.Text strong>{user?.display_name}</Typography.Text>
                <br />
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {user?.role}
                </Typography.Text>
              </div>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24 }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: 8,
              minHeight: '100%',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
