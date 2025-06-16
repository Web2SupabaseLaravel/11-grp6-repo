import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditeEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventTitle: '',
    description: '',
    eventImage: '',
    locationName: '',
    locationAddress: '',
    dateStart: '',
    timeStart: '',
    capacity: '',
    ticketType: '',
    speakerName: '',
    jobTitle: '',
    accessType: 'All Attendees',
  });

  const token = localStorage.getItem('token') || 'YOUR_API_TOKEN_HERE';

  useEffect(() => {
    axios.get(`http://localhost:8000/api/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const event = response.data;

      let date = '';
      let time = '';
      if (event.start_datetime && event.start_datetime.includes('T')) {
        [date, time] = event.start_datetime.split('T');
        time = time.slice(0, 5);
      }

      setFormData({
        eventTitle: event.title || '',
        description: event.description || '',
        eventImage: event.image || '',
        locationName: event.city || '',
        locationAddress: event.country || '',
        dateStart: date || '',
        timeStart: time || '',
        capacity: event.capacity || '',
        ticketType: event.ticket_type || '',
        speakerName: event.speaker_name || '',
        jobTitle: event.job_title || '',
        accessType: event.access_type || 'All Attendees',
      });
    })
    .catch(error => {
      console.error(error);
      alert('فشل في تحميل بيانات الحدث');
    });
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.eventTitle,
      description: formData.description,
      image: formData.eventImage,
      city: formData.locationName,
      country: formData.locationAddress,
      start_datetime: `${formData.dateStart}T${formData.timeStart}`,
      capacity: parseInt(formData.capacity) || 0,
      ticket_type: formData.ticketType,
      speaker_name: formData.speakerName,
      job_title: formData.jobTitle,
      access_type: formData.accessType,
    };

    try {
      await axios.put(`http://localhost:8000/api/events/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('تم التعديل بنجاح');
      navigate('/list-event');
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء تعديل الحدث');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا الحدث؟')) return;

    try {
      await axios.delete(`http://localhost:8000/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('تم حذف الحدث');
      navigate('/list-event');
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء حذف الحدث');
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-4">
              <h2 className="mb-2 text-purple fw-semibold">Edit The Event</h2>
              <p className="text-muted">Fill the details below to publish your event</p>
            </div>

            <div className="card border-0 shadow-sm bg-white">
              <form onSubmit={handleSubmit}>
                <div className="card-body p-4">
                  {/* الحقول هنا مثل السابق */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Event Title</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="eventTitle"
                      value={formData.eventTitle}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Description</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Location</label>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Location Name"
                          name="locationName"
                          value={formData.locationName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Location Address"
                          name="locationAddress"
                          value={formData.locationAddress}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Date/Time</label>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input
                          type="date"
                          className="form-control"
                          name="dateStart"
                          value={formData.dateStart}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="time"
                          className="form-control"
                          name="timeStart"
                          value={formData.timeStart}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Capacity & Tickets</label>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Capacity"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          min={1}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <select
                          className="form-select"
                          name="ticketType"
                          value={formData.ticketType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Ticket Type</option>
                          <option value="free">Free</option>
                          <option value="paid">Paid</option>
                          <option value="donation">Donation</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Speakers</label>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          name="speakerName"
                          value={formData.speakerName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Job Title"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                 

                  {/* أزرار Apply و Delete */}
                  <div className="d-flex justify-content-between">
                    <button
                      type="submit"
                      className="btn px-4 py-2"
                      style={{
                        backgroundColor: '#8447E9',
                        color: '#fff',
                        borderRadius: '8px',
                        fontWeight: '600',
                        border: 'none',
                      }}
                    >
                      Apply
                    </button>

                    <button
                      type="button"
                      onClick={handleDelete}
                      className="btn px-4 py-2"
                      style={{
                        backgroundColor: '#FF5B5B',
                        color: '#fff',
                        borderRadius: '8px',
                        fontWeight: '600',
                        border: 'none',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <style>{`
        .text-purple {
          color: #8447E9;
        }
        .fw-semibold {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default EditeEvent;
