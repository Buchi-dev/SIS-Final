import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, message, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import studentService from '../../services/studentService';
import StudentForm from '../../components/students/StudentForm';
import moment from 'moment';

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
    form.setFieldsValue({
      ...record,
      dateOfBirth: record.dateOfBirth ? moment(record.dateOfBirth) : null,
    });
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
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
      };

      if (editingId) {
        await studentService.updateStudent(editingId, formattedValues);
        message.success('Student updated successfully');
      } else {
        await studentService.createStudent(formattedValues);
        message.success('Student created successfully');
      }
      setModalVisible(false);
      fetchStudents();
    } catch (error) {
      message.error(error.message || 'Operation failed');
    }
  };

  const columns = [
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
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
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
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
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
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
      />

      <Modal
        title={editingId ? 'Edit Student' : 'Add Student'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <StudentForm form={form} editingId={editingId} />
      </Modal>
    </div>
  );
};

export default StudentManagement; 