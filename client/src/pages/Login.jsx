import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col, Layout, Checkbox, Image } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import SMULogo from '../assets/Logo.png';

const { Title, Text } = Typography;
const { Content } = Layout;

function Login() {
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  
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
  
  // Check if user is already logged in
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call login API
      const response = await authService.login(values);
      message.success(response.message || 'Login successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error(error.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
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
                      height: '550px',
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
                      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
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
                        Sign in to access your account and continue your work
                      </Text>

                      <div style={{ marginTop: '24px' }}>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px' }}>
                          Don't have an account? <Link to="/register" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Register here</Link>
                        </Text>
                      </div>
                    </div>
                  </Col>
                )}
                
                {/* Form Content */}
                <Col xs={24} sm={24} md={24} lg={showSideBanner ? 14 : 24} xl={showSideBanner ? 14 : 24}>
                  <div style={{ 
                    padding: '40px', 
                    maxWidth: '100%',
                    height: showSideBanner ? '550px' : 'auto',
                    minHeight: !showSideBanner ? '500px' : 'auto',
                    display: 'flex',
                    flexDirection: 'column'
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
                        <LoginOutlined /> Sign In
                      </Title>
                      <Text type="secondary">
                        Enter your credentials to access your account
                      </Text>
                    </div>
                    
                    <Form
                      name="login"
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      layout="vertical"
                      size="large"
                      requiredMark="optional"
                      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                    >
                      <div style={{ flex: 1 }}>
                        <Form.Item
                          name="email"
                          label="Email Address"
                          rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email address!' }
                          ]}
                          tooltip="Enter the email you used during registration"
                        >
                          <Input 
                            prefix={<UserOutlined style={{ color: '#2e3192' }} />} 
                            placeholder="Enter your email address" 
                            size="large"
                          />
                        </Form.Item>

                        <Form.Item
                          name="password"
                          label="Password"
                          rules={[{ required: true, message: 'Please input your password!' }]}
                          tooltip="Enter your password"
                        >
                          <Input.Password
                            prefix={<LockOutlined style={{ color: '#2e3192' }} />}
                            placeholder="Enter your password"
                            size="large"
                          />
                        </Form.Item>

                        <Form.Item name="remember" valuePropName="checked">
                          <Row justify="space-between" align="middle">
                            <Checkbox>Remember me</Checkbox>
                            <Link to="#" style={{ color: '#2e3192' }}>Forgot password?</Link>
                          </Row>
                        </Form.Item>
                      </div>

                      <Form.Item style={{ marginTop: '24px' }}>
                        <Button 
                          type="primary" 
                          htmlType="submit" 
                          block 
                          size="large"
                          loading={loading}
                          style={{ 
                            background: '#2e3192', 
                            borderColor: '#2e3192',
                            height: '48px',
                            fontSize: '16px'
                          }}
                        >
                          Sign In
                        </Button>
                      </Form.Item>
                    </Form>
                    
                    {!showSideBanner && (
                      <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <Text type="secondary">Don't have an account?</Text>
                        <Link to="/register" style={{ marginLeft: '8px', fontWeight: 'bold', color: '#2e3192' }}>
                          Register here
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

export default Login; 