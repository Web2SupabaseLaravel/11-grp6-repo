import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ مهم للتنقل بين الصفحات

export default function EmailVerification() {
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate(); // ✅ استخدمنا useNavigate

  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = () => {
    if (code.every(digit => digit !== '')) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/reset-password'); // ✅ التنقل بعد نجاح التحقق
      }, 2000);
    }
  };

  const handleResendCode = () => {
    if (countdown === 0) {
      alert('Verification code resent to helloworld@gmail.com');
      setCountdown(20);
    }
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <>
      {/* Bootstrap CSS CDN */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
        rel="stylesheet"
      />

      <div className="min-vh-100" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-fluid px-0">
          <div className="row g-0 min-vh-100">
            {/* Left Side - Form */}
            <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4">
              <div className="w-100" style={{ maxWidth: '400px' }}>
                {/* Back Arrow */}
                <div className="mb-4">
                  <button className="btn p-0 border-0 bg-transparent">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18L9 12L15 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Title */}
                <h1 className="fw-bold mb-3" style={{ fontSize: '2rem', color: '#1a1a1a' }}>
                  Please check your email
                </h1>

                {/* Subtitle */}
                <p className="mb-4" style={{ color: '#666', fontSize: '0.95rem' }}>
                  We've sent a code to <span style={{ color: '#1a1a1a' }}>helloworld@gmail.com</span>
                </p>

                {/* Code Input Fields */}
                <div className="d-flex gap-3 mb-4 justify-content-center">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      className="form-control text-center fw-bold"
                      style={{
                        width: '55px',
                        height: '55px',
                        fontSize: '1.25rem',
                        border: '2px solid #8447E9',  // لون البنفسجي الجديد
                        borderRadius: '8px',
                        backgroundColor: 'white'
                      }}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1}
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <div className="d-flex justify-content-center mb-3">
                  <button
                    className="btn fw-semibold border-0"
                    style={{
                      backgroundColor: '#8447E9', // لون البنفسجي الجديد
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      width: '180px',
                      height: '48px'
                    }}
                    onClick={handleVerify}
                    disabled={!code.every(digit => digit !== '') || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Verifying...
                      </>
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>

                {/* Resend Code */}
                <div className="text-center mb-5">
                  <button
                    className="btn p-0 border-0 bg-transparent text-decoration-none"
                    style={{
                      color: countdown > 0 ? '#999' : '#666',
                      fontSize: '0.9rem',
                      cursor: countdown > 0 ? 'not-allowed' : 'pointer'
                    }}
                    onClick={handleResendCode}
                    disabled={countdown > 0}
                  >
                    {countdown > 0
                      ? `Send code again 00.${countdown.toString().padStart(2, '0')}`
                      : 'Send code again 00.20'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="col-12 col-lg-6 d-none d-md-flex align-items-center justify-content-center p-4" style={{ backgroundColor: '#ffffff' }}>
              <div className="text-center w-100">
                <img
                  src="/assets/reset_pass.png"
                  alt="Reset Password"
                  className="img-fluid"
                  style={{ maxWidth: '400px', height: 'auto' }}
                />
                {/* Decorative Circles */}
                <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: -1 }}>
                  <div
                    className="position-absolute rounded-circle"
                    style={{
                      width: '200px',
                      height: '200px',
                      backgroundColor: 'rgba(132, 71, 233, 0.1)', // adjusted rgba for new purple
                      top: '-100px',
                      left: '-100px'
                    }}
                  ></div>
                  <div
                    className="position-absolute rounded-circle"
                    style={{
                      width: '150px',
                      height: '150px',
                      backgroundColor: 'rgba(132, 71, 233, 0.08)',
                      top: '-75px',
                      left: '50px'
                    }}
                  ></div>
                  <div
                    className="position-absolute rounded-circle"
                    style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: 'rgba(132, 71, 233, 0.05)',
                      top: '30px',
                      left: '-50px'
                    }}
                  ></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
