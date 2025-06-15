import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import EventList from './EventList';

const EventsPage = () => {
  // State management
  const [sortBy, setSortBy] = useState('newest first');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredCount, setFilteredCount] = useState(0);
  
  const eventsPerPage = 8;

  // Fetch events on component mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try multiple possible endpoints
        const endpoints = [
          'http://127.0.0.1:8000/api/events',
          'http://localhost:8000/api/events'
        ];
        
        let response;
        for (const endpoint of endpoints) {
          try {
            response = await axios.get(endpoint);
            break;
          } catch (err) {
            if (endpoint === endpoints[endpoints.length - 1]) {
              throw err;
            }
          }
        }
        
        if (isMounted) {
          const eventsData = Array.isArray(response.data) ? response.data : response.data?.events || [];
          setEvents(eventsData);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        if (isMounted) {
          setError('Failed to fetch events. Please check your connection and try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCount / eventsPerPage) || 1;

  // Handle filtered count changes from EventList
  const handleFilteredCountChange = useCallback((count) => {
    setFilteredCount(count);
  }, []);

  // Event handlers
  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1 || loading) return null;

    const getVisiblePages = () => {
      const pages = [];
      const maxVisible = 7;
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
      }
      return pages;
    };
    
    return (
      <nav aria-label="Events pagination" className="d-flex justify-content-center mt-5">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link border-0 bg-transparent text-dark"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </button>
          </li>
          {getVisiblePages().map((page, index) => (
            <li key={index} className={`page-item ${currentPage === page ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
              {page === '...' ? (
                <span className="page-link border-0 bg-transparent text-muted">...</span>
              ) : (
                <button 
                  className={`page-link border-0 bg-transparent ${currentPage === page ? 'text-black fw-bold bg-dark' : 'text-dark'}`}
                  onClick={() => handlePageChange(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button 
              className="page-link border-0 bg-transparent text-dark"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  // Quick page navigation for top
  const TopPageNumbers = () => {
    if (totalPages <= 1 || loading) return null;

    const visiblePages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      visiblePages.push(1, 2, 3, '...', totalPages - 1, totalPages);
    }
    
    return (
      <div className="ms-4 d-none d-md-flex align-items-center">
        {visiblePages.map((page, index) => (
          <button 
            key={index}
            className={`btn btn-link p-1 me-2 text-decoration-none ${
              currentPage === page ? 'fw-bold text-dark' : 'text-muted'
            }`}
            onClick={() => page !== '...' && handlePageChange(page)}
            disabled={page === '...'}
            style={{ 
              cursor: page !== '...' ? 'pointer' : 'default',
              border: 'none',
              fontSize: '14px'
            }}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container py-5">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-dark mb-3">
            Ready to Make Connection?
          </h1>
          <h2 className="h4 text-dark mb-0">
            Find Your Event Now!
          </h2>
        </div>

        {/* Controls Section */}
        <div className="row align-items-center mb-4">
          <div className="col-md-6 d-flex align-items-center flex-wrap">
            {/* Sort Dropdown */}
            <div className="me-3 mb-2 mb-md-0">
              <select 
                className="form-select border-dark" 
                value={sortBy}
                onChange={handleSortChange}
                style={{ width: 'auto', minWidth: '150px' }}
                disabled={loading}
                aria-label="Sort events"
              >
                <option value="newest first">Sort by: newest first</option>
                <option value="oldest first">Sort by: oldest first</option>
                <option value="alphabetical">Sort by: alphabetical</option>
              </select>
            </div>

            {/* Filter Icon (placeholder for future functionality) */}
            <button 
              className="btn btn-outline-dark me-3 mb-2 mb-md-0" 
              disabled={loading}
              aria-label="Filter options"
              title="Filter options (coming soon)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Page Numbers */}
            <TopPageNumbers />
          </div>

          <div className="col-md-6 mt-3 mt-md-0">
            {/* Search Bar */}
            <div className="position-relative">
              <input
                type="text"
                className="form-control pe-5"
                placeholder="Search for events, categories, organizers..."
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={loading}
                style={{ borderRadius: '8px', border: '1px solid #dee2e6' }}
                aria-label="Search events"
              />
              {searchTerm ? (
                <button 
                  className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-1"
                  style={{ border: 'none', background: 'none' }}
                  onClick={clearSearch}
                  disabled={loading}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              ) : (
                <div className="position-absolute top-50 end-0 translate-middle-y me-2 p-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
        <hr/>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-3">
            <small className="text-muted">
              {searchTerm ? `Found ${filteredCount} events matching "${searchTerm}"` : `Showing ${filteredCount} events`}
            </small>
          </div>
        )}

        {/* Events List */}
        <EventList 
          events={events}
          sortBy={sortBy}
          searchTerm={searchTerm}
          currentPage={currentPage}
          eventsPerPage={eventsPerPage}
          loading={loading}
          error={error}
          onFilteredCountChange={handleFilteredCountChange}
        />

        {/* Bottom Pagination */}
        <Pagination />
      </div>
    </div>
  );
};

export default EventsPage;