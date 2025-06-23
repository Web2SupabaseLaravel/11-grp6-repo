import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventApproval = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalErrors, setModalErrors] = useState({});

  const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events');
      setEvents(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Showing sample data for demonstration.');
      // Display sample data if API call fails
      setEvents([
        {
          id: 1,
          title: 'Art & Design Expo',
          organizer: 'Natali Craig',
          start_datetime: '2025-04-18T10:00:00',
          country: 'Palestine',
          city: 'Nablus',
          capacity: 250,
          ticket_type: 'free',
          description: 'A comprehensive exhibition showcasing contemporary art and innovative design solutions.',
          status: 'pending',
          speaker_name: 'John Doe',
          job_title: 'Art Director'
        },
        {
          id: 2,
          title: 'Tech Meetup 2025',
          organizer: 'Drew Cano',
          start_datetime: '2025-04-17T18:00:00',
          country: 'Palestine',
          city: 'Ramallah',
          capacity: 150,
          ticket_type: 'paid',
          description: 'Monthly gathering for tech enthusiasts to network and share insights.',
          status: 'pending',
          speaker_name: 'Jane Smith',
          job_title: 'Software Engineer'
        },
        {
          id: 3,
          title: 'Coffee Lovers Fair',
          organizer: 'Andi Lane',
          start_datetime: '2025-04-10T09:00:00',
          country: 'Palestine',
          city: 'Gaza',
          capacity: 300,
          ticket_type: 'free',
          description: 'Discover local coffee roasters and artisanal brewing techniques.',
          status: 'approved',
          speaker_name: 'Ahmad Ali',
          job_title: 'Coffee Expert'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle event approval
  const handleApprove = async (id) => {
    try {
      await api.put(`/events/${id}/approve`);
      setEvents(events.map(event =>
        event.id === id ? { ...event, status: 'approved' } : event
      ));
      alert('Event approved successfully!');
    } catch (err) {
      console.error('Error approving event:', err);
      alert('Failed to approve event. Please try again.');
    }
  };

  // Handle event rejection
  const handleReject = async (id) => {
    try {
      await api.put(`/events/${id}/reject`);
      setEvents(events.map(event =>
        event.id === id ? { ...event, status: 'rejected' } : event
      ));
      alert('Event rejected successfully!');
    } catch (err) {
      console.error('Error rejecting event:', err);
      alert('Failed to reject event. Please try again.');
    }
  };

  // Handle editing an event (opens modal)
  const handleEdit = (event) => {
    setEditingEvent({ ...event });
    setModalErrors({}); // Clear previous errors
    setShowEditModal(true);
  };

  // Validate edit form fields
  const validateForm = () => {
    const errors = {};
    if (!editingEvent.title.trim()) errors.title = 'Title is required.';
    if (!editingEvent.organizer.trim()) errors.organizer = 'Organizer is required.';
    if (!editingEvent.start_datetime) errors.start_datetime = 'Date and time are required.';
    if (!editingEvent.country.trim()) errors.country = 'Country is required.';
    if (!editingEvent.city.trim()) errors.city = 'City is required.';
    if (!editingEvent.capacity || editingEvent.capacity <= 0) errors.capacity = 'Capacity must be a positive number.';
    if (!editingEvent.ticket_type) errors.ticket_type = 'Ticket type is required.';
    if (!editingEvent.description.trim()) errors.description = 'Description is required.';
    
    setModalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle saving edited event
  const handleSaveEdit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await api.put(`/events/${editingEvent.id}`, editingEvent);
      setEvents(events.map(event =>
        event.id === editingEvent.id ? editingEvent : event
      ));
      setShowEditModal(false);
      setEditingEvent(null);
      alert('Event updated successfully!');
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Failed to update event. Please try again.');
    }
  };

  // Handle canceling edit (closes modal)
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingEvent(null);
    setModalErrors({}); // Clear errors on cancel
  };

  // Handle input changes in the edit modal
  const handleInputChange = (field, value) => {
    setEditingEvent(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for the field being edited
    setModalErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // Format date and time for display
  const formatDateTime = (datetime) => {
    if (!datetime) return { date: 'N/A', time: 'N/A' };
    const date = new Date(datetime);
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { date: dateStr, time: timeStr };
  };

  // Format date and time for datetime-local input
  const formatDateTimeForInput = (datetime) => {
    if (!datetime) return '';
    const date = new Date(datetime);
    return date.toISOString().slice(0, 16);
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event =>
    (event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Loading state UI
  if (loading) {
    return (
      <>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading events...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="min-vh-100 bg-light" style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div className="container-fluid py-3 py-md-5 px-3 px-md-4">
          <div className="row justify-content-center">
            <div className="col-12">
              {/* Header */}
              <div className="mb-4">
                <h1 className="fw-bold mb-2" style={{
                  color: '#8447E9',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'
                }}>
                  Event Approval
                </h1>
                <p className="text-muted mb-4" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.25rem)' }}>
                  Manage and review submitted event requests. Approve, reject, or edit events as needed.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-warning mb-4" role="alert">
                  <strong>Note:</strong> {error}
                </div>
              )}

              {/* Search Bar and Refresh Button */}
              <div className="row mb-4 g-3">
                <div className="col-12 col-md-8 col-lg-9">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control form-control-lg ps-5"
                      placeholder="Search by event title or organizer name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        border: '2px solid #E5E7EB',
                        borderRadius: '12px',
                        backgroundColor: 'white'
                      }}
                    />
                    <div
                      className="position-absolute top-50 translate-middle-y text-muted"
                      style={{ left: '1rem' }}
                    >
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4 col-lg-3">
                  <button
                    className="btn btn-outline-primary w-100 h-100 d-flex align-items-center justify-content-center"
                    onClick={fetchEvents}
                    style={{
                      borderRadius: '8px',
                      fontWeight: '500',
                      minHeight: '50px',
                      borderColor: '#C4B5FD',
                      color: '#8447E9'
                    }}
                  >
                    <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                    </svg>
                    <span className="d-none d-sm-inline">Refresh Events</span>
                    <span className="d-sm-none">Refresh</span>
                  </button>
                </div>
              </div>

              {/* No events found message */}
              {filteredEvents.length === 0 && (
                <div className="text-center py-5 bg-white rounded-3 shadow-sm border mb-4">
                  <p className="text-muted fs-5 mb-3">
                    {searchTerm ? 'No events found matching your search criteria.' : 'No events available for review.'}
                  </p>
                  {searchTerm && (
                    <button
                      className="btn btn-link text-decoration-none"
                      onClick={() => setSearchTerm('')}
                      style={{ color: '#8447E9' }}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}

              {/* Desktop Table View */}
              <div className="d-none d-lg-block">
                <div className="bg-white rounded-3 shadow-sm overflow-hidden border">
                  {/* Table Header */}
                  <div className="row py-3 mx-0 bg-light border-bottom fw-semibold text-dark">
                    <div className="col-3">Event Details</div>
                    <div className="col-2">Organizer</div>
                    <div className="col-2">Date & Time</div>
                    <div className="col-2">Info</div>
                    <div className="col-3 text-center">Actions</div>
                  </div>

                  {/* Table Body */}
                  {filteredEvents.map((event) => {
                    const { date, time } = formatDateTime(event.start_datetime);
                    return (
                      <div
                        key={event.id}
                        className="row py-3 mx-0 align-items-center border-bottom border-light hover-row"
                        style={{
                          transition: 'background-color 0.2s',
                          cursor: 'default'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                      >
                        <div className="col-3">
                          <div>
                            <span className="fw-medium text-dark d-block">
                              {event.title}
                            </span>
                            <small className="text-muted">
                              {event.city}, {event.country}
                            </small>
                          </div>
                        </div>
                        <div className="col-2">
                          <span className="text-muted">
                            {event.organizer}
                          </span>
                        </div>
                        <div className="col-2">
                          <div>
                            <span className="text-dark d-block small">
                              {date}
                            </span>
                            <span className="text-muted small">
                              {time}
                            </span>
                          </div>
                        </div>
                        <div className="col-2">
                          <div>
                            <span
                              className={`badge small ${event.ticket_type === 'free' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}
                              style={{
                                borderRadius: '12px',
                                padding: '0.25rem 0.5rem'
                              }}
                            >
                              {event.ticket_type}
                            </span>
                            <small className="text-muted d-block">
                              Cap: {event.capacity}
                            </small>
                          </div>
                        </div>
                        <div className="col-3 text-center">
                          {event.status === 'pending' && (
                            <div className="d-flex gap-2 justify-content-center flex-wrap">
                              <button
                                className="btn btn-sm btn-primary fw-medium"
                                onClick={() => handleApprove(event.id)}
                                style={{
                                  backgroundColor: '#8447E9',
                                  borderColor: '#8447E9',
                                  borderRadius: '8px',
                                  padding: '0.4rem 0.8rem',
                                  fontSize: '0.8rem',
                                  minWidth: '70px',
                                  transition: 'background-color 0.2s, border-color 0.2s, transform 0.2s'
                                }}
                                onMouseEnter={(e) => { e.target.style.backgroundColor = '#6A3BB6'; e.target.style.borderColor = '#6A3BB6'; e.target.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={(e) => { e.target.style.backgroundColor = '#8447E9'; e.target.style.borderColor = '#8447E9'; e.target.style.transform = 'translateY(0)'; }}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-dark fw-medium"
                                onClick={() => handleReject(event.id)}
                                style={{
                                  backgroundColor: '#4B5563',
                                  borderColor: '#4B5563',
                                  borderRadius: '8px',
                                  padding: '0.4rem 0.8rem',
                                  fontSize: '0.8rem',
                                  minWidth: '70px',
                                  transition: 'background-color 0.2s, border-color 0.2s, transform 0.2s'
                                }}
                                onMouseEnter={(e) => { e.target.style.backgroundColor = '#1F2937'; e.target.style.borderColor = '#1F2937'; e.target.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={(e) => { e.target.style.backgroundColor = '#4B5563'; e.target.style.borderColor = '#4B5563'; e.target.style.transform = 'translateY(0)'; }}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {event.status === 'approved' && (
                            <div className="d-flex flex-column align-items-center">
                              <span
                                className="badge bg-success-subtle text-success fw-medium mb-2"
                                style={{
                                  padding: '0.5rem 1rem',
                                  borderRadius: '20px',
                                  fontSize: '0.875rem'
                                }}
                              >
                                ✓ Approved
                              </span>
                              <button
                                className="btn btn-sm btn-info fw-medium w-75"
                                onClick={() => handleEdit(event)}
                                style={{
                                  backgroundColor: '#3B82F6',
                                  borderColor: '#3B82F6',
                                  color: 'white',
                                  borderRadius: '8px',
                                  padding: '0.4rem 0.8rem',
                                  fontSize: '0.8rem',
                                  transition: 'background-color 0.2s, border-color 0.2s, transform 0.2s'
                                }}
                                onMouseEnter={(e) => { e.target.style.backgroundColor = '#2563EB'; e.target.style.borderColor = '#2563EB'; e.target.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={(e) => { e.target.style.backgroundColor = '#3B82F6'; e.target.style.borderColor = '#3B82F6'; e.target.style.transform = 'translateY(0)'; }}
                              >
                                Edit
                              </button>
                            </div>
                          )}
                          {event.status === 'rejected' && (
                            <span
                              className="badge bg-danger-subtle text-danger fw-medium"
                              style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.875rem'
                              }}
                            >
                              ✗ Rejected
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="d-lg-none">
                <div className="row g-3">
                  {filteredEvents.map((event) => {
                    const { date, time } = formatDateTime(event.start_datetime);
                    return (
                      <div key={event.id} className="col-12">
                        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '12px' }}>
                          <div className="card-body p-4">
                            {/* Event Title and Location */}
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div className="flex-grow-1">
                                <h5 className="fw-bold text-dark mb-1" style={{ fontSize: '1.1rem' }}>
                                  {event.title}
                                </h5>
                                <p className="text-muted small mb-0">
                                  {event.city}, {event.country}
                                </p>
                              </div>
                              <span
                                className={`badge ms-2 ${event.ticket_type === 'free' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}
                                style={{
                                  borderRadius: '12px',
                                  padding: '0.4rem 0.8rem'
                                }}
                              >
                                {event.ticket_type}
                              </span>
                            </div>

                            {/* Event Details */}
                            <div className="row g-3 mb-4">
                              <div className="col-6">
                                <small className="text-muted d-block">Organizer</small>
                                <span className="fw-medium text-truncate d-block">{event.organizer}</span>
                              </div>
                              <div className="col-6">
                                <small className="text-muted d-block">Capacity</small>
                                <span className="fw-medium">{event.capacity}</span>
                              </div>
                              <div className="col-12">
                                <small className="text-muted d-block">Date & Time</small>
                                <span className="fw-medium">{date} at {time}</span>
                              </div>
                              <div className="col-12">
                                <small className="text-muted d-block">Description</small>
                                <p className="text-dark small mb-0 truncate-text" style={{ maxHeight: '3.8em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                  {event.description}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-auto">
                              {event.status === 'pending' && (
                                <div className="row g-2">
                                  <div className="col-6">
                                    <button
                                      className="btn btn-primary fw-medium w-100"
                                      onClick={() => handleApprove(event.id)}
                                      style={{
                                        backgroundColor: '#8447E9',
                                        borderColor: '#8447E9',
                                        borderRadius: '8px',
                                        padding: '0.75rem',
                                        fontSize: '0.9rem',
                                        transition: 'background-color 0.2s, border-color 0.2s'
                                      }}
                                      onMouseEnter={(e) => { e.target.style.backgroundColor = '#6A3BB6'; e.target.style.borderColor = '#6A3BB6'; }}
                                      onMouseLeave={(e) => { e.target.style.backgroundColor = '#8447E9'; e.target.style.borderColor = '#8447E9'; }}
                                    >
                                      Approve
                                    </button>
                                  </div>
                                  <div className="col-6">
                                    <button
                                      className="btn btn-dark fw-medium w-100"
                                      onClick={() => handleReject(event.id)}
                                      style={{
                                        backgroundColor: '#4B5563',
                                        borderColor: '#4B5563',
                                        borderRadius: '8px',
                                        padding: '0.75rem',
                                        fontSize: '0.9rem',
                                        transition: 'background-color 0.2s, border-color 0.2s'
                                      }}
                                      onMouseEnter={(e) => { e.target.style.backgroundColor = '#1F2937'; e.target.style.borderColor = '#1F2937'; }}
                                      onMouseLeave={(e) => { e.target.style.backgroundColor = '#4B5563'; e.target.style.borderColor = '#4B5563'; }}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              )}
                              {event.status === 'approved' && (
                                <div>
                                  <div className="d-flex justify-content-center align-items-center mb-2">
                                    <span
                                      className="badge bg-success-subtle text-success fw-medium"
                                      style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        fontSize: '0.875rem'
                                      }}
                                    >
                                      ✓ Approved
                                    </span>
                                  </div>
                                  <button
                                    className="btn btn-info fw-medium w-100"
                                    onClick={() => handleEdit(event)}
                                    style={{
                                      backgroundColor: '#3B82F6',
                                      borderColor: '#3B82F6',
                                      color: 'white',
                                      borderRadius: '8px',
                                      padding: '0.75rem',
                                      fontSize: '0.9rem',
                                      transition: 'background-color 0.2s, border-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#2563EB'; e.target.style.borderColor = '#2563EB'; }}
                                    onMouseLeave={(e) => { e.target.style.backgroundColor = '#3B82F6'; e.target.style.borderColor = '#3B82F6'; }}
                                  >
                                    Edit Event
                                  </button>
                                </div>
                              )}
                              {event.status === 'rejected' && (
                                <span
                                  className="badge bg-danger-subtle text-danger fw-medium d-block text-center"
                                  style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem'
                                  }}
                                >
                                  ✗ Rejected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              {events.length > 0 && (
                <div className="mt-4 text-center">
                  <small className="text-muted">
                    Showing {filteredEvents.length} of {events.length} events
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && editingEvent && (
          <div
            className="modal d-block" // Use d-block to show modal
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
            onClick={handleCancelEdit}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg" // Added modal-lg for larger modal on desktop
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content rounded-3 shadow-lg p-4">
                <div className="modal-header border-0 pb-0">
                  <h3 className="modal-title fw-bold" style={{ color: '#8447E9' }}>
                    Edit Event
                  </h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleCancelEdit}
                  ></button>
                </div>
                <div className="modal-body pt-3">
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label htmlFor="title" className="form-label fw-medium">Event Title</label>
                        <input
                          type="text"
                          className={`form-control ${modalErrors.title ? 'is-invalid' : ''}`}
                          id="title"
                          value={editingEvent.title || ''}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          style={{ borderRadius: '8px' }}
                        />
                        {modalErrors.title && <div className="invalid-feedback">{modalErrors.title}</div>}
                      </div>

                      <div className="col-12">
                        <label htmlFor="description" className="form-label fw-medium">Description</label>
                        <textarea
                          className={`form-control ${modalErrors.description ? 'is-invalid' : ''}`}
                          id="description"
                          rows="3"
                          value={editingEvent.description || ''}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          style={{ borderRadius: '8px' }}
                        ></textarea>
                        {modalErrors.description && <div className="invalid-feedback">{modalErrors.description}</div>}
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="organizer" className="form-label fw-medium">Organizer</label>
                        <input
                          type="text"
                          className={`form-control ${modalErrors.organizer ? 'is-invalid' : ''}`}
                          id="organizer"
                          value={editingEvent.organizer || ''}
                          onChange={(e) => handleInputChange('organizer', e.target.value)}
                          style={{ borderRadius: '8px' }}
                        />
                        {modalErrors.organizer && <div className="invalid-feedback">{modalErrors.organizer}</div>}
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="start_datetime" className="form-label fw-medium">Date & Time</label>
                        <input
                          type="datetime-local"
                          className={`form-control ${modalErrors.start_datetime ? 'is-invalid' : ''}`}
                          id="start_datetime"
                          value={formatDateTimeForInput(editingEvent.start_datetime)}
                          onChange={(e) => handleInputChange('start_datetime', e.target.value)}
                          style={{ borderRadius: '8px' }}
                        />
                        {modalErrors.start_datetime && <div className="invalid-feedback">{modalErrors.start_datetime}</div>}
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="country" className="form-label fw-medium">Country</label>
                        <input
                          type="text"
                          className={`form-control ${modalErrors.country ? 'is-invalid' : ''}`}
                          id="country"
                          value={editingEvent.country || ''}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          style={{ borderRadius: '8px' }}
                        />
                        {modalErrors.country && <div className="invalid-feedback">{modalErrors.country}</div>}
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="city" className="form-label fw-medium">City</label>
                        <input
                          type="text"
                          className={`form-control ${modalErrors.city ? 'is-invalid' : ''}`}
                          id="city"
                          value={editingEvent.city || ''}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          style={{ borderRadius: '8px' }}
                        />
                        {modalErrors.city && <div className="invalid-feedback">{modalErrors.city}</div>}
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="capacity" className="form-label fw-medium">Capacity</label>
                        <input
                          type="number"
                          className={`form-control ${modalErrors.capacity ? 'is-invalid' : ''}`}
                          id="capacity"
                          value={editingEvent.capacity || ''}
                          onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                          style={{ borderRadius: '8px' }}
                        />
                        {modalErrors.capacity && <div className="invalid-feedback">{modalErrors.capacity}</div>}
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="ticket_type" className="form-label fw-medium">Ticket Type</label>
                        <select
                          className={`form-select ${modalErrors.ticket_type ? 'is-invalid' : ''}`}
                          id="ticket_type"
                          value={editingEvent.ticket_type || ''}
                          onChange={(e) => handleInputChange('ticket_type', e.target.value)}
                          style={{ borderRadius: '8px' }}
                        >
                          <option value="">Select Type</option>
                          <option value="free">Free</option>
                          <option value="paid">Paid</option>
                        </select>
                        {modalErrors.ticket_type && <div className="invalid-feedback">{modalErrors.ticket_type}</div>}
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="speaker_name" className="form-label fw-medium">Speaker Name (Optional)</label>
                        <input
                          type="text"
                          className="form-control"
                          id="speaker_name"
                          value={editingEvent.speaker_name || ''}
                          onChange={(e) => handleInputChange('speaker_name', e.target.value)}
                          style={{ borderRadius: '8px' }}
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="job_title" className="form-label fw-medium">Job Title (Optional)</label>
                        <input
                          type="text"
                          className="form-control"
                          id="job_title"
                          value={editingEvent.job_title || ''}
                          onChange={(e) => handleInputChange('job_title', e.target.value)}
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer border-0 pt-4 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-light fw-medium me-2"
                    onClick={handleCancelEdit}
                    style={{
                      borderRadius: '8px',
                      padding: '0.6rem 1.2rem',
                      borderColor: '#D1D5DB',
                      color: '#4B5563',
                      transition: 'background-color 0.2s, border-color 0.2s'
                    }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#E5E7EB'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = '#F9FAFB'; }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary fw-medium"
                    onClick={handleSaveEdit}
                    style={{
                      backgroundColor: '#8447E9',
                      borderColor: '#8447E9',
                      borderRadius: '8px',
                      padding: '0.6rem 1.2rem',
                      transition: 'background-color 0.2s, border-color 0.2s'
                    }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#6A3BB6'; e.target.style.borderColor = '#6A3BB6'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = '#8447E9'; e.target.style.borderColor = '#8447E9'; }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EventApproval;