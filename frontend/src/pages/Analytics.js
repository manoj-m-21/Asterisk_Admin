import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { PhoneOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import {
  LineChart,
  Line,
  // BarChart,
  // Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import '../styles/Analytics.css';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCalls: 0,
    activeUsers: 0,
    averageCallDuration: 0,
    callSuccessRate: 0
  });

  // Mock data for charts
  const callVolumeData = [
    { name: 'Mon', calls: 120 },
    { name: 'Tue', calls: 150 },
    { name: 'Wed', calls: 180 },
    { name: 'Thu', calls: 140 },
    { name: 'Fri', calls: 200 },
    { name: 'Sat', calls: 90 },
    { name: 'Sun', calls: 70 },
  ];

  const callDistributionData = [
    { name: 'Internal', value: 400 },
    { name: 'External', value: 300 },
    { name: 'International', value: 200 },
    { name: 'Toll-Free', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalCalls: 1250,
        activeUsers: 45,
        averageCallDuration: 4.5,
        callSuccessRate: 92
      });
      setLoading(false);
    }, 1000);
  }, []);

  const recentCallsColumns = [
    {
      title: 'Call ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-${status.toLowerCase()}`}>
          {status}
        </span>
      ),
    },
  ];

  const recentCallsData = [
    {
      key: '1',
      id: 'CALL001',
      source: '+1234567890',
      destination: '+0987654321',
      duration: '3m 45s',
      status: 'Completed',
    },
    {
      key: '2',
      id: 'CALL002',
      source: '+1234567891',
      destination: '+0987654322',
      duration: '1m 20s',
      status: 'Failed',
    },
    // Add more mock data as needed
  ];

  return (
    <div className="analytics-container">
      <h1>ANALYTICS DASHBOARD</h1>
      
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Calls"
              value={stats.totalCalls}
              prefix={<PhoneOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Active Users"
              value={stats.activeUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Avg. Call Duration"
              value={stats.averageCallDuration}
              suffix="min"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Call Success Rate"
              value={stats.callSuccessRate}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} lg={12}>
          <Card title="Call Volume Trends" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={callVolumeData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="calls"
                  stroke="#1890ff"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Call Distribution" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={callDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {callDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row className="table-row">
        <Col span={24}>
          <Card title="Recent Calls" loading={loading}>
            <Table
              columns={recentCallsColumns}
              dataSource={recentCallsData}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
