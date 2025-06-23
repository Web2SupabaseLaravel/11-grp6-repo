import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState('');

  const handleRegister = async () => {
    if (!userId || !selectedTicketId) {
      alert('Please select a ticket before registering.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://127.0.0.1:8000/api/buys', {
        user_id: parseInt(userId),
        ticket_id: parseInt(selectedTicketId),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      alert('Registration successful!');
      console.log(response.data);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('You already registered this ticket.');
      } else {
        alert('Registration failed. Please try again.');
      }
      console.error(error);
    }
  };


 useEffect(() => {
  const token = localStorage.getItem('token');

  if (token) {
    axios.get('http://127.0.0.1:8000/api/user', { 
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    .then(res => {
      console.log('User ID:', res.data.id);
      setUserId(res.data.id);
    })
    .catch(err => {
      console.error('Failed to fetch user info:', err);
    });
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch event data
      const eventResponse = await axios.get('http://127.0.0.1:8000/api/events');
      const matchedEvent = eventResponse.data.find(e => e.event_id.toString() === id);
      if (!matchedEvent) {
        throw new Error('Event not found');
      }
      setEvent(matchedEvent);
      
      // Fetch tickets data
      const ticketsResponse = await axios.get('http://127.0.0.1:8000/api/tickets');
      const eventTickets = ticketsResponse.data.filter(ticket => 
        ticket.event_id.toString() === id
      );
      setTickets(eventTickets);
      
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" 
               style={{ width: '3rem', height: '3rem', color: '#7c3aed' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading event details...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Error:">
                <use xlinkHref="#exclamation-triangle-fill"/>
              </svg>
              <div>
                <strong>Oops!</strong> {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #e9ecff 100%)', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container">

        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="position-relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="card-img-top"
                  style={{ height: '400px', objectFit: 'cover' }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(124, 58, 237, 0.3), rgba(124, 58, 237, 0.1))' }}></div>
                <div className="position-absolute bottom-0 start-0 p-4 text-white">
                  <span className="badge bg-warning text-dark px-3 py-2 mb-2" style={{ fontSize: '0.9rem' }}>Featured Event</span>
                  <h1 className="display-4 fw-bold mb-0 text-shadow">{event.title}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="row">

          <div className="col-lg-8 mb-4">
            <div className="card shadow border-0 h-100" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4">
                <h3 className="text-primary mb-4" style={{ color: '#7c3aed !important' }}>
                  <i className="bi bi-info-circle me-2"></i>Event Details
                </h3>
                
                <div className="mb-4">
                  <h5 className="text-muted mb-2">Description</h5>
                  <p className="lead text-dark">{event.description}</p>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 rounded" style={{ backgroundColor: '#f8f9ff', border: '1px solid #e9ecff' }}>
                      <div className="me-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', backgroundColor: '#7c3aed' }}>
                          <i className="bi bi-calendar-event text-white"></i>
                        </div>
                      </div>
                      <div>
                        <h6 className="mb-0 text-muted">Date & Time</h6>
                        <p className="mb-0 fw-semibold">{new Date(event.start_datetime).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 rounded" style={{ backgroundColor: '#f8f9ff', border: '1px solid #e9ecff' }}>
                      <div className="me-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', backgroundColor: '#7c3aed' }}>
                          <i className="bi bi-geo-alt text-white"></i>
                        </div>
                      </div>
                      <div>
                        <h6 className="mb-0 text-muted">Location</h6>
                        <p className="mb-0 fw-semibold">{event.city}, {event.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow border-0 mb-4" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4 text-center">
                <h4 className="text-primary mb-4" style={{ color: '#7c3aed !important' }}>
                  <i className="bi bi-person-badge me-2"></i>Featured Speaker
                </h4>
                
                <div className="position-relative d-inline-block mb-3">
                  <img
                    src={event.speaker_image}
                    alt={event.speaker_name}
                    className="rounded-circle shadow"
                    style={{ width: '120px', height: '120px', objectFit: 'cover', border: '4px solid #7c3aed' }}
                  />
                  <div className="position-absolute bottom-0 end-0">
                    <span className="badge rounded-pill" style={{ backgroundColor: '#7c3aed', padding: '8px' }}>
                      <i className="bi bi-star-fill text-white"></i>
                    </span>
                  </div>
                </div>
                
                <h5 className="fw-bold mb-2">{event.speaker_name}</h5>
                <p className="text-muted mb-4">Event Speaker</p>
                
                <div className="d-grid gap-2">
                  <select 
                    className="form-select"
                    value={selectedTicketId}
                    onChange={(e) => setSelectedTicketId(e.target.value)}
                  >
                    <option value="">Select a Ticket</option>
                    {tickets.map(ticket => (
                      <option key={ticket.ticket_id} value={ticket.ticket_id}>
                        {ticket.title} - {ticket.type} (${ticket.price})
                      </option>
                    ))}
                  </select>
                  <button 
                    className="btn btn-lg fw-semibold shadow" 
                    style={{ 
                      backgroundColor: '#7c3aed', 
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      padding: '12px 24px',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={handleRegister}
                  >
                    <i className="bi bi-calendar-plus me-2"></i>Register Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4) !important;
        }
        
        
        .bi {
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default EventDetails;