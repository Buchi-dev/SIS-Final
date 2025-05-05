import { useState, useEffect } from 'react';
import { 
  Table, 
  Typography, 
  Button, 
  Space,
  Modal, 
  Form, 
  Input, 
  Popconfirm, 
  message,
  Card,
  Row,
  Col,
  Avatar,
  Tooltip,
  Divider,
  App
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  UserOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { authService } from '../services/api';
import api from '../services/api';

const { Title, Text } = Typography;
const { Search } = Input;

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  // Mock API calls - replace these with actual API calls in a real application
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all users from the API
      const response = await api.get('/users');
      const users = response.data;
      
      // Map the users to the required format
      const formattedUsers = users.map(user => ({
        key: user.userId,
        userId: user.userId,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt
      }));
      
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    } catch (error) {
      messageApi.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (values) => {
    try {
      // Add user via API
      const response = await api.post('/users/register', values);
      
      // Add the new user to the list
      const newUser = {
        key: response.data.user.userId,
        userId: response.data.user.userId,
        firstName: response.data.user.firstName,
        middleName: values.middleName || '',
        lastName: response.data.user.lastName,
        email: response.data.user.email,
        createdAt: new Date().toISOString()
      };
      
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      messageApi.success('User added successfully');
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      messageApi.error(error.response?.data?.message || 'Failed to add user');
      console.error(error);
    }
  };

  const updateUser = async (values) => {
    try {
      // Update user via API
      await api.put(`/users/${editingUser.userId}`, values);
      
      // Update the local state
      const updatedUsers = users.map(user => 
        user.userId === editingUser.userId ? { ...user, ...values } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      messageApi.success('User updated successfully');
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    } catch (error) {
      messageApi.error(error.response?.data?.message || 'Failed to update user');
      console.error(error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      // Delete user via API
      await api.delete(`/users/${userId}`);
      
      // Update the local state
      const updatedUsers = users.filter(user => user.userId !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      messageApi.success('User deleted successfully');
    } catch (error) {
      messageApi.error(error.response?.data?.message || 'Failed to delete user');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = users.filter(
        user => 
          user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
          user.middleName.toLowerCase().includes(searchText.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchText.toLowerCase()) || 
          user.email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchText, users]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const showAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      firstName: record.firstName,
      middleName: record.middleName,
      lastName: record.lastName,
      email: record.email,
    });
    setModalVisible(true);
  };

  const showViewModal = (record) => {
    setViewingUser(record);
    setViewModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleViewModalCancel = () => {
    setViewModalVisible(false);
    setViewingUser(null);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const onFinish = (values) => {
    if (editingUser) {
      updateUser(values);
    } else {
      addUser(values);
    }
  };

  const refreshData = () => {
    fetchUsers();
    messageApi.success('Data refreshed');
  };

  // Function to generate avatar with initials
  const getUserAvatar = (user) => {
    const firstName = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const middleName = user.middleName ? user.middleName.charAt(0).toUpperCase() : '';
    const lastName = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    return `${firstName}${middleName}${lastName}`;
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            style={{ 
              backgroundColor: '#1890ff',
              marginRight: 8 
            }}
          >
            {getUserAvatar(record)}
          </Avatar>
          <div>
            <Text strong>{`${record.firstName} ${record.middleName} ${record.lastName}`}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => `${a.firstName} ${a.middleName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.middleName} ${b.lastName}`),
    },
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => formatDate(text),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="default"
              icon={<EyeOutlined />}
              onClick={() => showViewModal(record)}
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete user"
            description="Are you sure you want to delete this user?"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => deleteUser(record.userId)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete User">
              <Button 
                type="primary" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Card variant="borderless" style={{ borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>User Management</Title>
                <Text type="secondary">Manage all system users</Text>
              </div>
              <Space>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={refreshData}
                >
                  Refresh
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={showAddModal}
                >
                  Add User
                </Button>
              </Space>
            </div>
            
            <Divider style={{ margin: '12px 0 24px' }} />
            
            <div style={{ marginBottom: 16 }}>
              <Search
                placeholder="Search by name or email"
                allowClear
                enterButton={<><SearchOutlined /> Search</>}
                size="middle"
                onSearch={handleSearch}
                style={{ maxWidth: 400 }}
              />
            </div>
            
            <Table 
              dataSource={filteredUsers} 
              columns={columns} 
              loading={loading}
              rowKey="userId"
              pagination={{ 
                pageSize: 10, 
                showSizeChanger: true, 
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} users`,
                position: ['bottomCenter']
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Add/Edit User Modal */}
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ middleName: '' }}
          name="userForm"
        >
          {!editingUser && (
            <Form.Item
              name="userId"
              label="User ID"
              rules={[{ required: true, message: 'Please enter user ID' }]}
            >
              <Input placeholder="Enter user ID" />
            </Form.Item>
          )}
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="middleName"
                label="Middle Name"
              >
                <Input placeholder="Enter middle name (optional)" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
          
          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* View User Modal */}
      {viewingUser && (
        <Modal
          title="User Details"
          open={viewModalVisible}
          onCancel={handleViewModalCancel}
          footer={[
            <Button key="close" onClick={handleViewModalCancel}>
              Close
            </Button>
          ]}
          width={600}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar size={80} style={{ backgroundColor: '#1890ff' }}>
              {getUserAvatar(viewingUser)}
            </Avatar>
            <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
              {viewingUser.firstName} {viewingUser.middleName} {viewingUser.lastName}
            </Title>
            <Text type="secondary">{viewingUser.email}</Text>
          </div>
          
          <Divider />
          
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">User ID</Text>
                <div><Text strong>{viewingUser.userId}</Text></div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Created On</Text>
                <div><Text strong>{formatDate(viewingUser.createdAt)}</Text></div>
              </div>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">First Name</Text>
                <div><Text strong>{viewingUser.firstName}</Text></div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Last Name</Text>
                <div><Text strong>{viewingUser.lastName}</Text></div>
              </div>
            </Col>
          </Row>
          
          {viewingUser.middleName && (
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Middle Name</Text>
              <div><Text strong>{viewingUser.middleName}</Text></div>
            </div>
          )}
          
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Email Address</Text>
            <div><Text strong>{viewingUser.email}</Text></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Users;
