import React, { useState } from 'react';
import axios from 'axios';

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
    accessType: 'All Attendees',
    speakerImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // منفصل لرفع صورة الحدث وصورة المتحدث
  const handleEventImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      eventImage: file
    }));
  };

  const handleSpeakerImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      speakerImage: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // إنشاء FormData لرفع الصور
      const data = new FormData();
      data.append('title', formData.eventTitle);
      data.append('description', formData.description);
      if(formData.eventImage) data.append('image', formData.eventImage);
      data.append('country', formData.locationName);
      data.append('city', formData.locationAddress);
      data.append('start_datetime', `${formData.dateStart} ${formData.timeStart}`);
      data.append('capacity', formData.capacity);
      data.append('ticket_type', formData.ticketType);
      data.append('speaker_name', formData.speakerName);
      if(formData.speakerImage) data.append('speaker_image', formData.speakerImage);
      data.append('job_title', formData.jobTitle);
      data.append('access_type', formData.accessType);
      // اذا عندك manager_id تقدر تضيفه هنا:
      // data.append('manager_id', someManagerId);

      // ارسل البيانات إلى API (تأكد من تغيير الرابط حسب الـ backend عندك)
      const response = await axios.post('http://localhost:8000/api/events', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // اذا تستخدم توكن او اوثوريزيشن ضيفه هنا
          // Authorization: 'Bearer your_token_here'
        }
      });

      alert('Event created successfully!');
      console.log('Response:', response.data);

      // ممكن تنظف الفورم بعد الارسال لو حبيت
      setFormData({
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
        accessType: 'All Attendees',
        speakerImage: null,
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-4">
              <h2 className="mb-2" style={{ color: '#8447E9', fontWeight: '600' }}>Create New Event</h2>
              <p className="text-muted">Fill the detailed below to publish your event</p>
            </div>

            <form onSubmit={handleSubmit} className="card border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="card-body p-4">

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
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleEventImageUpload}
                    style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                  />
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
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleSpeakerImageUpload}
                    style={{ borderColor: '#e5e7eb', fontSize: '14px' }}
                  />
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
                    type="button"
                    className="btn px-4 py-2"
                    onClick={() => setFormData({
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
                      accessType: 'All Attendees',
                      speakerImage: null,
                    })}
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
            </form>
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
