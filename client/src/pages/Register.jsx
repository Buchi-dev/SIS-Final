import { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider, Steps, Result, Row, Col, Layout, Image } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, ArrowLeftOutlined, 
  InfoCircleOutlined, SolutionOutlined, SmileOutlined, TeamOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import SMULogo from '../assets/Logo.png';
import '../styles/Registration.css';

const { Title, Text } = Typography;
const { Content } = Layout;

function Register() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const timerActiveRef = useRef(false);
  
  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Optimized countdown timer effect for success screen
  useEffect(() => {
    // Only start the timer when we reach the success step
    if (currentStep === 2 && !timerActiveRef.current) {
      timerActiveRef.current = true;
      
      timerRef.current = setInterval(() => {
        setCountdown(prevCount => {
          if (prevCount <= 1) {
            clearInterval(timerRef.current);
            // Use setTimeout to prevent immediate redirect that could cause rendering issues
            setTimeout(() => navigate('/login'), 100);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentStep, navigate]);
  
  const steps = [
    {
      title: 'User Info',
      icon: <InfoCircleOutlined />,
    },
    {
      title: 'Account Info',
      icon: <SolutionOutlined />,
    },
    {
      title: 'Success',
      icon: <SmileOutlined />,
    }
  ];

  const nextStep = async () => {
    try {
      if (currentStep === 0) {
        // Validate User Info fields
        const values = await form.validateFields(['userId', 'firstName', 'middleName', 'lastName']);
        setFormData(prev => ({ ...prev, ...values }));
        setCurrentStep(currentStep + 1);
      } else if (currentStep === 1) {
        // Validate Account Info fields
        const values = await form.validateFields(['email', 'password', 'confirmPassword']);
        setFormData(prev => ({ ...prev, ...values }));
        setLoading(true);
        
        try {
          // Register the user using our API service
          const userData = { ...formData, ...values };
          // Remove confirmPassword as it's not needed in the backend
          delete userData.confirmPassword;
          
          await authService.register(userData);
          setLoading(false);
          setCurrentStep(currentStep + 1);
        } catch (error) {
          message.error(error.message || 'Registration failed. Please try again.');
          console.error('Registration error:', error);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content">
            <Title level={4} style={{ marginBottom: '24px', color: '#1890ff' }}>
              <TeamOutlined /> Personal Information
            </Title>
            
            <Form.Item
              name="userId"
              label="User ID"
              rules={[{ required: true, message: 'Please input your User ID!' }]}
              tooltip="This will be your unique identifier in the system"
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#1890ff' }} />} 
                placeholder="Enter your user ID" 
                size="large"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[{ required: true, message: 'Please input your First Name!' }]}
                >
                  <Input 
                    placeholder="Enter first name" 
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="middleName"
                  label="Middle Name"
                >
                  <Input 
                    placeholder="Enter middle name (optional)" 
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please input your Last Name!' }]}
            >
              <Input 
                placeholder="Enter last name" 
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: '24px' }}>
              <Button 
                type="primary" 
                block 
                size="large"
                onClick={nextStep}
                style={{ 
                  background: '#1890ff', 
                  borderColor: '#1890ff',
                  height: '48px',
                  fontSize: '16px'
                }}
              >
                Next Step
              </Button>
            </Form.Item>
          </div>
        );
      case 1:
        return (
          <div className="step-content">
            <Title level={4} style={{ marginBottom: '24px', color: '#1890ff' }}>
              <SolutionOutlined /> Account Details
            </Title>
            
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
              tooltip="We'll use this email for verification and communication"
            >
              <Input 
                prefix={<MailOutlined style={{ color: '#1890ff' }} />} 
                placeholder="Enter your email address" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters long!' }
              ]}
              tooltip="Password must be at least 6 characters long"
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                placeholder="Create a password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                placeholder="Confirm your password"
                size="large"
              />
            </Form.Item>

            <Row gutter={16} style={{ marginTop: '24px' }}>
              <Col span={12}>
                <Button 
                  block
                  size="large"
                  onClick={prevStep}
                  style={{ height: '48px', fontSize: '16px' }}
                >
                  Previous
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  type="primary" 
                  block
                  loading={loading}
                  onClick={nextStep}
                  size="large"
                  style={{ 
                    background: '#1890ff', 
                    borderColor: '#1890ff',
                    height: '48px',
                    fontSize: '16px'
                  }}
                >
                  Create Account
                </Button>
              </Col>
            </Row>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <Result
              status="success"
              title="Registration Successful!"
              subTitle={
                <div>
                  <p>Your account has been created successfully.</p>
                  <p style={{ marginTop: 8 }}>
                    User ID: <Text strong>{formData.userId}</Text>
                  </p>
                  <p>
                    Name: <Text strong>{`${formData.firstName} ${formData.lastName}`}</Text>
                  </p>
                  <p>
                    Email: <Text strong>{formData.email}</Text>
                  </p>
                  <p style={{ marginTop: 16 }}>
                    Redirecting to login page in <Text strong style={{ color: '#2e3192' }}>{countdown}</Text> seconds...
                  </p>
                </div>
              }
              extra={[
                <Link to="/login" key="login">
                  <Button 
                    type="primary" 
                    size="large"
                    style={{ 
                      background: '#2e3192', 
                      borderColor: '#2e3192',
                      height: '48px',
                      fontSize: '16px',
                      minWidth: '180px'
                    }}
                  >
                    Proceed to Login
                  </Button>
                </Link>
              ]}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Determine if we should show the side banner (only on larger screens)
  const showSideBanner = windowWidth >= 992;

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #e6f7ff, #f0f5ff)' }}>
      <Content style={{ padding: '24px' }}>
        <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 48px)' }}>
          <Col xs={24} sm={22} md={20} lg={18} xl={16}>
            <Card 
              style={{ 
                boxShadow: '0 4px 20px rgba(24, 144, 255, 0.15)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: 'none'
              }}
              bodyStyle={{ padding: 0 }}
            >
              <Row>
                {/* Side Banner (shown only on lg screens and above) */}
                {showSideBanner && (
                  <Col lg={10} xl={10} 
                    style={{ 
                      background: 'linear-gradient(135deg, #2e3192 0%, #282c7c 100%)',
                      padding: '48px 32px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      color: 'white',
                      position: 'relative',
                      height: '650px',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
                      {Array(20).fill(0).map((_, i) => (
                        <div key={i} style={{ 
                          position: 'absolute',
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%',
                          background: 'white',
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: Math.random() * 0.5
                        }} />
                      ))}
                    </div>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                        <Image 
                          src={SMULogo} 
                          alt="SMU Logo"
                          width={150}
                          preview={false}
                          style={{ marginBottom: '16px' }}
                        />
                        <Title level={2} style={{ color: 'white', margin: 0 }}>
                          SMU - SIS
                        </Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '16px' }}>
                          Student Information System
                        </Text>
                      </div>
                      
                      <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '16px', display: 'block', marginBottom: '32px', textAlign: 'center' }}>
                        Create an account to access all features and services
                      </Text>
                      <div style={{ marginBottom: '32px', width: '100%' }}>
                        {steps.map((step, index) => (
                          <div key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '16px',
                            opacity: currentStep >= index ? 1 : 0.6
                          }}>
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              background: currentStep >= index ? 'white' : 'rgba(255, 255, 255, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '12px',
                              color: currentStep >= index ? '#2e3192' : 'white'
                            }}>
                              {step.icon}
                            </div>
                            <Text style={{ color: 'white', fontSize: '16px' }}>{step.title}</Text>
                          </div>
                        ))}
                      </div>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px' }}>
                        Already have an account? <Link to="/login" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Sign in here</Link>
                      </Text>
                    </div>
                  </Col>
                )}
                
                {/* Form Content */}
                <Col xs={24} sm={24} md={24} lg={showSideBanner ? 14 : 24} xl={showSideBanner ? 14 : 24}>
                  <div style={{ 
                    padding: '40px', 
                    maxWidth: '100%',
                    height: showSideBanner ? '650px' : 'auto',
                    minHeight: !showSideBanner ? '600px' : 'auto',
                    overflow: 'hidden'
                  }}>
                    {/* Logo for mobile and tablet view */}
                    {!showSideBanner && (
                      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <Image 
                          src={SMULogo} 
                          alt="SMU Logo"
                          width={100}
                          preview={false}
                        />
                        <Title level={3} style={{ color: '#2e3192', margin: '8px 0 0 0' }}>
                          SMU - SIS
                        </Title>
                        <Text type="secondary">
                          Student Information System
                        </Text>
                      </div>
                    )}
                    
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                      <Title level={2} style={{ color: '#2e3192', marginBottom: '8px' }}>
                        {currentStep === 2 ? 'Registration Complete' : 'Create Account'}
                      </Title>
                      {currentStep !== 2 && (
                        <Text type="secondary">
                          Please fill in the information below to create your account
                        </Text>
                      )}
                    </div>
                    
                    {/* Only show steps on mobile and tablet where there's no side banner */}
                    {!showSideBanner && currentStep !== 2 && (
                      <Steps
                        current={currentStep}
                        items={steps}
                        style={{ marginBottom: '36px' }}
                        size={windowWidth < 576 ? 'small' : 'default'}
                      />
                    )}
                    
                    <Form
                      form={form}
                      name="register"
                      initialValues={{ remember: true }}
                      layout="vertical"
                      size="large"
                      requiredMark="optional"
                      style={{ height: '100%' }}
                    >
                      {renderStepContent()}
                    </Form>
                    
                    {!showSideBanner && currentStep !== 2 && (
                      <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <Text type="secondary">Already have an account?</Text>
                        <Link to="/login" style={{ marginLeft: '8px', fontWeight: 'bold', color: '#2e3192' }}>
                          Sign in here
                        </Link>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default Register; 