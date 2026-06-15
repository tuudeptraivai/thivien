import { useParams } from 'react-router-dom';
import { Empty } from 'antd';
import { RESOURCE_MAP } from '../resources';
import ResourceTable from '../components/ResourceTable';

export default function ResourcePage() {
  const { resourceKey } = useParams();
  const resource = resourceKey ? RESOURCE_MAP[resourceKey] : undefined;

  if (!resource) {
    return <Empty description="Không tìm thấy mục quản lý" />;
  }

  // key đổi → remount để reset state phân trang/tìm kiếm
  return <ResourceTable key={resource.key} resource={resource} />;
}
