import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ReportsDashboard = () => {
  // Filter states
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 7 Days');
  const [selectedEvents, setSelectedEvents] = useState('All Events');
  const [selectedUserType, setSelectedUserType] = useState('All');

  // Data states
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalEvents: 0,
    totalUsers: 0,
    totalTickets: 0,
    chartData: [],
    tableData: []
  });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:8000/api';
  const getAuthToken = () => {
    return localStorage.getItem('auth_token') || '';
  };

  // Calculate date range based on selection
  const getDateRange = (timeRange) => {
    const now = new Date();
    let startDate = new Date();
    
    switch(timeRange) {
      case 'Last 7 Days':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'Last 30 Days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'Last 3 Months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'Last Year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    };
  };

  const fetchDashboardData = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const dateRange = getDateRange(filters.timeRange || selectedTimeRange);
      
      // Fetch all required data in parallel
      const [eventsResponse, usersResponse, ticketsResponse, buysResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/events`, { headers }),
        axios.get(`${API_BASE_URL}/users`, { headers }),
        axios.get(`${API_BASE_URL}/tickets`, { headers }),
        axios.get(`${API_BASE_URL}/buys`, { headers })
      ]);

      const events = eventsResponse.data.data || eventsResponse.data || [];
      const users = usersResponse.data.data || usersResponse.data || [];
      const tickets = ticketsResponse.data.data || ticketsResponse.data || [];
      const buys = buysResponse.data.data || buysResponse.data || [];

      // Filter events based on selected filters
      let filteredEvents = events;
      
      if (filters.events !== 'All Events') {
        const now = new Date();
        filteredEvents = events.filter(event => {
          const eventDate = new Date(event.date || event.created_at);
          switch(filters.events) {
            case 'Active Events':
              return eventDate >= now;
            case 'Past Events':
              return eventDate < now;
            case 'Upcoming Events':
              return eventDate > now;
            default:
              return true;
          }
        });
      }

      // Calculate total revenue from buys
      const totalRevenue = buys.reduce((sum, buy) => {
        const buyDate = new Date(buy.created_at);
        const rangeStart = new Date(dateRange.start);
        const rangeEnd = new Date(dateRange.end);
        
        if (buyDate >= rangeStart && buyDate <= rangeEnd) {
          return sum + (parseFloat(buy.total_amount) || parseFloat(buy.amount) || 0);
        }
        return sum;
      }, 0);

      // Filter users based on date range
      const filteredUsers = users.filter(user => {
        const userDate = new Date(user.created_at);
        const rangeStart = new Date(dateRange.start);
        const rangeEnd = new Date(dateRange.end);
        return userDate >= rangeStart && userDate <= rangeEnd;
      });

      // Filter tickets based on date range
      const filteredTickets = tickets.filter(ticket => {
        const ticketDate = new Date(ticket.created_at);
        const rangeStart = new Date(dateRange.start);
        const rangeEnd = new Date(dateRange.end);
        return ticketDate >= rangeStart && ticketDate <= rangeEnd;
      });

      // Generate chart data (last 7 days of sales)
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayBuys = buys.filter(buy => {
          const buyDate = buy.created_at ? buy.created_at.split('T')[0] : '';
          return buyDate === dateStr;
        });
        
        const dayRevenue = dayBuys.reduce((sum, buy) => 
          sum + (parseFloat(buy.total_amount) || parseFloat(buy.amount) || 0), 0
        );
        
        chartData.push({
          label: date.toLocaleDateString('en-US', { weekday: 'short' }),
          value: Math.round(dayRevenue / 1000) // Convert to thousands
        });
      }

      // Generate table data from events
      const tableData = filteredEvents.slice(0, 10).map(event => {
        const eventBuys = buys.filter(buy => buy.event_id === event.id);
        const eventRevenue = eventBuys.reduce((sum, buy) => 
          sum + (parseFloat(buy.total_amount) || parseFloat(buy.amount) || 0), 0
        );
        
        const eventDate = new Date(event.date || event.created_at);
        const now = new Date();
        let status = 'Past';
        
        if (eventDate > now) {
          status = 'Upcoming';
        } else if (Math.abs(eventDate - now) < 24 * 60 * 60 * 1000) {
          status = 'Live';
        }

        return {
          name: event.title || event.name || `Event ${event.id}`,
          date: event.date || event.created_at,
          amount: eventRevenue,
          status: status
        };
      });

      // Calculate conversion rate (tickets sold vs total events)
      const conversionRate = filteredEvents.length > 0 
        ? (filteredTickets.length / filteredEvents.length) * 100 
        : 0;

      setDashboardData({
        totalRevenue: totalRevenue,
        totalEvents: filteredEvents.length,
        totalUsers: filteredUsers.length,
        totalTickets: filteredTickets.length,
        chartData: chartData,
        tableData: tableData
      });

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle filter changes and generate report
  const handleGenerateReport = () => {
    fetchDashboardData({
      timeRange: selectedTimeRange,
      events: selectedEvents,
      userType: selectedUserType
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const CustomSelect = ({ value, onChange, options, label, id }) => (
    <div className="mb-3">
      <label htmlFor={id} className="form-label text-muted fw-medium" style={{ fontSize: '12px' }}>
        {label}
      </label>
      <div className="position-relative">
        <select 
          id={id}
          className="form-select form-select-sm"
          value={value}
          onChange={onChange}
          style={{ paddingRight: '35px' }}
          disabled={loading}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown 
          size={16} 
          className="position-absolute text-muted"
          style={{
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );

  // Error component
  const ErrorAlert = ({ message, onRetry }) => (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <AlertCircle size={20} className="me-2" />
      <div className="flex-grow-1">
        <strong>Error:</strong> {message}
      </div>
      <button 
        className="btn btn-outline-danger btn-sm ms-2"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="bg-light min-vh-100" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div className="container-fluid p-4">
          {/* Header */}
          <div className="row">
            <div className="col-12">
              <h1 className="h2 fw-semibold mb-4" style={{ color: '#8b5cf6', letterSpacing: '-0.02em' }}>
                Reports Dashboard
              </h1>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="row mb-4">
              <div className="col-12">
                <ErrorAlert 
                  message={error} 
                  onRetry={() => fetchDashboardData()}
                />
              </div>
            </div>
          )}

          {/* Filters Row */}
          <div className="row g-3 mb-4">
            <div className="col-lg-3 col-md-6">
              <CustomSelect
                id="dateRange"
                label="Date Range"
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                options={['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year']}
              />
            </div>
            
            <div className="col-lg-3 col-md-6">
              <CustomSelect
                id="events"
                label="Events"
                value={selectedEvents}
                onChange={(e) => setSelectedEvents(e.target.value)}
                options={['All Events', 'Active Events', 'Past Events', 'Upcoming Events']}
              />
            </div>
            
            <div className="col-lg-3 col-md-6">
              <CustomSelect
                id="userType"
                label="User Type"
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                options={['All', 'Organizers', 'Attendees', 'Premium Users']}
              />
            </div>
            
            <div className="col-lg-3 col-md-6 d-flex align-items-center">
              <button 
                className="btn text-white fw-medium w-100"
                style={{ 
                  backgroundColor: '#8b5cf6',
                  borderColor: '#8b5cf6',
                  height: '38px',
                  padding: '0.375rem 0.75rem',
                  fontSize: '1rem',
                  lineHeight: '1.5'
                }}
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-xl-3 col-lg-6 col-md-6">
              <div 
                className="card border-0 text-white h-100"
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
              >
                <div className="card-body">
                  <div className="small opacity-75 fw-medium mb-2">Total Revenue</div>
                  <div className="h3 fw-bold mb-0">
                    {loading ? <LoadingSkeleton /> : formatCurrency(dashboardData.totalRevenue)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-xl-3 col-lg-6 col-md-6">
              <div 
                className="card border-0 text-white h-100"
                style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' }}
              >
                <div className="card-body">
                  <div className="small opacity-75 fw-medium mb-2">Total Events</div>
                  <div className="h3 fw-bold mb-0">
                    {loading ? <LoadingSkeleton /> : formatNumber(dashboardData.totalEvents)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-xl-3 col-lg-6 col-md-6">
              <div 
                className="card border-0 h-100"
                style={{ 
                  background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)',
                  color: '#4c1d95'
                }}
              >
                <div className="card-body">
                  <div className="small fw-medium mb-2" style={{ opacity: 0.8 }}>Total Users</div>
                  <div className="h3 fw-bold mb-0">
                    {loading ? <LoadingSkeleton /> : formatNumber(dashboardData.totalUsers)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-xl-3 col-lg-6 col-md-6">
              <div 
                className="card border-0 h-100"
                style={{ 
                  background: 'linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%)',
                  color: '#4c1d95'
                }}
              >
                <div className="card-body">
                  <div className="small fw-medium mb-2" style={{ opacity: 0.8 }}>Total Tickets</div>
                  <div className="h3 fw-bold mb-0">
                    {loading ? <LoadingSkeleton /> : formatNumber(dashboardData.totalTickets)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div 
                className="card border-0 shadow-sm"
                style={{ 
                  boxShadow: '0 8px 25px 0 rgba(139, 92, 246, 0.1) !important',
                  border: '1px solid rgba(139, 92, 246, 0.1) !important'
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                    <div className="mb-3 mb-md-0">
                      <h5 className="card-title fw-semibold mb-1">Revenue Over Time</h5>
                      <p className="text-muted small mb-0">Daily revenue for the past 7 days</p>
                    </div>
                    <div 
                      className="card text-white px-3 py-2 border-0"
                      style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
                    >
                      <div className="small opacity-75 mb-1">Tickets Sold</div>
                      <div className="fw-bold">
                        {loading ? '...' : formatNumber(dashboardData.totalTickets)}
                      </div>
                    </div>
                  </div>

                  <div 
                    className="rounded-3 p-4 w-100"
                    style={{ 
                      height: '400px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      overflow: 'auto'
                    }}
                  >
                    {loading ? (
                      <LoadingSkeleton />
                    ) : (
                      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <svg 
                          viewBox="0 0 1200 350" 
                          preserveAspectRatio="xMidYMid meet"
                          className="w-100 h-auto"
                          style={{ maxHeight: '300px' }}
                        >
                          <defs>
                            <pattern id="grid" width="100" height="35" patternUnits="userSpaceOnUse">
                              <path d="M 100 0 L 0 0 0 35" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                            </pattern>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2"/>
                              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05"/>
                            </linearGradient>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                          
                          {/* Y-axis */}
                          <line x1="80" y1="40" x2="80" y2="280" stroke="#d1d5db" strokeWidth="2"/>
                          
                          {/* X-axis */}
                          <line x1="80" y1="280" x2="1120" y2="280" stroke="#d1d5db" strokeWidth="2"/>
                          
                          {/* Y-axis labels */}
                          {[20, 15, 10, 5, 0].map((value, i) => (
                            <text
                              key={i}
                              x="70"
                              y={60 + i * 48}
                              fontSize="14"
                              fill="#6b7280"
                              textAnchor="end"
                              dominantBaseline="middle"
                            >
                              {value}k
                            </text>
                          ))}

                          {/* Render chart data */}
                          {dashboardData.chartData.length > 0 ? (
                            dashboardData.chartData.map((point, index, arr) => {
                              const nextPoint = arr[index + 1];
                              const x = 150 + (index * 130);
                              const maxValue = Math.max(...dashboardData.chartData.map(p => p.value), 1);
                              const y = 280 - (point.value * 220 / Math.max(maxValue, 20));
                              
                              return (
                                <g key={index}>
                                  {nextPoint && (
                                    <line
                                      x1={x}
                                      y1={y}
                                      x2={150 + ((index + 1) * 130)}
                                      y2={280 - (nextPoint.value * 220 / Math.max(maxValue, 20))}
                                      stroke="#8b5cf6"
                                      strokeWidth="4"
                                      strokeLinecap="round"
                                    />
                                  )}
                                  
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r="8"
                                    fill="#ffffff"
                                    stroke="#8b5cf6"
                                    strokeWidth="4"
                                  />
                                  
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r="4"
                                    fill="#8b5cf6"
                                  />

                                  <text
                                    x={x}
                                    y={305}
                                    fontSize="12"
                                    fill="#6b7280"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                  >
                                    {point.label}
                                  </text>
                                </g>
                              );
                            })
                          ) : (
                            <text
                              x="600"
                              y="160"
                              fontSize="16"
                              fill="#6b7280"
                              textAnchor="middle"
                            >
                              No data available
                            </text>
                          )}
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 pb-0">
                  <h5 className="card-title fw-semibold mb-0">Recent Events</h5>
                  <p className="text-muted small mb-3">Latest events and their performance</p>
                </div>
                <div className="card-body p-0">
                  {loading ? (
                    <div className="p-4">
                      <LoadingSkeleton />
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col" style={{ width: '20px' }}></th>
                            <th scope="col">Event Name</th>
                            <th scope="col">Date</th>
                            <th scope="col">Revenue</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.tableData.length > 0 ? (
                            dashboardData.tableData.map((row, index) => (
                              <tr key={index}>
                                <td className="align-middle">
                                  <div 
                                    className="rounded-circle"
                                    style={{ 
                                      width: '8px', 
                                      height: '8px', 
                                      backgroundColor: '#8b5cf6'
                                    }}
                                  ></div>
                                </td>
                                <td className="align-middle">
                                  <div className="fw-medium text-dark">{row.name}</div>
                                </td>
                                <td className="align-middle">
                                  <small className="text-muted">
                                    {new Date(row.date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </small>
                                </td>
                                <td className="align-middle">
                                  <div className="fw-medium text-dark">
                                    {formatCurrency(row.amount)}
                                  </div>
                                </td>
                                <td className="align-middle">
                                  <span className={`badge rounded-pill px-3 py-1 ${
                                    row.status === 'Live' ? 'bg-success-subtle text-success-emphasis' :
                                    row.status === 'Upcoming' ? 'bg-warning-subtle text-warning-emphasis' :
                                    'bg-secondary-subtle text-secondary-emphasis'
                                  }`}>
                                    {row.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center py-4 text-muted">
                                No events found for the selected criteria
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bootstrap JS */}
      <script 
        src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"
      ></script>
    </>
  );
};

export default ReportsDashboard;