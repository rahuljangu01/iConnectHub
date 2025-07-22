import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignupPage.css';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    collegeId: '',
    password: '',
    role: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      setError('Please select a role (Student or Club)');
      return;
    }

    try {
      const result = await signup(formData);
      console.log("Signup result:", result);

      if (result.success) {
        alert('Signup successful! Please login.');
        setError('');
        navigate('/login');
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            {/* Header icon removed */}
            <h2 className="signup-title">College Event Hub</h2>
            <p className="signup-subtitle">Create your account to explore events</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">I am a</label>
              <div className="role-selector">
                <label
                  className={`role-option ${formData.role === 'student' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('student')}
                >
                  <input type="radio" name="role" value="student" checked={formData.role === 'student'} readOnly />
                  {/* Icon removed */}
                  <span>Student</span>
                </label>
                <label
                  className={`role-option ${formData.role === 'club' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('club')}
                >
                  <input type="radio" name="role" value="club" checked={formData.role === 'club'} readOnly />
                  {/* Icon removed */}
                  <span>Club</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              {/* Input container and icon removed */}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              {/* Input container and icon removed */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="example@college.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College ID</label>
              {/* Input container and icon removed */}
              <input
                type="text"
                name="collegeId"
                value={formData.collegeId}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., LPU12345"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              {/* Input container, icon, and toggle button removed */}
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;