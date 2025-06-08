import React, { useState } from 'react';

const TicketsInventory = () => {
  // State management for tickets data
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    event: '',
    ticketType: '',
    status: '',
    search: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Statistics state
  const [stats, setStats] = useState({
    totalTickets: 0,
    sold: 0,
    available: 0,
    revenue: 0
  });

  // Sample data for demonstration - replace with API call
  const sampleTickets = [
    {
      id: '#TK-2024-001',
      name: 'VIP Access',
      event: 'Annual Conference 2025',
      price: 250.00,
      available: 45,
      sold: 155,
      status: 'Active'
    },
    {
      id: '#TK-2024-002',
      name: 'Early Bird',
      event: 'Annual Conference 2025',
      price: 180.00,
      available: 0,
      sold: 500,
      status: 'Sold Out'
    },
    {
      id: '#TK-2024-003',
      name: 'General Admission',
      event: 'Annual Conference 2025',
      price: 99.00,
      available: 856,
      sold: 1144,
      status: 'Active'
    },
    {
      id: '#TK-2024-004',
      name: 'Workshop Pass',
      event: 'Design Workshop',
      price: 75.00,
      available: 23,
      sold: 77,
      status: 'Active'
    },
    {
      id: '#TK-2024-005',
      name: 'Opening Gala',
      event: 'Summer Festival 2025',
      price: 120.00,
      available: 245,
      sold: 155,
      status: 'Draft'
    },
    {
      id: '#TK-2024-006',
      name: 'VIP Experience',
      event: 'Summer Festival 2025',
      price: 350.00,
      available: 48,
      sold: 52,
      status: 'Active'
    }
  ];

  // API Functions - replace with actual API endpoints
  const fetchTickets = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch('/api/tickets');
      // const data = await response.json();
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTickets(sampleTickets);
      calculateStats(sampleTickets);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tickets data');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };


  const deleteTicket = async (ticketId) => {
    try {
      // Replace with actual API call
      // await fetch(`/api/tickets/${ticketId}`, { method: 'DELETE' });
      
      const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
      setTickets(updatedTickets);
      calculateStats(updatedTickets);
    } catch (err) {
      setError('Failed to delete ticket');
      console.error('Error deleting ticket:', err);
    }
  };

  // Calculate statistics
  const calculateStats = (ticketsData) => {
    const stats = ticketsData.reduce((acc, ticket) => {
      acc.totalTickets += (ticket.available + ticket.sold);
      acc.sold += ticket.sold;
      acc.available += ticket.available;
      acc.revenue += (ticket.sold * ticket.price);
      return acc;
    }, { totalTickets: 0, sold: 0, available: 0, revenue: 0 });
    
    setStats(stats);
  };

  // Filter tickets based on current filters
  const getFilteredTickets = () => {
    return tickets.filter(ticket => {
      const matchesEvent = !filters.event || ticket.event.toLowerCase().includes(filters.event.toLowerCase());
      const matchesType = !filters.ticketType || ticket.name.toLowerCase().includes(filters.ticketType.toLowerCase());
      const matchesStatus = !filters.status || ticket.status === filters.status;
      const matchesSearch = !filters.search || 
        ticket.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.event.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.id.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesEvent && matchesType && matchesStatus && matchesSearch;
    });
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Pagination logic
  const filteredTickets = getFilteredTickets();
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  // Load data on component mount
  React.useEffect(() => {
    fetchTickets();
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'bg-success',
      'Sold Out': 'bg-danger',
      'Draft': 'bg-warning text-dark'
    };
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  const StatCard = ({ title, value, icon, color, bgColor }) => (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className="card h-100 border-0 shadow-sm">
        <div className="card-body d-flex align-items-center">
          <div className="flex-grow-1">
            <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
            <h3 className="card-title mb-0 fw-bold" style={{ color }}>{value}</h3>
          </div>
          <div className={`rounded-circle d-flex align-items-center justify-content-center`} 
               style={{ width: '48px', height: '48px', backgroundColor: bgColor }}>
            <i className={`fas fa-${icon} text-white`} style={{ fontSize: '20px' }}></i>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      
      <div className="row">
        <div className="col-12">
          <div className="bg-white rounded shadow-sm p-4">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
              <h2 className="h3 mb-3 mb-md-0 fw-bold">Tickets Inventory</h2>
              <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
                <button className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>Add Tickets
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-download me-2"></i>Import/Export
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <span className="text-muted">Filter by:</span>
                  <select 
                    className="form-select" 
                    style={{ width: 'auto', minWidth: '120px' }}
                    value={filters.event}
                    onChange={(e) => handleFilterChange('event', e.target.value)}
                  >
                    <option value="">Event</option>
                    <option value="Annual Conference 2025">Annual Conference 2025</option>
                    <option value="Design Workshop">Design Workshop</option>
                    <option value="Summer Festival 2025">Summer Festival 2025</option>
                  </select>
                  <select 
                    className="form-select" 
                    style={{ width: 'auto', minWidth: '120px' }}
                    value={filters.ticketType}
                    onChange={(e) => handleFilterChange('ticketType', e.target.value)}
                  >
                    <option value="">Ticket Type</option>
                    <option value="VIP">VIP</option>
                    <option value="General">General</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                  <select 
                    className="form-select" 
                    style={{ width: 'auto', minWidth: '120px' }}
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">Status</option>
                    <option value="Active">Active</option>
                    <option value="Sold Out">Sold Out</option>
                    <option value="Draft">Draft</option>
                  </select>
                  <div className="ms-auto">
                    <div className="input-group" style={{ minWidth: '250px' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search tickets..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                      />
                      <button className="btn btn-outline-secondary" type="button">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
              <StatCard 
                title="Total Tickets" 
                value={loading ? '...' : stats.totalTickets.toLocaleString()} 
                icon="ticket-alt" 
                color="#333" 
                bgColor="#87CEEB" 
              />
              <StatCard 
                title="Sold" 
                value={loading ? '...' : stats.sold.toLocaleString()} 
                icon="check-circle" 
                color="#333" 
                bgColor="#90EE90" 
              />
              <StatCard 
                title="Available" 
                value={loading ? '...' : stats.available.toLocaleString()} 
                icon="clock" 
                color="#333" 
                bgColor="#F0E68C" 
              />
              <StatCard 
                title="Revenue" 
                value={loading ? '...' : `${stats.revenue.toLocaleString()}`} 
                icon="dollar-sign" 
                color="#333" 
                bgColor="#DDA0DD" 
              />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading tickets...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
                <button 
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={fetchTickets}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredTickets.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-ticket-alt fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No tickets found</h5>
                <p className="text-muted">Try adjusting your filters or add new tickets</p>
              </div>
            )}

            {/* Table */}
            {!loading && !error && filteredTickets.length > 0 && (
              <>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Ticket ID</th>
                        <th>Name</th>
                        <th>Event</th>
                        <th>Price</th>
                        <th>Available</th>
                        <th>Sold</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTickets.map((ticket, index) => (
                        <tr key={ticket.id}>
                          <td className="fw-medium">{ticket.id}</td>
                          <td>{ticket.name}</td>
                          <td className="text-muted">{ticket.event}</td>
                          <td className="fw-medium">${ticket.price.toFixed(2)}</td>
                          <td>{ticket.available.toLocaleString()}</td>
                          <td>{ticket.sold.toLocaleString()}</td>
                          <td>
                            <span className={getStatusBadge(ticket.status)}>
                              {ticket.status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group">
                              <button 
                                className="btn btn-sm btn-outline-primary" 
                                title="Edit"
                                onClick={() => {/* Handle edit */}}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger" 
                                title="Delete"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this ticket?')) {
                                    deleteTicket(ticket.id);
                                  }
                                }}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-secondary" title="More">
                                <i className="fas fa-ellipsis-v"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="text-muted">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
                    </div>
                    <nav>
                      <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                          <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => setCurrentPage(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          transition: transform 0.2s ease-in-out;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .table th {
          font-weight: 600;
          color: #6c757d;
          border-bottom: 2px solid #dee2e6;
        }
        .table td {
          vertical-align: middle;
          padding: 1rem 0.75rem;
        }
        .btn-group .btn {
          border-radius: 0.25rem;
          margin-right: 0.25rem;
        }
        .btn-group .btn:last-child {
          margin-right: 0;
        }
        @media (max-width: 768px) {
          .table-responsive {
            font-size: 0.875rem;
          }
          .btn-group .btn {
            padding: 0.25rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TicketsInventory;