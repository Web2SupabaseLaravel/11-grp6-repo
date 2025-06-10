import React, { useState } from 'react';

const EventifyForm = () => {
  const [formData, setFormData] = useState({
    eventTitle: '',
    description: '',
    eventImage: null,
    locationName: '',
    locationAddress: '',
    dateStart: '',
    timeStart: '',
    capacity: '',
    ticketType: '',
    speakerName: '',
    jobTitle: '',
    accessType: 'All Attendees'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      eventImage: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Event created successfully!');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-4">
              <h2 className="mb-2" style={{ color: '#8447E9', fontWeight: '600' }}>Create New Event</h2>
              <p className="text-muted">Fill the detailed below to publish your event</p>
            </div>

            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>

              <div className="card-body p-4">
                <div>
                  {/* Event Title */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Event Title</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="eventTitle"
                      value={formData.eventTitle}
                      onChange={handleInputChange}
                      style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      style={{ borderColor: '#e5e7eb', fontSize: '14px', resize: 'vertical' }}
                    ></textarea>
                  </div>

                  {/* Event Image */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Event Image</label>
                    <div className="row">
                      <div className="col-md-6">
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex gap-2">
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Location</label>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Location Name"
                          name="locationName"
                          value={formData.locationName}
                          onChange={handleInputChange}
                          style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Location Address"
                          name="locationAddress"
                          value={formData.locationAddress}
                          onChange={handleInputChange}
                          style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date/Time */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Date/Time</label>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <input
                          type="date"
                          className="form-control"
                          name="dateStart"
                          value={formData.dateStart}
                          onChange={handleInputChange}
                          style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <input
                          type="time"
                          className="form-control"
                          placeholder="Time Start"
                          name="timeStart"
                          value={formData.timeStart}
                          onChange={handleInputChange}
                          style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Capacity & Tickets */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Capacity & Tickets</label>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Capacity"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <select
                          className="form-select"
                          name="ticketType"
                          value={formData.ticketType}
                          onChange={handleInputChange}
                          style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                        >
                          <option value="">Type Tickets</option>
                          <option value="free">Free</option>
                          <option value="paid">Paid</option>
                          <option value="donation">Donation</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Speakers */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Speakers</label>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          name="speakerName"
                          value={formData.speakerName}
                          onChange={handleInputChange}
                          style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Job Title"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Speaker Image */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Speaker Image</label>
                    <div className="row">
                      <div className="col-md-6">
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex gap-2">
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Buttons */}
                  <div className="d-flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="btn px-4 py-2"
                      style={{ 
                        backgroundColor: '#8447E9', 
                        color: 'white',
                        borderRadius: '8px',
                        fontWeight: '500'
                      }}
                    >
                      Create
                    </button>
                    <button
                      type="submit"
                      className="btn px-4 py-2"
                      style={{ 
                        backgroundColor: '#F5F5F5', 
                        color: '#0F0F0F',
                        borderRadius: '8px',
                        fontWeight: '500',
                        borderColor: '#000000'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
    </div>
  );
};

export default EventifyForm;
