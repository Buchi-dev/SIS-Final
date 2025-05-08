import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Student Information System</p>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Link to="/users">
            <Card hoverable>
              <Statistic
                title="Users"
                value={42}
                prefix={<UserOutlined />}
              />
              <div style={{ marginTop: 10 }}>Manage Users</div>
            </Card>
          </Link>
        </Col>
        <Col span={12}>
          <Link to="/students">
            <Card hoverable>
              <Statistic
                title="Students"
                value={128}
                prefix={<TeamOutlined />}
              />
              <div style={{ marginTop: 10 }}>Manage Students</div>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 