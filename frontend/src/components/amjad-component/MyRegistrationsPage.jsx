import React, { useState, useEffect } from 'react';
import axios from 'axios';

// مكون MessageBox مخصص بدلاً من alert()
// يستخدم Tailwind CSS
const MessageBox = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50`}>
      <div className={`bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center border-t-4 ${type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
        <p className="text-lg font-semibold mb-4">{message}</p>
        <button
          onClick={onClose}
          className={`px-4 py-2 rounded-md text-white ${type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

// مكون ConfirmModal مخصص بدلاً من window.confirm()
// يستخدم Tailwind CSS
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState(null); // { userId, ticketId }
  const [messageBox, setMessageBox] = useState({ message: '', type: '' });


  // عنوان الـ API الأساسي لـ Laravel
  const API_BASE_URL = 'http://localhost:8000/api'; 

  // جلب البيانات من الـ API
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        // هذا يستخدم BuyAPIController@index الذي يرجع {'status': 'success', 'data': [...]}
        // ويقوم بتحميل buy.ticket.event
        const response = await axios.get(`${API_BASE_URL}/buys`); 
        
        if (response.data.status === 'success') {
          // تحويل البيانات إلى الصيغة المطلوبة للعرض
          const formattedRegistrations = response.data.data.map(buy => ({
            id: buy.id, // ID الخاص بسجل الـ buy
            // buy.ticket?.event?.title هو المسار الصحيح للحصول على اسم الحدث
            eventName: buy.ticket?.event?.title || 'Event Name N/A', 
            date: buy.purchase_date ? new Date(buy.purchase_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'N/A',
            // buy.ticket?.event?.location هو المسار الصحيح للحصول على الموقع
            location: buy.ticket?.event?.location || 'Location not specified',
            // تحويل حالة التذكرة من الـ backend
            status: buy.ticket?.status === 'confirmed' ? 'Checked in' : (buy.ticket?.status === 'pending' ? 'Pending' : 'N/A'),
            userId: buy.user_id,
            ticketId: buy.ticket_id,
            userName: buy.user?.name || 'Unknown User'
          }));
          
          setRegistrations(formattedRegistrations);
        } else {
            setError(response.data.message || 'Failed to load registrations with unknown status.');
        }
      } catch (err) {
        console.error('Error fetching registrations:', err);
        setError('Failed to load registrations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  // دالة لبدء عملية الحذف (تظهر Confirm Modal)
  const confirmDeleteRegistration = (userId, ticketId) => {
    setPendingDeletion({ userId, ticketId });
    setShowConfirmModal(true);
  };

  // دالة لتنفيذ الحذف بعد تأكيد المستخدم
  const handleDeleteRegistration = async () => {
    if (!pendingDeletion) return;

    setShowConfirmModal(false); // إخفاء modal التأكيد

    const { userId, ticketId } = pendingDeletion;

    try {
      // إرسال طلب DELETE للـ API
      // هذا سيرسل DELETE request إلى /api/buys/{user_id}/{ticket_id} وسيتعامل معه BuyAPIController@destroy
      const response = await axios.delete(`${API_BASE_URL}/buys/${userId}/${ticketId}`);
      
      if (response.data.status === 'success') {
        // إزالة التسجيل من الحالة المحلية بعد النجاح
        setRegistrations(prev => 
          prev.filter(reg => !(reg.userId === userId && reg.ticketId === ticketId))
        );
        setMessageBox({ message: 'Registration cancelled successfully', type: 'success' });
      } else {
        setMessageBox({ message: response.data.message || 'Failed to cancel registration.', type: 'error' });
      }
    } catch (err) {
      console.error('Error deleting registration:', err);
      setMessageBox({ message: 'Failed to cancel registration. Please try again.', type: 'error' });
    } finally {
      setPendingDeletion(null); // إعادة تعيين حالة الحذف المعلق
    }
  };

  // دالة لإلغاء الحذف
  const cancelDelete = () => {
    setShowConfirmModal(false);
    setPendingDeletion(null);
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center items-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading your registrations...</p>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center items-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      {/* Tailwind CSS (for custom modals) */}
      <script src="https://cdn.tailwindcss.com"></script>
      
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold fs-4" href="#" style={{ color: '#6c5ce7' }}>
            evently
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto d-flex flex-row align-items-center gap-3">
              <a className="nav-link text-muted d-none d-lg-block" href="#">Page</a>
              <a className="nav-link text-muted d-none d-lg-block" href="#">Page</a>
              <a className="nav-link text-muted" href="#">Events</a>
              <button className="btn btn-primary btn-sm" style={{ backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' }}>
                Sign Up
              </button>
              <button className="btn btn-outline-primary btn-sm">Log In</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="bg-white rounded-3 shadow-sm p-4">
              <h2 className="mb-4 fw-bold">My Registrations</h2>
              
              {/* عرض رسالة في حالة عدم وجود تسجيلات */}
              {registrations.length === 0 && !loading && !error ? (
                <div className="text-center py-5">
                  <p className="text-muted">No registrations found.</p>
                  <button className="btn btn-primary" style={{ backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' }}>
                    Browse Events
                  </button>
                </div>
              ) : (
                /* Registration Cards */
                <div className="d-flex flex-column gap-3">
                  {registrations.map((registration) => (
                    <div key={`${registration.userId}-${registration.ticketId}`} className="card border-0 shadow-sm">
                      <div className="card-body py-3">
                        <div className="row align-items-center">
                          {/* Event Info */}
                          <div className="col-12 col-md-6">
                            <h6 className="fw-bold mb-1">{registration.eventName}</h6>
                            <p className="text-muted mb-0 small">
                              {registration.date} • {registration.location}
                            </p>
                            {registration.userName && (
                              <p className="text-muted mb-0 small">
                                Registered by: {registration.userName}
                              </p>
                            )}
                          </div>
                          
                          {/* Status and Actions */}
                          <div className="col-12 col-md-6 mt-2 mt-md-0">
                            <div className="d-flex align-items-center justify-content-md-end gap-2">
                              <span 
                                className={`badge px-3 py-2 ${registration.status === 'Pending' ? 'text-bg-warning' : 'text-bg-success'}`}
                                style={{ fontSize: '0.75rem' }}
                              >
                                {registration.status}
                              </span>
                              <button 
                                className="btn btn-sm text-white fw-medium px-3"
                                style={{ backgroundColor: '#6c5ce7', border: 'none', fontSize: '0.8rem' }}
                              >
                                View Details
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger fw-medium px-3"
                                style={{ fontSize: '0.8rem' }}
                                onClick={() => confirmDeleteRegistration(registration.userId, registration.ticketId)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-muted mt-5 pb-4">
        <small>© 2025, Evently. All rights reserved.</small>
      </footer>

      {/* Modals for confirm and alert messages */}
      {showConfirmModal && (
        <ConfirmModal 
          message="Are you sure you want to cancel this registration?"
          onConfirm={handleDeleteRegistration}
          onCancel={cancelDelete}
        />
      )}
      <MessageBox 
        message={messageBox.message} 
        type={messageBox.type} 
        onClose={() => setMessageBox({ message: '', type: '' })} 
      />

      {/* Bootstrap JS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default MyRegistrationsPage;
