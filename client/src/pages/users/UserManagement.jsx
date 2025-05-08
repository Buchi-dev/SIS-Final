import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, message, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import userService from '../../services/userService';
import UserForm from '../../components/users/UserForm';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      userId: record.userId,
      role: record.role,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await userService.deleteUserById(id);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await userService.updateUserById(editingId, values);
        message.success('User updated successfully');
      } else {
        await userService.createUser(values);
        message.success('User created successfully');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error(error.message || 'Operation failed');
    }
  };

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={handleAdd}
        >
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingId ? 'Edit User' : 'Add User'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <UserForm form={form} editingId={editingId} />
      </Modal>
    </div>
  );
};

export default UserManagement; 