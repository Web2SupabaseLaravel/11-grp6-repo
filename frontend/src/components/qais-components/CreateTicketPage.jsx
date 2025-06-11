import React, { useState, useEffect } from 'react';

const CreateTicketPage = () => {
  const [eventName, setEventName] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tickets, setTickets] = useState([]);
  const [showTickets, setShowTickets] = useState(true); // Show tickets automatically
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);

  // Load existing tickets from API on component mount
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setIsLoadingTickets(true);
        const response = await fetch('http://127.0.0.1:8000/api/tickets');
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
          console.log('Loaded tickets:', data);
        } else {
          console.error('Failed to load tickets');
        }
      } catch (error) {
        console.error('Error loading tickets:', error);
      } finally {
        setIsLoadingTickets(false);
      }
    };

    loadTickets();
  }, []);

  // Validation function
  const validateForm = () => {
    if (!eventName.trim()) {
      setError('Event name is required');
      return false;
    }
    if (!ticketType.trim()) {
      setError('Ticket type is required');
      return false;
    }
    if (!ticketTitle.trim()) {
      setError('Ticket title is required');
      return false;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('Price must be greater than zero');
      return false;
    }
    return true;
  };

  // Create ticket function
  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare data for sending
      const ticketData = {
        event_name: eventName.trim(),
        ticket_type: ticketType.trim(),
        ticket_title: ticketTitle.trim(),
        price: parseFloat(price)
      };

      // Send to API
      const response = await fetch('http://127.0.0.1:8000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData)
      });

      if (response.ok) {
        const newTicket = await response.json();
        
        // Add ticket to local state
        setTickets(prevTickets => [...prevTickets, newTicket]);
        
        console.log('Ticket created successfully:', newTicket);
        setSuccess('Ticket created successfully!');
        
        // Clear form
        setEventName('');
        setTicketType('');
        setTicketTitle('');
        setPrice('');
        
        // Make sure tickets are visible
        setShowTickets(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred while creating the ticket');
      }
      
    } catch (error) {
      console.error('Error creating ticket:', error);
      setError('An error occurred while creating the ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete ticket
  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tickets/${ticketId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTickets(prevTickets => prevTickets.filter(ticket => ticket.ticket_id !== ticketId));
        setSuccess('Ticket deleted successfully');
      } else {
        setError('An error occurred while deleting the ticket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setError('An error occurred while deleting the ticket');
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#8447e9', 
            fontSize: '2rem', 
            fontWeight: '600',
            marginBottom: '8px',
            margin: '0'
          }}>
            Create a New Ticket
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1rem',
            margin: '8px 0 0 0'
          }}>
            Fill the details below to get your Ticket!
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #fecaca',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #bbf7d0',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        {/* Main Form Card */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '40px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          maxWidth: '800px',
          margin: '0 auto 30px auto',
          display: 'flex',
          gap: '40px',
          alignItems: 'flex-start'
        }}>
          
          {/* Ticket Creation Illustration */}
          <div style={{ 
            minWidth: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px'
          }}>
            <svg width="180" height="160" viewBox="0 0 200 180" style={{filter: 'drop-shadow(0 4px 8px rgba(132, 71, 233, 0.15))'}}>
              {/* Main Ticket */}
              <rect x="30" y="40" width="120" height="80" rx="8" fill="white" stroke="#8447e9" strokeWidth="3"/>
              
              {/* Ticket perforation line */}
              <line x1="30" y1="80" x2="150" y2="80" stroke="#8447e9" strokeWidth="2" strokeDasharray="3,3"/>
              
              {/* Ticket details lines */}
              <line x1="40" y1="55" x2="100" y2="55" stroke="#d1d5db" strokeWidth="2"/>
              <line x1="40" y1="65" x2="85" y2="65" stroke="#d1d5db" strokeWidth="2"/>
              <line x1="40" y1="95" x2="90" y2="95" stroke="#d1d5db" strokeWidth="2"/>
              <line x1="40" y1="105" x2="75" y2="105" stroke="#d1d5db" strokeWidth="2"/>
              
              {/* Price tag */}
              <rect x="110" y="50" width="30" height="20" rx="4" fill="#8447e9"/>
              <text x="125" y="63" fill="white" fontSize="10" textAnchor="middle">$</text>
              
              {/* Sparkle effects around ticket */}
              <circle cx="160" cy="30" r="3" fill="#8447e9" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="20" cy="35" r="2" fill="#8447e9" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="170" cy="100" r="2.5" fill="#8447e9" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.8s" repeatCount="indefinite"/>
              </circle>
              <circle cx="15" cy="90" r="2" fill="#8447e9" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="3s" repeatCount="indefinite"/>
              </circle>
              
              {/* Plus icon indicating creation */}
              <circle cx="90" cy="20" r="12" fill="#8447e9" opacity="0.9"/>
              <line x1="85" y1="20" x2="95" y2="20" stroke="white" strokeWidth="2"/>
              <line x1="90" y1="15" x2="90" y2="25" stroke="white" strokeWidth="2"/>
            </svg>
          </div>

          {/* Form Section */}
          <div style={{ flex: '1' }}>
            
            {/* First Row - Event Name & Ticket Type */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px', 
              marginBottom: '24px' 
            }}>
              <div>
                <label style={{ 
                  color: '#111827', 
                  fontSize: '1rem', 
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Event Name <span style={{color: '#dc2626'}}>*</span>
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter event name..."
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    backgroundColor: isLoading ? '#f9fafb' : 'white',
                    outline: 'none',
                    boxSizing: 'border-box',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8447e9'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              <div>
                <label style={{ 
                  color: '#111827', 
                  fontSize: '1rem', 
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Ticket Type <span style={{color: '#dc2626'}}>*</span>
                </label>
                <input
                  type="text"
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                  disabled={isLoading}
                  placeholder="VIP, Regular, Student..."
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    backgroundColor: isLoading ? '#f9fafb' : 'white',
                    outline: 'none',
                    boxSizing: 'border-box',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8447e9'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            {/* Second Row - Ticket Title & Price */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px', 
              marginBottom: '32px' 
            }}>
              <div>
                <label style={{ 
                  color: '#111827', 
                  fontSize: '1rem', 
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Ticket Title <span style={{color: '#dc2626'}}>*</span>
                </label>
                <input
                  type="text"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter ticket title..."
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    backgroundColor: isLoading ? '#f9fafb' : 'white',
                    outline: 'none',
                    boxSizing: 'border-box',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8447e9'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              <div>
                <label style={{ 
                  color: '#111827', 
                  fontSize: '1rem', 
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Price ($) <span style={{color: '#dc2626'}}>*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isLoading}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    backgroundColor: isLoading ? '#f9fafb' : 'white',
                    outline: 'none',
                    boxSizing: 'border-box',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8447e9'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              justifyContent: 'flex-start',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#9ca3af' : '#8447e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  minWidth: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = '#7c3aed';
                }}
                onMouseOut={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = '#8447e9';
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Creating...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
              
              {tickets.length > 0 && (
                <button
                  onClick={() => setShowTickets(!showTickets)}
                  disabled={isLoading}
                  style={{
                    border: '1px solid #8447e9',
                    color: '#8447e9',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    padding: '12px 20px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    minWidth: '160px',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = '#8447e9';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#8447e9';
                    }
                  }}
                >
                  {showTickets ? 'Hide tickets' : 'Show tickets'} ({tickets.length})
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Tickets List - Shows automatically when there are tickets */}
        {isLoadingTickets ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #8447e9',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#6b7280', margin: 0 }}>Loading tickets...</p>
          </div>
        ) : showTickets && tickets.length > 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              color: '#111827',
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '20px',
              margin: '0 0 20px 0'
            }}>
              All Tickets ({tickets.length})
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {tickets.map((ticket, index) => (
                <div key={ticket.ticket_id || index} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  position: 'relative'
                }}>
                  <h3 style={{
                    color: '#8447e9',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}>
                    {ticket.title}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    margin: '4px 0'
                  }}>
                    <strong>Event ID:</strong> {ticket.event_id}
                  </p>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    margin: '4px 0'
                  }}>
                    <strong>Type:</strong> {ticket.type}
                  </p>
                  <p style={{
                    color: '#059669',
                    fontSize: '1rem',
                    fontWeight: '600',
                    margin: '8px 0 0 0'
                  }}>
                    ${ticket.price}
                  </p>
                  <button
                    onClick={() => handleDeleteTicket(ticket.ticket_id)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : !isLoadingTickets && tickets.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: 0 }}>
              No tickets found. Create your first ticket!
            </p>
          </div>
        ) : null}
      </div>

      {/* CSS Animation for Loading Spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CreateTicketPage;