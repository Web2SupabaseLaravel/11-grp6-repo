import React, { useState } from 'react';

const CheckInPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('Waiting');
  const [isLoading, setIsLoading] = useState(false);

  const recentCheckins = [
    'Michael Smith',
    'Sarah Johnson',
    'David Brown',
    'Emma Wilson',
    'John Davis'
  ];

  const handleManualCheckIn = () => {
    if (!searchTerm.trim()) {
      setStatus('Please enter ID or email');
      return;
    }

    setIsLoading(true);
    setStatus('Processing...');
    
    // محاكاة عملية check-in
    setTimeout(() => {
      setStatus('Success');
      setIsLoading(false);
      console.log('Manual check-in completed for:', searchTerm);
    }, 1500);
  };

  const getStatusColor = () => {
    switch(status) {
      case 'Success': return 'text-success';
      case 'Processing...': return 'text-warning';
      case 'Please enter ID or email': return 'text-danger';
      default: return 'text-muted';
    }
  };

  const getStatusIcon = () => {
    switch(status) {
      case 'Success': return '✓';
      case 'Processing...': return '⏳';
      case 'Please enter ID or email': return '⚠️';
      default: return '⭕';
    }
  };

  return (
    <>
      {/* إضافة Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-vh-100 bg-light">
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
          <div className="container-fluid px-3 px-lg-4">
            <a className="navbar-brand fw-bold fs-4 text-primary" href="#" style={{ color: '#6c5ce7' }}>
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
            <div className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-6">
              <div className="bg-white rounded-3 shadow-sm p-3 p-md-4">
                <h2 className="mb-4 fw-bold text-center text-md-start">Check In</h2>
                
                {/* Main Check-in Section */}
                <div className="row g-4">
                  {/* QR Code Scanner */}
                  <div className="col-12 col-lg-6">
                    <div className="bg-light rounded-3 p-4 text-center position-relative" style={{ minHeight: '200px' }}>
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <div className="text-center">
                          <div className="mb-3">
                            {/* QR Code placeholder */}
                            <div 
                              className="mx-auto bg-white border rounded p-3 d-flex align-items-center justify-content-center" 
                              style={{ width: '120px', height: '120px' }}
                            >
                              <div className="d-flex flex-column align-items-center">
                                {/* Barcode lines */}
                                {[...Array(12)].map((_, i) => (
                                  <div 
                                    key={i}
                                    className="bg-dark mb-1" 
                                    style={{ 
                                      width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '2px' : '1px', 
                                      height: '8px' 
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <small className="text-muted">Scan QR Code</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Check-in Form */}
                  <div className="col-12 col-lg-6">
                    <div className="h-100 d-flex flex-column justify-content-center">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Search by ID or Email:</label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg" 
                          placeholder="Enter ID or email"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="form-label fw-semibold">Status:</label>
                        <div className="d-flex align-items-center">
                          <span className={`${getStatusColor()} me-2 fs-5`}>{getStatusIcon()}</span>
                          <span className={`${getStatusColor()} fw-medium`}>{status}</span>
                        </div>
                      </div>

                      <div className="d-grid">
                        <button 
                          className="btn text-white fw-medium py-2"
                          style={{ backgroundColor: isLoading ? '#9ca3af' : '#6c5ce7', border: 'none' }}
                          onClick={handleManualCheckIn}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Processing...
                            </>
                          ) : (
                            'Manual Check-In'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Check-ins */}
                <div className="mt-5">
                  <h5 className="fw-bold mb-3">Recent Check-ins</h5>
                  <div className="list-group list-group-flush">
                    {recentCheckins.map((name, index) => (
                      <div key={index} className="list-group-item border-0 px-0 py-3 d-flex justify-content-between align-items-center">
                        <span className="text-dark fw-medium">{name}</span>
                        <small className="text-muted">Just now</small>
                      </div>
                    ))}
                  </div>
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

      {/* إضافة Bootstrap JS للتفاعل */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </>
  );
};

export default CheckInPage;