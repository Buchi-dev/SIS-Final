import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import studentService from '../../services/studentService';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (error) {
      message.error('Failed to fetch students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await studentService.deleteStudent(id);
      message.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      message.error('Failed to delete student');
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await studentService.updateStudent(editingId, values);
        message.success('Student updated successfully');
      } else {
        await studentService.createStudent(values);
        message.success('Student created successfully');
      }
      setModalVisible(false);
      fetchStudents();
    } catch (error) {
      message.error('Failed to save student');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'ID Number',
      dataIndex: 'idNumber',
      key: 'idNumber',
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => (
        <span>
          {record.firstName} {record.middleName ? `${record.middleName} ` : ''}{record.lastName}
        </span>
      ),
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
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
            title="Are you sure you want to delete this student?"
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Student Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Student
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={students}
        rowKey="_id"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Edit Student' : 'Add Student'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="idNumber"
            label="ID Number"
            rules={[{ required: true, message: 'Please input ID number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please input first name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="middleName"
            label="Middle Name"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input last name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="course"
            label="Course"
            rules={[{ required: true, message: 'Please select course!' }]}
          >
            <Select>
              <Select.Option value="BSIT">BSIT</Select.Option>
              <Select.Option value="BSCS">BSCS</Select.Option>
              <Select.Option value="BSCE">BSCE</Select.Option>
              <Select.Option value="BSEE">BSEE</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="year"
            label="Year Level"
            rules={[{ required: true, message: 'Please select year level!' }]}
          >
            <Select>
              <Select.Option value="1">1st Year</Select.Option>
              <Select.Option value="2">2nd Year</Select.Option>
              <Select.Option value="3">3rd Year</Select.Option>
              <Select.Option value="4">4th Year</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentManagement; 