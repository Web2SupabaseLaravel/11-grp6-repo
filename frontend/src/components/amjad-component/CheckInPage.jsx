import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CheckInPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('Waiting');
  const [isLoading, setIsLoading] = useState(false);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState('');
  const [checkinsLoading, setCheckinsLoading] = useState(true);

  // Base URL for your Laravel API
  const API_BASE_URL = 'http://localhost:8000/api'; // Make sure this is your correct Laravel API URL

  // Fetch initial data when the page loads
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log('🔄 Fetching initial data...');

        // Fetch users from /api/users
        const usersResponse = await axios.get(`${API_BASE_URL}/users`);
        console.log('📥 Users Response:', usersResponse.data);
        // Assuming usersResponse.data is an array of user objects directly
        setUsers(usersResponse.data);

        // Fetch tickets from /api/tickets
        const ticketsResponse = await axios.get(`${API_BASE_URL}/tickets`);
        console.log('📥 Tickets Response:', ticketsResponse.data);
        // Assuming ticketsResponse.data is an array of ticket objects directly
        setTickets(ticketsResponse.data);

        // Fetch recent check-ins (buys)
        const buysResponse = await axios.get(`${API_BASE_URL}/buys`);
        console.log('📥 Buys Response:', buysResponse.data);

        // Ensure buysResponse.data.data exists and is an array
        if (buysResponse.data && Array.isArray(buysResponse.data.data)) {
          const recentData = buysResponse.data.data
            .slice(-5) // Last 5 check-ins
            .reverse()
            .map(buy => ({
              id: buy.id,
              name: buy.user?.name || `User ${buy.user_id}`,
              email: buy.user?.email || '',
              // Check if buy.ticket exists and has a 'title' or 'name' property
              ticketName: buy.ticket?.title || buy.ticket?.name || `Ticket ${buy.ticket_id}`, 
              time: new Date(buy.purchase_date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })
            }));
          setRecentCheckins(recentData);
        } else {
            console.warn('Recent buys data is not in the expected format (buysResponse.data.data is missing or not an array).');
            setRecentCheckins([]); // Set to empty array if format is unexpected
        }

      } catch (error) {
        console.error('❌ Error fetching initial data:', error);
        console.error('Error details:', error.response?.data);

        // Fallback to dummy data in case of error
        setUsers([
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
        ]);

        setTickets([
          { id: 1, title: 'VIP Ticket', price: 100 }, // Changed 'name' to 'title' as per Laravel Ticket model schema
          { id: 2, title: 'General Admission', price: 50 },
          { id: 3, title: 'Student Ticket', price: 25 }
        ]);
        setStatus('❌ Failed to load initial data. Using dummy data.');
      } finally {
        setCheckinsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Find user by ID or email
  const findUser = (searchValue) => {
    return users.find(user =>
      user.id.toString() === searchValue.toString() ||
      user.email.toLowerCase() === searchValue.toLowerCase()
    );
  };

  // Check for existing registration (client-side for now, optimize with API if needed)
  const checkExistingRegistration = async (userId, ticketId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/buys`);
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data.some(buy =>
          buy.user_id.toString() === userId.toString() &&
          buy.ticket_id.toString() === ticketId.toString()
        );
      }
      return false;
    } catch (error) {
      console.error('Error checking existing registration:', error);
      return false;
    }
  };

  const handleManualCheckIn = async () => {
    if (!searchTerm.trim()) {
      setStatus('Please enter User ID or email');
      return;
    }

    if (!selectedTicket) {
      setStatus('Please select a ticket');
      return;
    }

    setIsLoading(true);
    setStatus('Processing...');

    try {
      // Find the user
      const user = findUser(searchTerm.trim());
      if (!user) {
        setStatus('User not found');
        setIsLoading(false);
        return;
      }

      // Check for existing registration
      const existingRegistration = await checkExistingRegistration(user.id, selectedTicket);
      if (existingRegistration) {
        setStatus('User already checked in for this ticket');
        setIsLoading(false);
        return;
      }

      // Create a new registration (buy)
      // We are hitting the /buys endpoint as per your api.php for purchase/check-in
      const response = await axios.post(`${API_BASE_URL}/buys`, {
        user_id: user.id,
        ticket_id: selectedTicket,
        purchase_date: new Date().toISOString() // Or send the current date/time from the backend if preferred
      });

      console.log('✅ Success:', response.data);

      if (response.data.message === 'Buy created successfully' || response.data.data) { // Assuming success message or data presence
        setStatus('✅ Check-in successful!');

        // Add the new check-in to the list
        const newCheckin = {
          id: response.data.data.id,
          name: user.name,
          email: user.email,
          ticketName: tickets.find(t => t.id.toString() === selectedTicket.toString())?.title || `Ticket ${selectedTicket}`,
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        setRecentCheckins(prev => [newCheckin, ...prev.slice(0, 4)]);

        // Reset the form
        setSearchTerm('');
        setSelectedTicket('');

        // Reset status after 3 seconds
        setTimeout(() => {
          setStatus('Waiting');
        }, 3000);
      } else {
          setStatus('❌ Check-in failed: Unexpected API response');
      }
    } catch (error) {
      console.error('❌ Error:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        setStatus(`❌ ${error.response.data.message}`);
      } else if (error.response?.data?.errors) {
          // Handle Laravel validation errors
          const firstError = Object.values(error.response.data.errors)[0][0];
          setStatus(`❌ ${firstError}`);
      } else {
        setStatus('❌ Something went wrong');
      }
    }

    setIsLoading(false);
  };

  // Auto-suggestions while typing
  const getSuggestions = () => {
    if (!searchTerm.trim()) return [];

    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm)
    ).slice(0, 5);
  };

  const getStatusColor = () => {
    switch(true) {
      case status.includes('✅'): return 'text-success';
      case status.includes('Processing'): return 'text-warning';
      case status.includes('❌') || status.includes('not found') || status.includes('Please'): return 'text-danger';
      default: return 'text-muted';
    }
  };

  const getStatusIcon = () => {
    switch(true) {
      case status.includes('✅'): return '✅';
      case status.includes('Processing'): return '⏳';
      case status.includes('❌'): return '❌';
      case status.includes('Please') || status.includes('not found'): return '⚠️';
      default: return '⭕';
    }
  };

  const suggestions = getSuggestions();

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      
      <div className="min-vh-100 bg-light">
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
          <div className="container-fluid px-3 px-lg-4">
            <a className="navbar-brand fw-bold fs-4 text-primary" href="#" style={{ color: '#6c5ce7' }}>
              evently
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <div className="navbar-nav ms-auto d-flex align-items-center gap-2">
                <a className="nav-link text-muted d-none d-lg-block" href="#">Home</a>
                <a className="nav-link text-muted d-none d-lg-block" href="#">About</a>
                <a className="nav-link text-muted" href="#">Events</a>
                <button className="btn btn-outline-primary btn-sm mx-1">Log In</button>
                <button className="btn btn-primary btn-sm mx-1" style={{ backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' }}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-6">
              <div className="bg-white rounded-3 shadow-sm p-3 p-md-4">
                <h2 className="mb-4 fw-bold text-center text-md-start">Check In</h2>
                
                <div className="row g-4">
                  <div className="col-12 col-lg-6">
                    <div className="bg-light rounded-3 p-4 text-center position-relative" style={{ minHeight: '200px' }}>
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <div className="text-center">
                          <div className="mb-3">
                            <div className="mx-auto bg-white border rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                              <div className="d-flex flex-column align-items-center">
                                {[...Array(12)].map((_, i) => (
                                  <div 
                                    key={i}
                                    className="bg-dark mb-1" 
                                    style={{ 
                                      width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '2px' : '1px', 
                                      height: '8px' 
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <small className="text-muted">Scan QR Code</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="h-100 d-flex flex-column justify-content-center">
                      <div className="mb-3 position-relative">
                        <label className="form-label fw-semibold">Search by ID, Name or Email:</label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg" 
                          placeholder="Enter ID, name or email"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        {/* Suggestions list */}
                        {suggestions.length > 0 && searchTerm && (
                          <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1" style={{zIndex: 1000}}>
                            {suggestions.map((user) => (
                              <div 
                                key={user.id}
                                className="p-2 border-bottom cursor-pointer hover-bg-light"
                                style={{cursor: 'pointer'}}
                                onClick={() => {
                                  setSearchTerm(user.email);
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                              >
                                <div className="fw-medium">{user.name}</div>
                                <small className="text-muted">{user.email} (ID: {user.id})</small>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Select Ticket:</label>
                        <select 
                          className="form-select form-select-lg"
                          value={selectedTicket}
                          onChange={(e) => setSelectedTicket(e.target.value)}
                        >
                          <option value="">Choose a ticket...</option>
                          {tickets.length > 0 ? (
                            tickets.map((ticket) => (
                              // Use ticket.title as the display name if available, otherwise fallback to ticket.name
                              <option key={ticket.id} value={ticket.id}>
                                {ticket.title || ticket.name || `Ticket ${ticket.id}`} {ticket.price && `- ${ticket.price}`}
                              </option>
                            ))
                          ) : (
                            <option disabled>Loading tickets...</option>
                          )}
                        </select>
                        {tickets.length === 0 && (
                          <small className="text-muted mt-1 d-block">
                            📍 Debug: No tickets loaded. Check console for API response.
                          </small>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <label className="form-label fw-semibold">Status:</label>
                        <div className="d-flex align-items-center">
                          <span className={`${getStatusColor()} me-2 fs-5`}>{getStatusIcon()}</span>
                          <span className={`${getStatusColor()} fw-medium`}>{status}</span>
                        </div>
                      </div>

                      <div className="d-grid">
                        <button 
                          className="btn text-white fw-medium py-2"
                          style={{ backgroundColor: isLoading ? '#9ca3af' : '#6c5ce7', border: 'none' }}
                          onClick={handleManualCheckIn}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Processing...
                            </>
                          ) : (
                            'Manual Check-In'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h5 className="fw-bold mb-3">Recent Check-ins</h5>
                  {checkinsLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : recentCheckins.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      No recent check-ins
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {recentCheckins.map((checkin, index) => (
                        <div key={`${checkin.id}-${index}`} className="list-group-item border-0 px-0 py-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <span className="text-dark fw-medium d-block">{checkin.name}</span>
                              <small className="text-muted">{checkin.email}</small>
                              <br />
                              <small className="text-muted">Ticket: {checkin.ticketName}</small>
                            </div>
                            <small className="text-muted">{checkin.time}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center text-muted mt-5 pb-4">
          <div className="container">
            <small>© 2025 Evently, All rights reserved.</small>
          </div>
        </footer>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </>
  );
};

export default CheckInPage;