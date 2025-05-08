import React from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const UserForm = ({ form, editingId }) => {
  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        name="userId"
        label="User ID"
        rules={[{ required: true, message: 'Please input user ID!' }]}
      >
        <Input disabled={!!editingId} />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: !editingId, message: 'Please input password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="role"
        label="Role"
        rules={[{ required: true, message: 'Please select role!' }]}
      >
        <Select>
          <Option value="admin">Admin</Option>
          <Option value="teacher">Teacher</Option>
          <Option value="student">Student</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="firstName"
        label="First Name"
        rules={[{ required: true, message: 'Please input first name!' }]}
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
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default UserForm; 