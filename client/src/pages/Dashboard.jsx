import { useEffect, useState } from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  List, 
  Avatar, 
  Progress, 
  Divider, 
  Tag,
  Table,
  Badge
} from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BookOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { authService } from '../services/api';

const { Title, Text } = Typography;

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  if (loading || !user) {
    return null;
  }
  return (
    <div>
      <Card
        style={{ marginBottom: 24, borderRadius: 8 }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3} style={{ marginBottom: 8 }}>Welcome back, {user.firstName}!</Title>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Text type="secondary">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </div>
        </div>
      </Card>

    </div>
  );
}

export default Dashboard;
