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
  Select,
  DatePicker,
  InputNumber,
  Card,
  Row,
  Col,
  Divider,
  Tag,
  Tooltip,
  Avatar,
  Tabs,
  App,
  Steps,
  Drawer,
  List
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { studentService, authService, userService } from '../services/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;
const { TabPane } = Tabs;

function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [lastActivity, setLastActivity] = useState(null);
  const [activityHistory, setActivityHistory] = useState([]);
  const [showActivityDrawer, setShowActivityDrawer] = useState(false);

  // Steps for the form
  const steps = [
    {
      title: 'Student ID',
      description: 'Enter student identifier'
    },
    {
      title: 'Personal Info',
      description: 'Name and personal details'
    },
    {
      title: 'Academic',
      description: 'Program and year details'
    },
    {
      title: 'Contact',
      description: 'Contact information'
    }
  ];

  // Real API calls
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentService.getAllStudents();
      // Transform the data to include keys for the Table component
      const formattedStudents = response.map(student => ({
        ...student,
        key: student._id,
        // Format date for display if it exists
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth : null
      }));
      setStudents(formattedStudents);
      setFilteredStudents(formattedStudents);
    } catch (error) {
      message.error('Failed to fetch students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (values) => {
    try {
      // First check if required fields exist
      const requiredFields = ['studentId', 'firstName', 'lastName', 'program', 'year', 'section'];
      const missingFields = requiredFields.filter(field => !values[field]);
      
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        message.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      // First test with the test endpoint
      console.log('Testing student data with test endpoint:', JSON.stringify(values, null, 2));
      const testResponse = await studentService.testCreateStudent(values);
      console.log('Test endpoint response:', testResponse);
      
      // If test is successful, proceed with actual creation
      console.log('Creating student with data:', JSON.stringify(values, null, 2));
      const response = await studentService.createStudent(values);
      console.log('Server response:', response);
      
      message.success('Student added successfully');
      trackActivity('added', values.studentId);
      fetchStudents(); // Refresh the list
      setModalVisible(false);
      form.resetFields();
      setCurrentStep(0); // Reset to first step
    } catch (error) {
      console.error('Error adding student:', error);
      
      // Handle different types of errors
      if (error.requiredFields) {
        const missingFields = Object.entries(error.requiredFields)
          .filter(([_, value]) => !value)
          .map(([field]) => field);
        message.error(`Missing required fields: ${missingFields.join(', ')}`);
      } else if (error.message) {
        message.error(`Failed to add student: ${error.message}`);
      } else {
        message.error('Failed to add student: Unknown error occurred');
      }
    }
  };

  const updateStudent = async (values) => {
    try {
      // First check if required fields exist
      const requiredFields = ['studentId', 'firstName', 'lastName', 'program', 'year', 'section'];
      const missingFields = requiredFields.filter(field => !values[field]);
      
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        message.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      console.log('Updating student with studentId:', editingStudent.studentId, 'data:', values);
      const response = await studentService.updateStudent(editingStudent.studentId, values);
      message.success('Student updated successfully');
      trackActivity('updated', editingStudent.studentId);
      fetchStudents(); // Refresh the list
      setModalVisible(false);
      setEditingStudent(null);
      form.resetFields();
      setCurrentStep(0); // Reset to first step
    } catch (error) {
      console.error('Error updating student:', error);

      // Handle different types of errors
      if (error.requiredFields) {
        const missingFields = Object.entries(error.requiredFields)
          .filter(([_, value]) => !value)
          .map(([field]) => field);
        message.error(`Missing required fields: ${missingFields.join(', ')}`);
      } else if (error.message) {
        message.error(`Failed to update student: ${error.message}`);
      } else {
        message.error('Failed to update student: Unknown error occurred');
      }
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      await studentService.deleteStudent(studentId);
      message.success('Student deleted successfully');
      trackActivity('deleted', studentId);
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error('Error deleting student:', error);
      if (error.message) {
        message.error(`Failed to delete student: ${error.message}`);
      } else {
        message.error('Failed to delete student: Unknown error occurred');
      }
    }
  };

  // Get current user profile with more details
  const fetchCurrentUser = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user && user._id) {
        const profile = await userService.getProfile();
        setCurrentUser(profile);
        
        // Get more detailed user info
        const userDetails = await userService.getUserById(user._id);
        setUserInfo(userDetails);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  // Track activity when changes are made
  const trackActivity = async (action, studentId) => {
    try {
      const user = authService.getCurrentUser();
      if (user && user._id) {
        const activity = {
          action: action,
          studentId: studentId,
          timestamp: new Date().toISOString(),
          performedBy: user._id,
          userName: userInfo?.name || userInfo?.username || user.username
        };
        
        // Update local state
        setLastActivity(activity);
        
        // Add to activity history
        setActivityHistory(prev => [activity, ...prev].slice(0, 10)); // Keep last 10 activities
        
        // Send activity to the server via user profile update
        await userService.updateProfile({ 
          lastActivity: activity 
        });
        
        // Log for debugging
        console.log(`Activity logged: ${action} student ${studentId}`);
      }
    } catch (error) {
      console.error('Error tracking activity:', error);
      // Continue without failing the main operation
    }
  };

  // Fetch activity history from user profile
  const fetchActivityHistory = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user && user._id) {
        // Get user details including activity history
        const userDetails = await userService.getUserById(user._id);
        
        // If the user has activity history, set it in state
        if (userDetails.activityHistory && Array.isArray(userDetails.activityHistory)) {
          setActivityHistory(userDetails.activityHistory);
        }
      }
    } catch (error) {
      console.error('Error fetching activity history:', error);
    }
  };

  // Combined initialization
  useEffect(() => {
    const initializeData = async () => {
      await fetchStudents();
      await fetchCurrentUser();
      await fetchActivityHistory();
    };
    
    initializeData();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = students.filter(
        student => 
          (student.firstName && student.firstName.toLowerCase().includes(searchText.toLowerCase())) || 
          (student.lastName && student.lastName.toLowerCase().includes(searchText.toLowerCase())) || 
          (student.studentId && student.studentId.toLowerCase().includes(searchText.toLowerCase())) ||
          (student.program && student.program.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchText, students]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const showAddModal = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingStudent(record);
    
    // Format the date for the form
    const formValues = {
      ...record,
      dateOfBirth: record.dateOfBirth ? dayjs(record.dateOfBirth) : null,
      // Ensure year is properly formatted as a number for InputNumber
      year: record.year ? Number(record.year) : undefined
    };
    
    // When editing, set to the first step (personal info)
    setCurrentStep(0);
    
    form.setFieldsValue(formValues);
    setModalVisible(true);
  };
  
  const showViewModal = (record) => {
    // If we need to fetch more detailed student data, we can do it here
    // For now, we'll just use the record data
    setViewingStudent(record);
    setViewModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingStudent(null);
    setCurrentStep(0);
    form.resetFields();
  };
  
  const handleViewModalCancel = () => {
    setViewModalVisible(false);
    setViewingStudent(null);
  };

  const handleModalOk = () => {
    if (currentStep < steps.length - 1) {
      // Define which fields to validate for each step
      const fieldsToValidate = {
        0: ['studentId'],
        1: ['firstName', 'lastName'], // Required name fields
        2: ['program', 'year', 'section'], // Required academic fields
        3: [] // No required contact fields
      };
      
      // Validate only the fields in the current step
      form.validateFields(fieldsToValidate[currentStep])
        .then(() => {
          setCurrentStep(currentStep + 1);
        })
        .catch(error => {
          console.log('Validation failed:', error);
          message.error('Please complete all required fields');
        });
    } else {
      // On the final step, validate all required fields and submit
      form.validateFields(['studentId', 'firstName', 'lastName', 'program', 'year', 'section'])
        .then(values => {
          // Get all form values, including optional ones
          const allValues = form.getFieldsValue(true);
          
          // Format the values
          const formattedValues = {
            studentId: allValues.studentId,
            firstName: allValues.firstName,
            lastName: allValues.lastName,
            program: allValues.program,
            year: allValues.year ? Number(allValues.year) : null,
            section: allValues.section,
            // Optional fields with defaults
            middleName: allValues.middleName || '',
            dateOfBirth: allValues.dateOfBirth ? allValues.dateOfBirth.format('YYYY-MM-DD') : null,
            contactNumber: allValues.contactNumber || '',
            address: allValues.address || ''
          };
          
          console.log('Form values after formatting:', formattedValues);
          
          if (editingStudent) {
            updateStudent(formattedValues);
          } else {
            addStudent(formattedValues);
          }
        })
        .catch(error => {
          console.log('Final validation failed:', error);
          message.error('Please complete all required fields');
        });
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleStepChange = (current) => {
    // Only validate when moving forward
    if (current > currentStep) {
      // Define which fields to validate for each step
      const fieldsToValidate = {
        0: ['studentId'],
        1: ['firstName', 'lastName'],
        2: ['program', 'year', 'section'],
        3: []
      };
      
      // Validate only the fields in the current step
      form.validateFields(fieldsToValidate[currentStep])
        .then(() => {
          setCurrentStep(current);
        })
        .catch(error => {
          console.log('Validation failed:', error);
        });
    } else {
      // When moving backward, no validation needed
      setCurrentStep(current);
    }
  };

  const refreshData = () => {
    fetchStudents();
    message.success('Data refreshed');
  };
  
  // Function to generate avatar with initials
  const getStudentAvatar = (student) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;
    }
    return 'ST';
  };
  
  // Function to get background color based on program
  const getProgramColor = (program) => {
    const colors = {
      'Computer Science': '#1890ff',
      'Business Administration': '#52c41a',
      'Engineering': '#faad14',
      'Nursing': '#722ed1',
      'Education': '#eb2f96'
    };
    return colors[program] || '#1890ff';
  };
  
  // Function to get year as text
  const getYearText = (year) => {
    const yearSuffixes = ['st', 'nd', 'rd', 'th'];
    return `${year}${yearSuffixes[year - 1] || 'th'} Year`;
  };

  const columns = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            style={{ 
              backgroundColor: getProgramColor(record.program),
              marginRight: 8 
            }}
          >
            {getStudentAvatar(record)}
          </Avatar>
          <div>
            <Text strong>{record.firstName && record.lastName ? `${record.firstName} ${record.lastName}` : `Student ${record.studentId}`}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>{record.studentId}</Text>
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => {
        const nameA = a.firstName && a.lastName ? `${a.firstName} ${a.lastName}` : a.studentId;
        const nameB = b.firstName && b.lastName ? `${b.firstName} ${b.lastName}` : b.studentId;
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: 'Program',
      key: 'program',
      dataIndex: 'program',
      render: (program) => (
        <Tag color={getProgramColor(program)} key={program}>
          {program}
        </Tag>
      ),
      filters: [
        { text: 'Computer Science', value: 'Computer Science' },
        { text: 'Business Administration', value: 'Business Administration' },
        { text: 'Engineering', value: 'Engineering' },
        { text: 'Nursing', value: 'Nursing' },
        { text: 'Education', value: 'Education' },
      ],
      onFilter: (value, record) => record.program === value,
    },
    {
      title: 'Year & Section',
      key: 'yearSection',
      render: (_, record) => (
        <span>
          {getYearText(record.year)} - Section {record.section}
        </span>
      ),
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <Tooltip title={record.email}>
          <Text 
            style={{ cursor: 'pointer' }}
            ellipsis={{ tooltip: record.email }}
          >
            {record.contactNumber}
          </Text>
        </Tooltip>
      ),
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
          <Tooltip title="Edit Student">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete student"
            description="Are you sure you want to delete this student?"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => deleteStudent(record.studentId)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Student">
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
    <App>
      <div>
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Card bordered={false} style={{ borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>Student Management</Title>
                  <Text type="secondary">Manage all students in the system</Text>
                </div>
                <Space>
                  {userInfo && (
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}>
                      <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                      <Text>{userInfo.name || userInfo.username}</Text>
                    </div>
                  )}
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={refreshData}
                  >
                    Refresh
                  </Button>
                  {activityHistory.length > 0 && (
                    <Button 
                      onClick={() => setShowActivityDrawer(true)}
                      icon={<TeamOutlined />}
                    >
                      Activity Log
                    </Button>
                  )}
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={showAddModal}
                  >
                    Add Student
                  </Button>
                </Space>
              </div>
              
              {lastActivity && (
                <div style={{ marginBottom: 16 }}>
                  <Tag color="blue">
                    Last Action: {lastActivity.action} student {lastActivity.studentId} at {new Date(lastActivity.timestamp).toLocaleTimeString()} 
                    by {lastActivity.userName}
                  </Tag>
                </div>
              )}
              
              <Divider style={{ margin: '12px 0 24px' }} />
              
              <div style={{ marginBottom: 16 }}>
                <Search
                  placeholder="Search by name, ID, or program"
                  allowClear
                  enterButton={<><SearchOutlined /> Search</>}
                  size="middle"
                  onSearch={handleSearch}
                  style={{ maxWidth: 400 }}
                />
              </div>
              
              <Table 
                dataSource={filteredStudents} 
                columns={columns} 
                loading={loading}
                rowKey="_id"
                pagination={{ 
                  pageSize: 10, 
                  showSizeChanger: true, 
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} students`,
                  position: ['bottomCenter']
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Add/Edit Student Modal */}
        <Modal
          title={editingStudent ? `Edit Student: ${editingStudent.firstName} ${editingStudent.lastName}` : 'Add Student'}
          open={modalVisible}
          onCancel={handleModalCancel}
          width={700}
          footer={[
            <Button key="back" onClick={handlePrevious} disabled={currentStep === 0}>
              Previous
            </Button>,
            <Button key="submit" type="primary" onClick={handleModalOk}>
              {currentStep < steps.length - 1 ? 'Next' : (editingStudent ? 'Update' : 'Save')}
            </Button>
          ]}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              studentId: '',
              firstName: '',
              lastName: '',
              middleName: '',
              dateOfBirth: null,
              program: undefined,
              year: undefined,
              section: '',
              contactNumber: '',
              address: ''
            }}
          >
            <Steps
              current={currentStep}
              onChange={handleStepChange}
              items={steps}
              style={{ marginBottom: 24 }}
            />
            
            {/* Step content */}
            <div className="steps-content" style={{ marginTop: 20, marginBottom: 20 }}>
              {currentStep === 0 && (
                <Form.Item
                  name="studentId"
                  label="Student ID"
                  rules={[{ required: true, message: 'Please enter a student ID' }]}
                >
                  <Input placeholder="Enter student ID (e.g., 2023-001)" />
                </Form.Item>
              )}
              
              {currentStep === 1 && (
                <>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter a first name' }]}
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
                        rules={[{ required: true, message: 'Please enter a last name' }]}
                      >
                        <Input placeholder="Enter last name" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                  >
                    <DatePicker style={{ width: '100%' }} placeholder="Select birth date" />
                  </Form.Item>
                </>
              )}
              
              {currentStep === 2 && (
                <>
                  <Form.Item
                    name="program"
                    label="Program"
                    rules={[{ required: true, message: 'Please select a program' }]}
                  >
                    <Select placeholder="Select program">
                      <Option value="Computer Science">Computer Science</Option>
                      <Option value="Business Administration">Business Administration</Option>
                      <Option value="Engineering">Engineering</Option>
                      <Option value="Nursing">Nursing</Option>
                      <Option value="Education">Education</Option>
                    </Select>
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="year"
                        label="Year"
                        rules={[{ required: true, message: 'Please select a year' }]}
                      >
                        <InputNumber min={1} max={4} style={{ width: '100%' }} placeholder="1-4" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="section"
                        label="Section"
                        rules={[{ required: true, message: 'Please select a section' }]}
                      >
                        <Input placeholder="e.g., A, B, C" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
              
              {currentStep === 3 && (
                <>
                  <Form.Item
                    name="contactNumber"
                    label="Contact Number"
                  >
                    <Input placeholder="Enter contact number" />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label="Address"
                  >
                    <TextArea rows={3} placeholder="Enter full address" />
                  </Form.Item>
                </>
              )}
            </div>
            
            {/* Step description */}
            <div className="steps-description" style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 4 }}>
              <Text type="secondary">{steps[currentStep].description}</Text>
              {currentStep === 0 && !editingStudent && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">
                    The Student ID is a unique identifier and cannot be changed later.
                  </Text>
                </div>
              )}
            </div>
          </Form>
        </Modal>

        {/* View Student Modal */}
        <Modal
          title="Student Details"
          open={viewModalVisible}
          onCancel={handleViewModalCancel}
          footer={[
            <Button key="close" onClick={handleViewModalCancel}>
              Close
            </Button>
          ]}
          width={600}
        >
          {viewingStudent && (
            <Card bordered={false}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <Avatar 
                  size={64}
                  style={{ 
                    backgroundColor: getProgramColor(viewingStudent.program),
                    marginRight: 16 
                  }}
                >
                  {getStudentAvatar(viewingStudent)}
                </Avatar>
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    {viewingStudent.firstName} {viewingStudent.middleName && viewingStudent.middleName + ' '}{viewingStudent.lastName}
                  </Title>
                  <Text type="secondary">{viewingStudent.studentId}</Text>
                </div>
              </div>
              
              <Divider orientation="left">Personal Information</Divider>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div>
                    <Text type="secondary">Date of Birth:</Text>
                    <div>
                      <Text strong>{viewingStudent.dateOfBirth ? dayjs(viewingStudent.dateOfBirth).format('MMMM D, YYYY') : 'Not specified'}</Text>
                    </div>
                  </div>
                </Col>
              </Row>
              
              <Divider orientation="left">Academic Information</Divider>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div>
                    <Text type="secondary">Program:</Text>
                    <div>
                      <Tag color={getProgramColor(viewingStudent.program)}>
                        {viewingStudent.program}
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text type="secondary">Year:</Text>
                    <div>
                      <Text strong>{getYearText(viewingStudent.year)}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text type="secondary">Section:</Text>
                    <div>
                      <Text strong>{viewingStudent.section}</Text>
                    </div>
                  </div>
                </Col>
              </Row>
              
              <Divider orientation="left">Contact Information</Divider>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div>
                    <Text type="secondary"><PhoneOutlined /> Contact Number:</Text>
                    <div>
                      <Text strong>{viewingStudent.contactNumber || 'Not specified'}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <Text type="secondary"><EnvironmentOutlined /> Address:</Text>
                    <div>
                      <Text strong>{viewingStudent.address || 'Not specified'}</Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          )}
        </Modal>

        {/* Activity History Drawer */}
        <Drawer
          title="Activity History"
          placement="right"
          onClose={() => setShowActivityDrawer(false)}
          open={showActivityDrawer}
          width={400}
        >
          <List
            itemLayout="horizontal"
            dataSource={activityHistory}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={`${item.action.charAt(0).toUpperCase() + item.action.slice(1)} Student ${item.studentId}`}
                  description={`${new Date(item.timestamp).toLocaleString()} by ${item.userName}`}
                />
              </List.Item>
            )}
          />
        </Drawer>
      </div>
    </App>
  );
}

export default Students;