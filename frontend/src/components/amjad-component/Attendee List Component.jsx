import React, { useState } from 'react';

const AttendeeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Attendees');
  const [ticketTypeFilter, setTicketTypeFilter] = useState('Ticket Type');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [attendees, setAttendees] = useState([
    {
      id: 1,
      name: 'John Sagmoen',
      email: 'john@aannet.com',
      status: 'Checked in',
      registered: '1 day ago',
      ticketType: 'Regular'
    },
    {
      id: 2,
      name: 'John Anthaon',
      email: 'john@damnis.com',
      status: 'Pending',
      registered: '2 days ago',
      ticketType: 'Regular'
    },
    {
      id: 3,
      name: 'Rob Morrett',
      email: 'doe@damnis.com',
      status: 'Pending',
      registered: '5 hours ago',
      ticketType: 'Regular'
    },
    {
      id: 4,
      name: 'Mark Storman',
      email: 'mark@aannet.com',
      status: 'Pending',
      registered: '1 day ago',
      ticketType: 'Regular'
    },
    {
      id: 5,
      name: 'Billy Mithera',
      email: 'milly@ammail.com',
      status: 'VIP',
      registered: '2 days ago',
      ticketType: 'VIP'
    },
    {
      id: 6,
      name: 'Joe Watrins',
      email: 'tcm@aannet.com',
      status: 'Pending',
      registered: '1 day ago',
      ticketType: 'Regular'
    },
    {
      id: 7,
      name: 'John Roberts',
      email: 'roberts@email.com',
      status: 'Pending',
      registered: '1 day ago',
      ticketType: 'Regular'
    }
  ]);

  const handleCheckIn = (attendeeId) => {
    setAttendees(prevAttendees => 
      prevAttendees.map(attendee => 
        attendee.id === attendeeId 
          ? { ...attendee, status: 'Checked in' }
          : attendee
      )
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('List refreshed');
    }, 1000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked in':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'VIP':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Attendees' || attendee.status === statusFilter;
    const matchesTicketType = ticketTypeFilter === 'Ticket Type' || attendee.ticketType === ticketTypeFilter;
    return matchesSearch && matchesStatus && matchesTicketType;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All Attendees');
    setTicketTypeFilter('Ticket Type');
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-vh-100 bg-light">
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
          <div className="container-fluid px-3 px-lg-4">
            <a className="navbar-brand fw-bold fs-4" href="#" style={{ color: '#6c5ce7' }}>
              evently
            </a>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <div className="navbar-nav ms-auto d-flex align-items-center gap-2">
                <a className="nav-link text-muted d-none d-lg-block" href="#">Home</a>
                <a className="nav-link text-muted d-none d-lg-block" href="#">About</a>
                <a className="nav-link text-muted" href="#">Events</a>
                <button className="btn btn-outline-primary btn-sm mx-1">Log In</button>
                <button 
                  className="btn btn-primary btn-sm mx-1" 
                  style={{ backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-11">
              <div className="bg-white rounded-3 shadow-sm p-3 p-md-4">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
                  <h2 className="mb-2 mb-sm-0 fw-bold">Attendee List</h2>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary">{filteredAttendees.length} attendees</span>
                    {(searchTerm || statusFilter !== 'All Attendees' || ticketTypeFilter !== 'Ticket Type') && (
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Filters */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        🔍
                      </span>
                      <input 
                        type="text" 
                        className="form-control border-start-0" 
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <select 
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option>All Attendees</option>
                      <option>Checked in</option>
                      <option>Pending</option>
                      <option>VIP</option>
                    </select>
                  </div>
                  <div className="col-6 col-md-4">
                    <select 
                      className="form-select"
                      value={ticketTypeFilter}
                      onChange={(e) => setTicketTypeFilter(e.target.value)}
                    >
                      <option>Ticket Type</option>
                      <option>Regular</option>
                      <option>VIP</option>
                    </select>
                  </div>
                </div>

                {/* Results count */}
                {filteredAttendees.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="text-muted">
                      <h5>No attendees found</h5>
                      <p>Try adjusting your search criteria</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="table-responsive d-none d-md-block">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th className="fw-semibold">Name</th>
                            <th className="fw-semibold">Email</th>
                            <th className="fw-semibold">Status</th>
                            <th className="fw-semibold">Registered</th>
                            <th className="fw-semibold">Ticket Type</th>
                            <th className="fw-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAttendees.map((attendee) => (
                            <tr key={attendee.id}>
                              <td className="fw-medium">{attendee.name}</td>
                              <td className="text-muted">{attendee.email}</td>
                              <td>
                                <span className={`badge text-bg-${getStatusBadge(attendee.status)} px-2 py-1`}>
                                  {attendee.status}
                                </span>
                              </td>
                              <td className="text-muted">{attendee.registered}</td>
                              <td>
                                <span className="badge bg-light text-dark border px-2 py-1">
                                  {attendee.ticketType}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="btn btn-sm text-white fw-medium px-3"
                                  style={{ backgroundColor: attendee.status === 'Checked in' ? '#6c757d' : '#6c5ce7', border: 'none' }}
                                  onClick={() => handleCheckIn(attendee.id)}
                                  disabled={attendee.status === 'Checked in'}
                                >
                                  {attendee.status === 'Checked in' ? 'Checked ✓' : 'Check in'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="d-md-none">
                      {filteredAttendees.map((attendee) => (
                        <div key={attendee.id} className="card mb-3">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h6 className="card-title fw-bold mb-1">{attendee.name}</h6>
                                <p className="card-text text-muted small mb-2">{attendee.email}</p>
                              </div>
                              <span className={`badge text-bg-${getStatusBadge(attendee.status)} px-2 py-1`}>
                                {attendee.status}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="small text-muted">
                                <div>📅 {attendee.registered}</div>
                                <div>🎫 {attendee.ticketType}</div>
                              </div>
                              <button 
                                className="btn btn-sm text-white fw-medium px-3"
                                style={{ backgroundColor: attendee.status === 'Checked in' ? '#6c757d' : '#6c5ce7', border: 'none' }}
                                onClick={() => handleCheckIn(attendee.id)}
                                disabled={attendee.status === 'Checked in'}
                              >
                                {attendee.status === 'Checked in' ? 'Checked ✓' : 'Check in'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Refreshing...
                      </>
                    ) : (
                      <>🔄 Refresh List</>
                    )}
                  </button>
                  <button className="btn btn-outline-primary">
                    📥 Export List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-muted mt-5 pb-4">
          <div className="container">
            <small>© 2025 Evently, All rights reserved.</small>
          </div>
        </footer>
      </div>

      {/* Bootstrap JS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </>
  );
};

export default AttendeeList;