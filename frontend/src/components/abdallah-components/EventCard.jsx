import React from 'react';

const EventCard = ({ event }) => {
  // Handle different date field names from API
  const eventDate = event.start_datetime || event.date;
  
  // Handle different location field structures
  const location = event.country && event.city 
    ? `${event.country}, ${event.city}` 
    : event.location || 'Location TBD';

  // Handle different organizer/speaker field names
  const organizerName = event.speaker_name || event.organizer || 'Unknown Organizer';
  const organizerImage = event.speaker_image || event.organizer_image;

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      return new Date(dateString).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/api/placeholder/300/200';
  };

  const handleOrganizerImageError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <div className="card h-100 border-0 shadow-sm position-relative" 
         style={{ borderRadius: '16px', overflow: 'hidden' }}>
      
      {/* Event Image */}
      <div className="position-relative">
        <img 
          src={event.image || '/api/placeholder/300/200'} 
          className="card-img-top" 
          alt={event.title || 'Event image'}
          style={{ height: '200px', objectFit: 'cover' }}
          onError={handleImageError}
        />
        {event.isActive && (
          <span className="badge bg-dark position-absolute top-0 end-0 m-2">
            Active
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body p-4 d-flex flex-column">
        {/* Date */}
        <small className="text-muted mb-2">
          {formatDate(eventDate)}
        </small>

        {/* Event Title */}
        <h6 className="card-title fw-bold mb-2" style={{ fontSize: '18px', lineHeight: '1.3' }}>
          {event.title || 'Untitled Event'}
        </h6>

        {/* Category */}
        {event.category && (
          <small className="text-muted mb-2">{event.category}</small>
        )}

        {/* Location */}
        <div className="d-flex align-items-center mb-3">
          <svg width="14" height="14" fill="#6c757d" className="me-2 flex-shrink-0" viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
          </svg>
          <small className="text-muted">{location}</small>
        </div>

        {/* Organizer Section */}
        <div className="mt-auto d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            {organizerImage ? (
              <img 
                src={organizerImage} 
                alt={organizerName}
                className="rounded-circle me-2 flex-shrink-0"
                style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                onError={handleOrganizerImageError}
              />
            ) : (
              <div className="bg-secondary rounded-circle me-2 flex-shrink-0" 
                   style={{ width: '24px', height: '24px' }}>
              </div>
            )}
            <small className="text-dark fw-medium">{organizerName}</small>
          </div>

          <button className="btn btn-link p-0 border-0 text-muted" 
                  aria-label="More options"
                  style={{ fontSize: '14px' }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;