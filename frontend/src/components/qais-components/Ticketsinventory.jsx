import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TicketsInventory = () => {
  const navigate = useNavigate();
  
  // State management
  const [filterBy, setFilterBy] = useState('Event');
  const [ticketType, setTicketType] = useState('');
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API configuration
  const API_BASE_URL = 'http://localhost:8000/api';
  
  // Helper function to get auth token
  const getAuthToken = () => {
    return 'yFlMjSup.IbHOCjyRiTb8QOO9Ltsbr'; // API key from documentation
  };

  // Fetch tickets from Laravel API
  useEffect(() => {
    let isMounted = true;
    
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getAuthToken();
        
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'api-key': token
        };
        
        // Fetch tickets from Laravel API
        const response = await fetch(`${API_BASE_URL}/tickets`, {
          method: 'GET',
          headers: headers
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (isMounted) {
          // Handle different response structures from Laravel
          let ticketsData = [];
          
          if (Array.isArray(data)) {
            ticketsData = data;
          } else if (data.data && Array.isArray(data.data)) {
            ticketsData = data.data;
          } else if (data.tickets && Array.isArray(data.tickets)) {
            ticketsData = data.tickets;
          } else {
            console.warn('Unexpected API response structure:', data);
            ticketsData = [];
          }
          
          // Transform data to match component expectations
          const transformedTickets = ticketsData.map(ticket => ({
            id: ticket.id || ticket.ticket_id || `TK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: ticket.name || ticket.title || ticket.ticket_name || 'Not Specified',
            event: ticket.event?.title || ticket.event_name || ticket.event || 'Not Specified',
            price: parseFloat(ticket.price || 0),
            available: parseInt(ticket.available || ticket.available_quantity || 0),
            sold: parseInt(ticket.sold || ticket.sold_quantity || 0),
            status: ticket.status || 'Active',
            created_at: ticket.created_at,
            updated_at: ticket.updated_at,
            event_id: ticket.event_id,
            description: ticket.description
          }));
          
          setTickets(transformedTickets);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        if (isMounted) {
          let errorMessage = 'Failed to load tickets. Check your internet connection and try again.';
          
          if (error.message.includes('404')) {
            errorMessage = 'API endpoint not found. Check the API URL.';
          } else if (error.message.includes('401')) {
            errorMessage = 'Unauthorized access. Check your token validity.';
          } else if (error.message.includes('500')) {
            errorMessage = 'Server error. Please try again later.';
          } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Cannot connect to server. Check if the API is running.';
          }
          
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTickets();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Delete ticket function
  const handleDelete = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'api-key': token
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove ticket from local state after successful deletion
      setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
      
      alert('Ticket deleted successfully');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      let errorMessage = 'An error occurred while deleting the ticket';
      
      if (error.message.includes('404')) {
        errorMessage = 'Ticket not found';
      } else if (error.message.includes('403')) {
        errorMessage = 'You do not have permission to delete this ticket';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Edit ticket function
  const handleEdit = (ticketId) => {
    // Navigate to edit page using React Router
    navigate(`/tickets/edit/${ticketId}`);
  };

  // View ticket function
  const handleView = (ticketId) => {
    // Navigate to view page using React Router
    navigate(`/tickets/${ticketId}`);
  };

  // Filter and search tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchTerm || 
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !status || ticket.status === status;
    const matchesType = !ticketType || ticket.name.toLowerCase().includes(ticketType.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate totals
  const totalTickets = filteredTickets.length;
  const soldTickets = filteredTickets.reduce((sum, ticket) => sum + ticket.sold, 0);
  const availableTickets = filteredTickets.reduce((sum, ticket) => sum + ticket.available, 0);
  const totalRevenue = filteredTickets.reduce((sum, ticket) => sum + (ticket.price * ticket.sold), 0);

  const handleAddTickets = () => {
    navigate('/create-ticket');
  };

  const handleImportExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Ticket ID,Name,Event,Price,Available,Sold,Status\n"
      + filteredTickets.map(ticket => 
          `${ticket.id},${ticket.name},${ticket.event},${ticket.price},${ticket.available},${ticket.sold},${ticket.status}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tickets_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { class: 'success', text: 'Active' },
      'Sold Out': { class: 'danger', text: 'Sold Out' },
      'Draft': { class: 'warning', text: 'Draft' }
    };
    
    const config = statusConfig[status] || { class: 'secondary', text: status };
    
    return (
      <span className={`badge bg-${config.class} px-2 py-1`} style={{ fontSize: '0.75rem' }}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="alert alert-danger text-center">
          <h5>Error Loading Data</h5>
          <p className="mb-0">{error}</p>
          <button 
            className="btn btn-outline-danger mt-3" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header matching the design */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 fw-bold text-dark mb-0">Tickets Inventory</h2>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary btn-sm px-3"
            onClick={handleImportExport}
          >
            Import/Export
          </button>
          <button 
            className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-1"
            onClick={handleAddTickets}
            style={{ backgroundColor: '#6366f1', borderColor: '#6366f1' }}
          >
            Add Tickets
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="row mb-4 g-3">
        <div className="col-md-2">
          <label className="form-label small text-muted mb-1">Filter by</label>
          <select 
            className="form-select form-select-sm"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="Event">Event</option>
            <option value="Type">Type</option>
            <option value="Status">Status</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label small text-muted mb-1">Ticket Type</label>
          <select 
            className="form-select form-select-sm"
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="VIP">VIP</option>
            <option value="General">General</option>
            <option value="Early Bird">Early Bird</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label small text-muted mb-1">Status</label>
          <select 
            className="form-select form-select-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Sold Out">Sold Out</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label small text-muted mb-1">Search tickets</label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control form-control-sm pe-5"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="position-absolute top-50 end-0 translate-middle-y me-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="21 21l-4.35-4.35"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="row mb-4 g-3">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center p-3">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <span className="text-primary fw-bold">📊</span>
              </div>
              <div>
                <div className="text-muted small mb-1">Total Tickets</div>
                <div className="h4 fw-bold mb-0 text-dark">{totalTickets.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center p-3">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <span className="text-success fw-bold">✓</span>
              </div>
              <div>
                <div className="text-muted small mb-1">Sold</div>
                <div className="h4 fw-bold mb-0 text-dark">{soldTickets.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center p-3">
              <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <span className="text-warning fw-bold">📋</span>
              </div>
              <div>
                <div className="text-muted small mb-1">Available</div>
                <div className="h4 fw-bold mb-0 text-dark">{availableTickets.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center p-3">
              <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <span className="text-info fw-bold">💰</span>
              </div>
              <div>
                <div className="text-muted small mb-1">Revenue</div>
                <div className="h4 fw-bold mb-0 text-dark">${totalRevenue.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th className="border-0 text-muted fw-normal small px-4 py-3">Ticket ID</th>
                  <th className="border-0 text-muted fw-normal small px-4 py-3">Name</th>
                  <th className="border-0 text-muted fw-normal small px-4 py-3">Event</th>
                  <th className="border-0 text-muted fw-normal small px-4 py-3">Price</th>
                  <th className="border-0 text-muted fw-normal small px-4 py-3">Available</th>
                  <th className="border-0 text-muted fw-normal small px-4 py-3">Sold</th>
                  <th className="border-0 text-muted fw-normal small px-4 py-3">Status</th>
                  <th className="border-0 text-muted fw-normal small px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-0">
                    <td className="px-4 py-3">
                      <span className="text-dark fw-medium">{ticket.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-dark">{ticket.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted">{ticket.event}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-dark fw-medium">${ticket.price.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-dark">{ticket.available.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-dark">{ticket.sold.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="dropdown">
                        <button 
                          className="btn btn-sm btn-light dropdown-toggle border-0 shadow-sm" 
                          type="button" 
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span style={{ fontSize: '1.2em' }}>⋯</span>
                        </button>
                        <ul className="dropdown-menu shadow">
                          <li>
                            <button 
                              className="dropdown-item" 
                              onClick={() => handleView(ticket.id)}
                            >
                              View
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item" 
                              onClick={() => handleEdit(ticket.id)}
                            >
                              Edit
                            </button>
                          </li>
                          <li><hr className="dropdown-divider"/></li>
                          <li>
                            <button 
                              className="dropdown-item text-danger" 
                              onClick={() => handleDelete(ticket.id)}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && !loading && (
        <div className="text-center py-5">
          <div className="text-muted">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-3">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            <h5>No Tickets Found</h5>
            <p>
              {searchTerm || status || ticketType
                ? `No tickets found matching the specified criteria`
                : 'No tickets are currently available'
              }
            </p>
            {!searchTerm && !status && !ticketType && (
              <button 
                className="btn btn-primary mt-3"
                onClick={handleAddTickets}
              >
                Add New Ticket
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsInventory;