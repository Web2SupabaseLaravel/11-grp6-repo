import React, { useState, useEffect } from 'react';

const SendEmailPage = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState('all');
  const [userGroups, setUserGroups] = useState([]);

  // Simulate loading users from database
  useEffect(() => {
    fetchUsers();
    fetchUserGroups();
  }, []);

  // Function to fetch users from database
  const fetchUsers = async () => {
    try {
      // Simulate API call - replace this with actual API
      // const response = await fetch('/api/users');
      // const userData = await response.json();
      
      // Sample data
      const userData = [
        { id: 1, name: 'Ahmed Mohammed', email: 'ahmed@example.com', group: 'admins' },
        { id: 2, name: 'Fatima Ali', email: 'fatima@example.com', group: 'users' },
        { id: 3, name: 'Mohammed Khalid', email: 'mohamed@example.com', group: 'users' }
      ];
      
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setStatus({ type: 'error', message: 'Failed to load users list' });
    }
  };

  // Function to fetch user groups
  const fetchUserGroups = async () => {
    try {
      // Simulate API call
      const groupData = [
        { id: 'all', name: 'All Users', count: users.length },
        { id: 'admins', name: 'Administrators', count: 1 },
        { id: 'users', name: 'Regular Users', count: 2 }
      ];
      
      setUserGroups(groupData);
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Check file size (example: max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'File size too large. Maximum 5MB allowed' });
      return;
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
    if (file && !allowedTypes.includes(file.type)) {
      setStatus({ type: 'error', message: 'File type not supported' });
      return;
    }
    
    setAttachedFile(file);
    setStatus({ type: '', message: '' });
  };

  const validateForm = () => {
    if (!subject.trim()) {
      setStatus({ type: 'error', message: 'Please enter email subject' });
      return false;
    }
    
    if (!message.trim()) {
      setStatus({ type: 'error', message: 'Please enter email message' });
      return false;
    }
    
    if (subject.length > 100) {
      setStatus({ type: 'error', message: 'Subject too long (100 characters maximum)' });
      return false;
    }
    
    return true;
  };

  const handleSend = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      // Prepare data for sending
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('message', message);
      formData.append('recipients', selectedUsers);
      
      if (attachedFile) {
        formData.append('attachment', attachedFile);
      }
      
      // Send data to database
      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type when using FormData
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // If using authentication
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStatus({ type: 'success', message: `Email sent successfully to ${result.sentCount} users` });
        
        // Log activity to database
        await logEmailActivity({
          subject,
          recipients: selectedUsers,
          sentAt: new Date().toISOString(),
          attachmentName: attachedFile?.name || null
        });
        
        // Reset form after successful send
        setTimeout(() => {
          handleClear();
        }, 2000);
        
      } else {
        throw new Error(result.message || 'Failed to send');
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus({ 
        type: 'error', 
        message: error.message || 'An error occurred while sending email' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to log email activity
  const logEmailActivity = async (activityData) => {
    try {
      await fetch('/api/email-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(activityData)
      });
    } catch (error) {
      console.error('Error logging email activity:', error);
    }
  };

  const handleClear = () => {
    setSubject('');
    setMessage('');
    setAttachedFile(null);
    setSelectedUsers('all');
    setStatus({ type: '', message: '' });
    
    // Reset file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
  };

  const getStatusColor = () => {
    switch (status.type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#8447e9', 
            fontSize: '2rem', 
            fontWeight: '600',
            marginBottom: '8px',
            margin: '0'
          }}>
            Send Email to Registered Users
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1rem',
            margin: '8px 0 0 0'
          }}>
            Send bulk emails to users
          </p>
        </div>

        {/* Status Message */}
        {status.message && (
          <div style={{
            backgroundColor: status.type === 'success' ? '#d1fae5' : status.type === 'error' ? '#fee2e2' : '#fef3c7',
            border: `1px solid ${getStatusColor()}`,
            color: getStatusColor(),
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {status.message}
          </div>
        )}

        {/* Main Form Card */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '40px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
            {/* Email Illustration */}
            <div style={{ 
              minWidth: '200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px'
            }}>
              <svg width="180" height="140" viewBox="0 0 200 160" style={{filter: 'drop-shadow(0 4px 8px rgba(132, 71, 233, 0.15))'}}>
                <rect x="120" y="20" width="70" height="120" rx="12" fill="#8447e9" stroke="#7c3aed" strokeWidth="2"/>
                <rect x="125" y="30" width="60" height="80" rx="4" fill="white"/>
                <circle cx="155" cy="125" r="6" fill="white" opacity="0.8"/>
                
                <rect x="20" y="50" width="100" height="70" rx="8" fill="white" stroke="#8447e9" strokeWidth="3"/>
                <path d="M25 55 L70 85 L115 55" stroke="#8447e9" strokeWidth="3" fill="none" strokeLinecap="round"/>
                
                <line x1="30" y1="95" x2="85" y2="95" stroke="#d1d5db" strokeWidth="2"/>
                <line x1="30" y1="105" x2="110" y2="105" stroke="#d1d5db" strokeWidth="2"/>
                
                <circle cx="135" cy="70" r="3" fill="#8447e9" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="145" cy="65" r="2" fill="#8447e9" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="130" cy="80" r="2.5" fill="#8447e9" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite"/>
                </circle>
                
                <ellipse cx="155" cy="145" rx="25" ry="15" fill="#fbbf24" opacity="0.9"/>
                <path d="M135 140 Q155 150 175 140" stroke="#f59e0b" strokeWidth="3" fill="none"/>
              </svg>
            </div>

            {/* Form Section */}
            <div style={{ flex: '1' }}>
              
              {/* Recipients Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  color: '#111827', 
                  fontSize: '1rem', 
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Recipients ({users.length} users)
                </label>
                <select
                  value={selectedUsers}
                  onChange={(e) => setSelectedUsers(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8447e9'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="all">All Users ({users.length})</option>
                  <option value="admins">Administrators Only</option>
                  <option value="users">Regular Users Only</option>
                </select>
              </div>
            
              {/* Subject Field */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  color: '#111827', 
                  fontSize: '1rem', 
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Subject <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength="100"
                  placeholder="Enter email subject"
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8447e9'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <div style={{ 
                  textAlign: 'right', 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  marginTop: '4px' 
                }}>
                  {subject.length}/100
                </div>
              </div>

              {/* File Attachment */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ 
                    color: '#111827', 
                    fontSize: '1rem', 
                    fontWeight: '500'
                  }}>
                    Attach File
                  </span>
                  <label 
                    htmlFor="fileInput" 
                    style={{
                      border: '1px solid #8447e9',
                      color: '#8447e9',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      backgroundColor: 'white',
                      display: 'inline-block',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#8447e9';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#8447e9';
                    }}
                  >
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf,.txt"
                  />
                  <span style={{ 
                    color: attachedFile ? '#111827' : '#6b7280', 
                    fontSize: '0.9rem',
                    fontStyle: attachedFile ? 'normal' : 'italic'
                  }}>
                    {attachedFile ? attachedFile.name : 'No file selected'}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  marginTop: '4px' 
                }}>
                  Supported files: JPG, PNG, PDF, TXT (max 5MB)
                </div>
              </div>

              {/* Message Field */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{ 
                  color: '#111827', 
                  fontSize: '1rem', 
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Message <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows="6"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '16px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    resize: 'vertical',
                    minHeight: '150px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8447e9'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                justifyContent: 'flex-start'
              }}>
                <button
                  onClick={handleSend}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#9ca3af' : '#8447e9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    if (!loading) e.target.style.backgroundColor = '#7c3aed';
                  }}
                  onMouseOut={(e) => {
                    if (!loading) e.target.style.backgroundColor = '#8447e9';
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Sending...
                    </>
                  ) : (
                    'Send Email'
                  )}
                </button>
                <button
                  onClick={handleClear}
                  disabled={loading}
                  style={{
                    border: '1px solid #d1d5db',
                    color: '#6b7280',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.borderColor = '#9ca3af';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#d1d5db';
                    }
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginTop: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            color: '#111827', 
            fontSize: '1.25rem', 
            fontWeight: '600',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            User Statistics
          </h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8447e9' }}>
                {users.length}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Total Users
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
                {users.filter(u => u.group === 'admins').length}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Administrators
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
                {users.filter(u => u.group === 'users').length}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Regular Users
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SendEmailPage;