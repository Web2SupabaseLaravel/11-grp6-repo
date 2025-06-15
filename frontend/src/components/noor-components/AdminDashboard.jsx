import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ChevronDown, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('Events');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('Month');

    const API_BASE_URL = 'http://localhost:8000/api';

    const [dashboardStats, setDashboardStats] = useState({
        totalEvents: { value: 0, change: 0, trend: 'up' },
        activeEvents: { value: 0, change: 0, trend: 'up' },
        newRegistrations: { value: 0, change: 0, trend: 'up' },
        totalUsers: { value: 0, change: 0, trend: 'up' }
    });

    const [chartData, setChartData] = useState([]);
    const [platformData, setPlatformData] = useState([]);
    const [countryData, setCountryData] = useState([]);

    const cardColors = ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE'];
    const pieChartColors = ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#6D28D9', '#4C1D95', '#F87171', '#FBBF24'];

    const getAuthToken = () => {
        return localStorage.getItem('auth_token') || localStorage.getItem('authToken') || '';
    };

    const getDateRange = (range) => {
        const now = new Date();
        let startDate = new Date();
        
        switch(range) {
            case 'Week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'Month':
                startDate.setDate(now.getDate() - 30);
                break;
            case 'Year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }
        
        return {
            start: startDate.toISOString().split('T')[0],
            end: now.toISOString().split('T')[0]
        };
    };

    const fetchDashboardStats = async () => {
        try {
            const token = getAuthToken();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            };

            const [eventsResponse, usersResponse, ticketsResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/events`, config),
                axios.get(`${API_BASE_URL}/users`, config),
                axios.get(`${API_BASE_URL}/tickets`, config)
            ]);

            const allEvents = eventsResponse.data.data || eventsResponse.data || [];
            const allUsers = usersResponse.data.data || usersResponse.data || [];
            const allTickets = ticketsResponse.data.data || ticketsResponse.data || [];

            const totalEvents = Array.isArray(allEvents) ? allEvents.length : 0;
            const activeEvents = Array.isArray(allEvents) ? allEvents.filter(event => {
                const eventDate = new Date(event.date || event.created_at);
                const now = new Date();
                return eventDate >= now || event.status === 'active';
            }).length : 0;
            
            const totalUsers = Array.isArray(allUsers) ? allUsers.length : 0;

            // Mock change percentages as API doesn't provide historical data
            const eventsChange = (Math.random() * 20 - 10);
            const usersChange = (Math.random() * 15);
            const activeEventsChange = (Math.random() * 15 - 5);

            setDashboardStats({
                totalEvents: {
                    value: totalEvents,
                    change: eventsChange,
                    trend: eventsChange >= 0 ? 'up' : 'down'
                },
                activeEvents: {
                    value: activeEvents,
                    change: activeEventsChange,
                    trend: activeEventsChange >= 0 ? 'up' : 'down'
                },
                newRegistrations: { 
                    value: totalUsers,
                    change: usersChange,
                    trend: usersChange >= 0 ? 'up' : 'down'
                },
                totalUsers: {
                    value: totalUsers,
                    change: usersChange,
                    trend: usersChange >= 0 ? 'up' : 'down'
                }
            });
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load dashboard statistics.');
            
            setDashboardStats({
                totalEvents: { value: 0, change: 0, trend: 'up' },
                activeEvents: { value: 0, change: 0, trend: 'up' },
                newRegistrations: { value: 0, change: 0, trend: 'up' },
                totalUsers: { value: 0, change: 0, trend: 'up' }
            });
        }
    };

    const fetchChartData = async (tab, range) => {
        try {
            const token = getAuthToken();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            };

            const dateRange = getDateRange(range);
            let data = [];

            if (tab === 'Events') {
                const response = await axios.get(`${API_BASE_URL}/events`, config);
                const events = response.data.data || response.data || [];
                
                for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    const dayEvents = events.filter(event => {
                        const eventDate = (event.created_at || event.date || '').split('T')[0];
                        return eventDate === dateStr;
                    });
                    
                    data.push({
                        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                        value: dayEvents.length
                    });
                }
            } else if (tab === 'Tickets') {
                const response = await axios.get(`${API_BASE_URL}/tickets`, config);
                const tickets = response.data.data || response.data || [];
                
                for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    const dayTickets = tickets.filter(ticket => {
                        const ticketDate = (ticket.created_at || '').split('T')[0];
                        return ticketDate === dateStr;
                    });
                    
                    data.push({
                        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                        value: dayTickets.length
                    });
                }
            } else if (tab === 'Sales') {
                const response = await axios.get(`${API_BASE_URL}/buys`, config);
                const buys = response.data.data || response.data || [];
                
                for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    const dayBuys = buys.filter(buy => {
                        const buyDate = (buy.created_at || '').split('T')[0];
                        return buyDate === dateStr;
                    });
                    
                    const dayRevenue = dayBuys.reduce((sum, buy) => 
                        sum + (parseFloat(buy.total_amount) || parseFloat(buy.amount) || 0), 0
                    );
                    
                    data.push({
                        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                        value: Math.round(dayRevenue)
                    });
                }
            }

            setChartData(data);
        } catch (err) {
            console.error(`Error fetching chart data for ${tab}:`, err.message);
            setChartData([]);
            setError(`Failed to load chart data for ${tab}. ${err.response?.data?.message || err.message}`);
        }
    };

    // Generate mock data since API doesn't provide it
    const generateMockPlatformData = () => {
        const platforms = ['Web', 'Mobile App', 'Partner Sites', 'Social Media'];
        const data = platforms.map(platform => ({
            name: platform,
            value: Math.floor(Math.random() * 100) + 20
        }));
        setPlatformData(data);
    };

    // Generate mock data since API doesn't provide it
    const generateMockCountryData = () => {
        const countries = [
            { name: 'Palestine', value: 45.2 },
            { name: 'Jordan', value: 23.1 },
            { name: 'Lebanon', value: 15.7 },
            { name: 'Syria', value: 8.9 },
            { name: 'Others', value: 7.1 }
        ];
        
        const formattedData = countries.map((item, index) => ({
            ...item,
            color: pieChartColors[index % pieChartColors.length]
        }));
        
        setCountryData(formattedData);
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            setError(null);

            try {
                await Promise.allSettled([
                    fetchDashboardStats(),
                    fetchChartData(activeTab, timeRange)
                ]);
                
                generateMockPlatformData();
                generateMockCountryData();

            } catch (err) {
                console.error('An error occurred during initial data loading:', err);
                setError('An unexpected error occurred during initial data loading.');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        if (!loading) {
            fetchChartData(activeTab, timeRange);
        }
    }, [activeTab, timeRange, loading]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchDashboardStats();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleTabChange = (tab) => setActiveTab(tab);
    const handleTimeRangeChange = (range) => setTimeRange(range);

    const handleRetry = () => {
        setError(null);
        setLoading(true);

        Promise.allSettled([
            fetchDashboardStats(),
            fetchChartData(activeTab, timeRange)
        ])
            .catch((err) => {
                console.error('Retry failed:', err);
                setError('Failed to load dashboard data after retry. Please check API status.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const LoadingSkeleton = () => (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60px' }}>
            <div className="spinner-border spinner-border-sm text-white" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

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

    const StatCard = ({ title, value, change, bgColor, loading }) => (
        <div className="col-6 col-lg-3 mb-3">
            <div className="card text-white h-100 border-0 rounded-3" style={{ backgroundColor: bgColor }}>
                <div className="card-body p-3">
                    {loading ? (
                        <LoadingSkeleton />
                    ) : (
                        <>
                            <div className="d-flex justify-content-between align-items-start">
                                <small className="fw-normal opacity-75">{title}</small>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d={change >= 0 ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5"} />
                                </svg>
                            </div>
                            <div className="fw-bold fs-4 lh-1 mb-1">
                                {typeof value === 'number' ? formatNumber(value) : value}
                            </div>
                            <small className="opacity-75">
                                {change > 0 ? '+' : ''}{change.toFixed(1)}%
                            </small>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    const CustomSelect = ({ value, onChange, options, label, id }) => (
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
    );

    return (
        <>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet" />

            <div className="bg-light min-vh-100" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                <div className="container-fluid p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h2 fw-semibold" style={{ color: '#8b5cf6', letterSpacing: '-0.02em' }}>
                            Admin Dashboard
                        </h1>
                    </div>

                    {error && (
                        <div className="mb-4">
                            <ErrorAlert 
                                message={error} 
                                onRetry={handleRetry}
                            />
                        </div>
                    )}

                    <div className="row mb-4">
                        <StatCard
                            title="Total Events"
                            value={dashboardStats.totalEvents.value}
                            change={dashboardStats.totalEvents.change}
                            bgColor={cardColors[0]}
                            loading={loading}
                        />
                        <StatCard
                            title="Active Events"
                            value={dashboardStats.activeEvents.value}
                            change={dashboardStats.activeEvents.change}
                            bgColor={cardColors[1]}
                            loading={loading}
                        />
                        <StatCard
                            title="New Registrations"
                            value={dashboardStats.newRegistrations.value}
                            change={dashboardStats.newRegistrations.change}
                            bgColor={cardColors[2]}
                            loading={loading}
                        />
                        <StatCard
                            title="Total Users"
                            value={dashboardStats.totalUsers.value}
                            change={dashboardStats.totalUsers.change}
                            bgColor={cardColors[3]}
                            loading={loading}
                        />
                    </div>

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                                <div className="mb-3 mb-md-0">
                                    <ul className="nav nav-tabs border-0">
                                        {['Events', 'Tickets', 'Sales'].map(tab => (
                                            <li className="nav-item" key={tab}>
                                                <button
                                                    className={`nav-link ${activeTab === tab ? 'active' : ''} border-0`}
                                                    onClick={() => handleTabChange(tab)}
                                                    style={{
                                                        color: activeTab === tab ? '#8b5cf6' : '#6b7280',
                                                        borderBottom: activeTab === tab ? '2px solid #8b5cf6' : 'none'
                                                    }}
                                                >
                                                    {tab}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="btn-group" role="group">
                                    {['Week', 'Month', 'Year'].map(range => (
                                        <button
                                            key={range}
                                            type="button"
                                            className={`btn btn-sm ${timeRange === range ? 'text-white' : 'btn-outline-primary'}`}
                                            style={{
                                                backgroundColor: timeRange === range ? '#8b5cf6' : 'transparent',
                                                borderColor: '#8b5cf6',
                                                color: timeRange === range ? 'white' : '#8b5cf6'
                                            }}
                                            onClick={() => handleTimeRangeChange(range)}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ height: '400px' }}>
                                {loading && chartData.length === 0 ? (
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                        <div className="spinner-border" style={{ color: '#8b5cf6' }} role="status">
                                            <span className="visually-hidden">Loading chart data...</span>
                                        </div>
                                    </div>
                                ) : chartData.length === 0 ? (
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                        <div className="text-center text-muted">
                                            No data available for this chart. Please check API.
                                        </div>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                            />
                                            <YAxis 
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'white',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#8B5CF6"
                                                strokeWidth={3}
                                                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                                                activeDot={{ r: 6, fill: '#8B5CF6' }}
                                                animationDuration={1000}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-4">
                                    <h5 className="card-title fw-semibold mb-4">Ticket Sales by Platform</h5>
                                    {loading && platformData.length === 0 ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
                                            <div className="spinner-border" style={{ color: '#8b5cf6' }} role="status">
                                                <span className="visually-hidden">Loading platform data...</span>
                                            </div>
                                        </div>
                                    ) : platformData.length === 0 ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
                                            <div className="text-center text-muted">
                                                No platform data available.
                                            </div>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={platformData}>
                                                <XAxis 
                                                    dataKey="name" 
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                                />
                                                <YAxis 
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                />
                                                <Bar 
                                                    dataKey="value" 
                                                    fill="#8B5CF6" 
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-4">
                                    <h5 className="card-title fw-semibold mb-4">Event Distribution by Country</h5>
                                    {loading && countryData.length === 0 ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
                                            <div className="spinner-border" style={{ color: '#8b5cf6' }} role="status">
                                                <span className="visually-hidden">Loading country data...</span>
                                            </div>
                                        </div>
                                    ) : countryData.length === 0 ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
                                            <div className="text-center text-muted">
                                                No country data available.
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="d-flex align-items-center">
                                            <div style={{ width: '60%', height: '250px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={countryData}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={80}
                                                            innerRadius={40}
                                                        >
                                                            {countryData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: 'white',
                                                                border: '1px solid #e5e7eb',
                                                                borderRadius: '8px',
                                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                            }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div style={{ width: '40%' }}>
                                                <ul className="list-unstyled mb-0">
                                                    {countryData.map((entry, index) => (
                                                        <li key={`legend-${index}`} className="d-flex align-items-center mb-2">
                                                            <span 
                                                                className="d-inline-block rounded-circle me-2" 
                                                                style={{ 
                                                                    backgroundColor: entry.color, 
                                                                    width: '12px', 
                                                                    height: '12px' 
                                                                }}
                                                            ></span>
                                                            <span className="text-muted small">
                                                                {entry.name}: {entry.value}%
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;