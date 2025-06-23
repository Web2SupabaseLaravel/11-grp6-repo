import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendeeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Attendees');
  const [ticketTypeFilter, setTicketTypeFilter] = useState('Ticket Type');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [attendees, setAttendees] = useState([]);

  const API_BASE_URL = 'http://localhost:8000/api';

  const fetchAttendees = async () => {
    setIsRefreshing(true);
    try {
      const buysResponse = await axios.get(`${API_BASE_URL}/buys`);
      const buysData = buysResponse.data.data;

      const combinedAttendees = buysData.map(buy => {
        const user = buy.user;
        const ticket = buy.ticket;

        const registeredDate = buy.purchase_date ? new Date(buy.purchase_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'N/A';

        // we'll determine the display status fbased on available information or default.
        let displayStatus = 'Pending';
        if (ticket && ticket.type === 'VIP') {
            displayStatus = 'VIP';
        }
        // If there's an external check-in system or a way to infer "checked in",
        // you would implement that logic here. Otherwise, it's just 'Pending' or 'VIP'.

        return {
          id: `${buy.user_id}-${buy.ticket_id}`,
          name: user ? user.name : 'Unknown User',
          email: user ? user.email : 'Unknown Email',
          status: displayStatus, // This is for display and filtering on the frontend
          registered: registeredDate,
          ticketType: ticket ? ticket.type : 'Unknown Type',
          originalBuy: buy // Keep the original buy object for actions
        };
      });

      setAttendees(combinedAttendees);
    } catch (error) {
      console.error('Error fetching attendees:', error.response?.data || error.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, []);

  const handleCheckIn = async (attendeeId, originalBuy) => {
    // As per your request, the 'status' field is NOT in the database.
    // Therefore, this 'check-in' action will only update the UI state locally.
    // If you need to persist a check-in status, you MUST implement a separate mechanism
    // (e.g., a new 'check_ins' table, or modify your 'buys' table to include status).
    try {
      // You are NOT sending 'status' to the backend here.
      // If you had a dedicated API endpoint for marking a user as "checked in"
      // without modifying the 'buys' table, you would call it here.
      // Example (hypothetical):
      // await axios.post(`${API_BASE_URL}/checkins`, {
      //   user_id: originalBuy.user_id,
      //   ticket_id: originalBuy.ticket_id,
      //   checked_in_at: new Date().toISOString()
      // });

      setAttendees(prevAttendees =>
        prevAttendees.map(attendee =>
          attendee.id === attendeeId
            ? { ...attendee, status: 'Checked in' } // Update frontend state visually
            : attendee
        )
      );
      console.log(`Attendee ${attendeeId} checked in (frontend visual only).`);
    } catch (error) {
      console.error('Error in handleCheckIn (status persistence may be missing on backend):', error.response?.data || error.message);
    }
  };

  const handleRefresh = () => {
    fetchAttendees();
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
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="min-vh-100 bg-light">
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

                {filteredAttendees.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="text-muted">
                      <h5>No attendees found</h5>
                      <p>Try adjusting your search criteria</p>
                    </div>
                  </div>
                ) : (
                  <>
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
                                  onClick={() => handleCheckIn(attendee.id, attendee.originalBuy)}
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
                                onClick={() => handleCheckIn(attendee.id, attendee.originalBuy)}
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

export default AttendeeList;