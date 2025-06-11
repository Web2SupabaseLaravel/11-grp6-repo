import React from 'react';
import { Link } from 'react-router-dom';

export default function EventlyLanding() {
  return (
    <div style={{ 
  backgroundImage: `url("https://ehufjjspxnrbesbufwkv.supabase.co/storage/v1/object/public/images//pexels-photo-3178786.jpg")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
  fontFamily: 'Arial, sans-serif'
}}>


      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      

      <div className="container py-5">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6 text-center text-lg-start text-white px-4">
            <h1 className="display-2 fw-bold mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              Join Amazing Events
            </h1>
            <p className="lead mb-4 fs-4" style={{ opacity: '0.9' }}>
              Plan, manage, and host unforgettable events with Evently. 
              From small gatherings to large conferences, we've got you covered.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Link to={`/events`}>
                <button 
                    className="btn btn-light btn-lg px-4 py-3 fw-semibold"
                    style={{ 
                    borderRadius: '50px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    View Events
                </button>
              </Link>
              <button 
                className="btn btn-outline-light btn-lg px-4 py-3 fw-semibold"
                style={{ 
                  borderRadius: '50px',
                  borderWidth: '2px'
                }}
              >
                Post an Event
              </button>
            </div>
          </div>
          
          <div className="col-lg-6 text-center mt-5 mt-lg-0">
            <div 
              className="p-5 rounded-4"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <div className="mb-4">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    fontSize: '2rem',
                    color: '#fff'
                  }}
                >
                  
                  O
                </div>
              </div>
              <h3 className="text-white mb-3">Ready to Get Started?</h3>
              <p className="text-white mb-4" style={{ opacity: '0.8' }}>
                Join a lot of event organizers who trust Evently
              </p>
              <div className="row text-center">

                <h4 className="text-white fw-bold">99%</h4>
                <small className="text-white" style={{ opacity: '0.8' }}>Satisfaction</small>

              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
