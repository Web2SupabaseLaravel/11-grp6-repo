import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const RegistrantsDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    ageDistribution: [],
    genderDistribution: [],
    domicileDistribution: [],
    totalRegistrants: 0,
    dominantAge: { count: 0, ageGroup: '' },
    dominantGender: { count: 0, gender: '' },
    dominantDomicile: { count: 0, domicile: '' },
    loading: true,
    error: null
  });

  // Color definitions
  const colors = {
    age: ['#E5E7EB', '#C4B5FD', '#8B5CF6', '#A78BFA', '#DDD6FE', '#7C3AED', '#6D28D9'],
    gender: ['#8B5CF6', '#C4B5FD', '#A78BFA', '#DDD6FE'],
    domicile: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#E5E7EB']
  };

  // Fetch real API data
  const fetchUsersData = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/users');
    return response.data;
  };

  // Calculate age group
  const calculateAgeGroup = (age) => {
    if (!age) return 'Unspecified';
    if (age < 18) return 'Under 18';
    if (age < 25) return '18-24';
    if (age < 35) return '25-34';
    if (age < 45) return '35-44';
    if (age < 55) return '45-54';
    if (age < 65) return '55-64';
    return '65+';
  };

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));

        const users = await fetchUsersData();
        const totalRegistrants = users.length;

        // Calculate age distribution
        const ageGroups = {};
        users.forEach(user => {
          const ageGroup = calculateAgeGroup(user.age);
          ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1;
        });

        // Calculate gender distribution
        const genderGroups = {};
        users.forEach(user => {
          const gender = user.gender || 'Unspecified';
          genderGroups[gender] = (genderGroups[gender] || 0) + 1;
        });

        // Calculate domicile distribution
        const domicileGroups = {};
        users.forEach(user => {
          const domicile = user.domicile || 'Unspecified';
          domicileGroups[domicile] = (domicileGroups[domicile] || 0) + 1;
        });

        // Convert data to chart format
        const ageData = Object.entries(ageGroups).map(([name, count], index) => ({
          name,
          value: totalRegistrants > 0 ? Math.round((count / totalRegistrants) * 100) : 0,
          count,
          color: colors.age[index % colors.age.length]
        }));

        const genderData = Object.entries(genderGroups).map(([name, count], index) => ({
          name,
          value: totalRegistrants > 0 ? Math.round((count / totalRegistrants) * 100) : 0,
          count,
          color: colors.gender[index % colors.gender.length]
        }));

        const domicileData = Object.entries(domicileGroups).map(([name, count], index) => ({
          name,
          value: totalRegistrants > 0 ? Math.round((count / totalRegistrants) * 100) : 0,
          count,
          color: colors.domicile[index % colors.domicile.length]
        }));

        // Find dominant categories
        const dominantAge = Object.entries(ageGroups).reduce((max, current) => 
          current[1] > max[1] ? current : max, ['', 0]);

        const dominantGender = Object.entries(genderGroups).reduce((max, current) => 
          current[1] > max[1] ? current : max, ['', 0]);

        const dominantDomicile = Object.entries(domicileGroups).reduce((max, current) => 
          current[1] > max[1] ? current : max, ['', 0]);

        setDashboardData({
          ageDistribution: ageData,
          genderDistribution: genderData,
          domicileDistribution: domicileData,
          totalRegistrants,
          dominantAge: {
            count: dominantAge[1],
            ageGroup: dominantAge[0]
          },
          dominantGender: {
            count: dominantGender[1],
            gender: dominantGender[0]
          },
          dominantDomicile: {
            count: dominantDomicile[1],
            domicile: dominantDomicile[0]
          },
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'An error occurred while fetching data. Please try again.'
        }));
      }
    };

    fetchDashboardData();
  }, []);

  // Retry function
  const retryFetch = () => {
    setDashboardData(prev => ({ ...prev, error: null }));
    window.location.reload();
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show percentages less than 5%
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Loading state
  if (dashboardData.loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid #E5E7EB', 
            borderTop: '5px solid #7C3AED', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '18px', color: '#7C3AED', fontWeight: 'bold' }}>Loading data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardData.error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div style={{ 
          textAlign: 'center', 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '400px'
        }}>
          <h3 style={{ color: '#EF4444', marginBottom: '16px' }}>Loading Error</h3>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>{dashboardData.error}</p>
          <button 
            onClick={retryFetch}
            style={{
              backgroundColor: '#7C3AED',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#6D28D9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#7C3AED'}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '32px 80px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Main title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#7C3AED',
            margin: '0 0 8px 0'
          }}>
            Registrants Dashboard
          </h1>
          <p style={{ fontSize: '18px', color: '#6B7280', margin: 0 }}>
            Analysis of age, gender, and domicile data for registrants
          </p>
        </div>

        {/* Refresh data button */}
        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
          <button 
            onClick={retryFetch}
            style={{
              backgroundColor: '#7C3AED',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#6D28D9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#7C3AED'}
          >
            Refresh Data
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {/* Age distribution chart */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px', color: '#7C3AED' }}>
              Age Distribution of Registrants
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={dashboardData.ageDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.ageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
                />
                <Tooltip formatter={(value, name, props) => [
                  `${value}% (${props.payload.count} users)`, 
                  'Percentage'
                ]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gender distribution chart */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px', color: '#7C3AED' }}>
              Gender Distribution of Registrants
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={dashboardData.genderDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {dashboardData.genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
                />
                <Tooltip formatter={(value, name, props) => [
                  `${value}% (${props.payload.count} users)`, 
                  'Percentage'
                ]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domicile distribution chart */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px', color: '#7C3AED' }}>
            Domicile Distribution of Registrants
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.domicileDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#7C3AED' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#7C3AED' }}
                label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value}% (${props.payload.count} users)`, 
                  'Percentage'
                ]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #7C3AED',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {dashboardData.domicileDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
            textAlign: 'center', 
            padding: '24px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
          }}>
            <div style={{ color: 'white' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
                {dashboardData.totalRegistrants.toLocaleString()}
              </h2>
              <p style={{ fontSize: '18px', margin: 0 }}>Total Registrants</p>
            </div>
          </div>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
            textAlign: 'center', 
            padding: '24px',
            background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)'
          }}>
            <div style={{ color: 'white' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
                {dashboardData.dominantAge.ageGroup}
              </h2>
              <p style={{ fontSize: '16px', margin: 0 }}>Most Common Age Group ({dashboardData.dominantAge.count})</p>
            </div>
          </div>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
            textAlign: 'center', 
            padding: '24px',
            background: 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%)'
          }}>
            <div style={{ color: 'white' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
                {dashboardData.dominantGender.gender}
              </h2>
              <p style={{ fontSize: '16px', margin: 0 }}>Most Common Gender ({dashboardData.dominantGender.count})</p>
            </div>
          </div>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
            textAlign: 'center', 
            padding: '24px',
            background: 'linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 100%)'
          }}>
            <div style={{ color: '#374151' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
                {dashboardData.dominantDomicile.domicile}
              </h2>
              <p style={{ fontSize: '14px', margin: 0 }}>Most Common City ({dashboardData.dominantDomicile.count})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrantsDashboard;