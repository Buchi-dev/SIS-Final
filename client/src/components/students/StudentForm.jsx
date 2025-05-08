import React from 'react';
import { Form, Input, DatePicker } from 'antd';

const StudentForm = ({ form, editingId }) => {
  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        name="studentId"
        label="Student ID"
        rules={[{ required: true, message: 'Please input student ID!' }]}
      >
        <Input disabled={!!editingId} />
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

      <Form.Item
        name="dateOfBirth"
        label="Date of Birth"
        rules={[{ required: true, message: 'Please select date of birth!' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: 'Please input address!' }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Phone Number"
        rules={[{ required: true, message: 'Please input phone number!' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default StudentForm; 