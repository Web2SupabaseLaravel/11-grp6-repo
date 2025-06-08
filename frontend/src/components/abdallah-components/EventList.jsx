import React from 'react';
import EventCard from './EventCard';

const EventList = ({ 
  events, 
  sortBy, 
  searchTerm, 
  currentPage, 
  eventsPerPage = 8, 
  loading, 
  error,
  onFilteredCountChange 
}) => {
  
  // Show loading state
  if (loading) {
    return (
      <div className="row g-4">
        <div className="col-12 text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">Loading events...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="row g-4">
        <div className="col-12 text-center py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button 
            className="btn btn-outline-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Filter events based on search term
  const filteredEvents = events.filter(event => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (event.title?.toLowerCase().includes(searchLower)) ||
      (event.category?.toLowerCase().includes(searchLower)) ||
      (event.organizer?.toLowerCase().includes(searchLower)) ||
      (event.speaker_name?.toLowerCase().includes(searchLower)) ||
      (event.city?.toLowerCase().includes(searchLower)) ||
      (event.country?.toLowerCase().includes(searchLower))
    );
  });

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'oldest first':
        return new Date(a.start_datetime || a.date || 0) - new Date(b.start_datetime || b.date || 0);
      case 'newest first':
        return new Date(b.start_datetime || b.date || 0) - new Date(a.start_datetime || a.date || 0);
      case 'alphabetical':
        return (a.title || '').localeCompare(b.title || '');
      default:
        return 0;
    }
  });

  // Notify parent component of filtered count for pagination
  React.useEffect(() => {
    if (onFilteredCountChange) {
      onFilteredCountChange(sortedEvents.length);
    }
  }, [sortedEvents.length, onFilteredCountChange]);

  // Paginate events
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = sortedEvents.slice(startIndex, startIndex + eventsPerPage);

  return (
    <div className="row g-4">
      {paginatedEvents.length > 0 ? (
        paginatedEvents.map((event) => (
          <div key={event.id || event.event_id} className="col-lg-3 col-md-6 col-sm-12">
            <EventCard event={event} />
          </div>
        ))
      ) : (
        <div className="col-12 text-center py-5">
          <div className="text-muted">
            <svg width="48" height="48" fill="currentColor" className="mb-3" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
            <p>No events found matching your search criteria.</p>
            {searchTerm && (
              <small className="text-muted">Try adjusting your search terms or filters.</small>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;