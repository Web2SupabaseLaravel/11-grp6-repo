import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // استيراد useNavigate

const EventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const navigate = useNavigate(); // استخدام useNavigate

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/events', {
          headers: {
            Authorization: `Bearer YOUR_API_TOKEN_HERE`, // استبدله بالتوكن الخاص بك
          },
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const sortedEvents = [...events].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.start_datetime) - new Date(a.start_datetime);
    } else if (sortOrder === 'oldest') {
      return new Date(a.start_datetime) - new Date(b.start_datetime);
    } else if (sortOrder === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const filteredEvents = sortedEvents.filter((event) =>
    (event.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="container-fluid"
      style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="mb-4">
            <h2 className="text-dark fw-bold mb-4">
              Which event do you want to modify?
            </h2>

            <div className="row align-items-center mb-4">
              <div className="col-md-3">
                <select
                  className="form-select border-2"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Sort by: newest first</option>
                  <option value="oldest">Sort by: oldest first</option>
                  <option value="alphabetical">Sort alphabetically</option>
                </select>
              </div>

              <div className="col-md-6 offset-md-3">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control border-2"
                    placeholder="Search for events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn position-absolute top-0 end-0 h-100 border-0 bg-transparent">
                    🔍
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div key={event.event_id} className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <h5 className="mb-0 fs-5 fw-medium text-dark">{event.title}</h5>
                          <p className="text-muted mb-0">{event.speaker_name}</p>
                          <small className="text-secondary">{event.start_datetime}</small>
                        </div>
                        <div className="col-md-4 text-end">
                          <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => navigate(`/edit-event/${event.event_id}`)}


                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No events found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagementPage;
