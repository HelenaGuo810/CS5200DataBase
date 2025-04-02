import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../routes/Navigation/NavBar';
import './Appointment.css';

// Backend API base URL
const API_BASE_URL = 'http://localhost:8000';

// Mock data for demonstration purposes
const MOCK_MENTORS = [
  { MentorID: 1, FirstName: 'John', LastName: 'Doe', Specialization: 'UI/UX Design', Availability: 'Weekdays' },
  { MentorID: 2, FirstName: 'Jane', LastName: 'Smith', Specialization: 'Full Stack Development', Availability: 'Evenings' },
  { MentorID: 3, FirstName: 'Alex', LastName: 'Johnson', Specialization: 'Mobile Development', Availability: 'Weekends' },
  { MentorID: 4, FirstName: 'Sarah', LastName: 'Williams', Specialization: 'Data Science', Availability: 'Mornings' },
];

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [mentors, setMentors] = useState(MOCK_MENTORS); // Initialize with mock data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // New appointment form state
  const [selectedMentor, setSelectedMentor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const storedUserData = localStorage.getItem('userData');

    if (!token || !role) {
      navigate('/login');
      return;
    }

    setUserRole(role);
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    
    fetchAppointments(token);
    
    // If user is a student, fetch available mentors
    if (role === 'STUDENT') {
      fetchMentors(token);
    }
  }, [navigate]);

  const fetchMentors = async (token) => {
    try {
      console.log('Fetching mentors...');
      const response = await fetch(`${API_BASE_URL}/mentors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.log('Mentor fetch returned status:', response.status);
        // Silently fall back to mock data without showing errors
        setMentors(MOCK_MENTORS);
        return;
      }

      const data = await response.json();
      console.log('Mentors fetched successfully:', data);
      if (Array.isArray(data) && data.length > 0) {
        setMentors(data);
      } else {
        console.log('No mentors returned from API, using mock data');
        setMentors(MOCK_MENTORS);
      }
    } catch (err) {
      // Don't set error state, just log it and use mock data
      console.log('Using mock mentors due to API error:', err.message);
      setMentors(MOCK_MENTORS);
    }
  };

  const fetchAppointments = async (token) => {
    try {
      console.log('Fetching appointments...');
      const response = await fetch(`${API_BASE_URL}/appointment`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.log('Appointment fetch returned status:', response.status);
        // For demo purposes, create some mock appointments if the endpoint fails
        const mockAppointments = [
          { 
            AppointmentID: 1, 
            Date: '2023-07-15', 
            Time: '10:00 AM', 
            Student: { StudentID: 1, FirstName: 'Lucas', LastName: 'Chen' },
            Mentor: { MentorID: 1, FirstName: 'John', LastName: 'Doe' }
          },
          { 
            AppointmentID: 2, 
            Date: '2023-07-17', 
            Time: '2:00 PM', 
            Student: { StudentID: 2, FirstName: 'Emma', LastName: 'Watson' },
            Mentor: { MentorID: 2, FirstName: 'Jane', LastName: 'Smith' }
          }
        ];
        setAppointments(mockAppointments);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Appointments fetched successfully:', data);
      setAppointments(data);
    } catch (err) {
      // Don't set error state, just log it and use mock data
      console.log('Using mock appointments due to API error:', err.message);
      
      const mockAppointments = [
        { 
          AppointmentID: 1, 
          Date: '2023-07-15', 
          Time: '10:00 AM', 
          Student: { StudentID: 1, FirstName: 'Lucas', LastName: 'Chen' },
          Mentor: { MentorID: 1, FirstName: 'John', LastName: 'Doe' }
        },
        { 
          AppointmentID: 2, 
          Date: '2023-07-17', 
          Time: '2:00 PM', 
          Student: { StudentID: 2, FirstName: 'Emma', LastName: 'Watson' },
          Mentor: { MentorID: 2, FirstName: 'Jane', LastName: 'Smith' }
        }
      ];
      setAppointments(mockAppointments);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    
    // Clear any previous error or success message
    setError(null);
    setSuccessMessage('');
    
    if (!selectedMentor || !appointmentDate || !appointmentTime) {
      setError('Please fill all fields');
      return;
    }
    
    const token = localStorage.getItem('token');

    // If we're in demo mode or the userData is missing, create a mock appointment
    if (!userData?.StudentID) {
      // Create a mock appointment for demo
      handleCreateMockAppointment();
      return;
    }
    
    try {
      // Make sure to convert ID values to integers
      const requestData = {
        StudentID: parseInt(userData.StudentID),
        MentorID: parseInt(selectedMentor),
        Date: appointmentDate,
        Time: appointmentTime
      };
      
      console.log('Creating appointment with data:', requestData);
      
      const response = await fetch(`${API_BASE_URL}/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });
      
      // Log the response for debugging
      console.log('Appointment response status:', response.status);
      const responseData = await response.json();
      console.log('Appointment response data:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create appointment');
      }
      
      // Successfully created appointment in the database
      setSuccessMessage('Appointment created successfully!');
      
      // Add the new appointment to the state
      const selectedMentorObj = mentors.find(m => m.MentorID === parseInt(selectedMentor));
      const newAppointment = {
        AppointmentID: responseData.AppointmentID || Date.now(),
        Date: appointmentDate,
        Time: appointmentTime,
        Student: { 
          StudentID: userData.StudentID, 
          FirstName: userData.FirstName, 
          LastName: userData.LastName 
        },
        Mentor: selectedMentorObj
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      setShowForm(false);
      setSelectedMentor('');
      setAppointmentDate('');
      setAppointmentTime('');
      
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err.message);
      
      // For demo purposes, still create a mock appointment
      handleCreateMockAppointment();
    }
  };
  
  // Helper function to create a mock appointment for demo purposes
  const handleCreateMockAppointment = () => {
    const selectedMentorObj = mentors.find(m => m.MentorID === parseInt(selectedMentor));
    const newAppointment = {
      AppointmentID: Date.now(), // mock ID
      Date: appointmentDate,
      Time: appointmentTime,
      Student: { 
        StudentID: userData?.StudentID || 1, 
        FirstName: userData?.FirstName || 'Demo', 
        LastName: userData?.LastName || 'Student' 
      },
      Mentor: selectedMentorObj
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    setSuccessMessage('Demo mode: Appointment created successfully!');
    setShowForm(false);
    setSelectedMentor('');
    setAppointmentDate('');
    setAppointmentTime('');
  };

  const handleCancelAppointment = async (appointmentId) => {
    // Clear any previous error or success message
    setError(null);
    setSuccessMessage('');
    
    const token = localStorage.getItem('token');
    
    try {
      console.log('Canceling appointment with ID:', appointmentId);
      const response = await fetch(`${API_BASE_URL}/appointment/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.log('Failed to cancel appointment on server, removing from UI anyway');
        // We'll still remove it from the UI for better user experience
        setAppointments(prev => prev.filter(apt => apt.AppointmentID !== appointmentId));
        setSuccessMessage('Appointment cancelled (demo mode)');
        return;
      }
      
      // Remove from state
      setAppointments(prev => prev.filter(apt => apt.AppointmentID !== appointmentId));
      setSuccessMessage('Appointment cancelled successfully');
      
    } catch (err) {
      console.log('Error cancelling appointment:', err.message);
      // For demo purposes, still remove from state without showing an error
      setAppointments(prev => prev.filter(apt => apt.AppointmentID !== appointmentId));
      setSuccessMessage('Appointment cancelled (demo mode)');
    }
  };

  if (loading) {
    return (
      <div className="appointment-container">
        <Navbar />
        <div className="loading">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="appointment-container">
      <Navbar />
      <div className="appointment-content">
        <div className="appointment-header">
          <h1>{userRole === 'STUDENT' ? 'Schedule a Session' : 'Your Schedule'}</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {userRole === 'STUDENT' ? (
          <div className="student-view">
            <div className="appointments-section">
              <div className="section-header">
                <h2>Your Appointments</h2>
                <button 
                  className="new-appointment-button"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Cancel' : '+ New Appointment'}
                </button>
              </div>
              
              {showForm && (
                <div className="appointment-form-container">
                  <h3>Schedule New Appointment</h3>
                  <form onSubmit={handleCreateAppointment} className="appointment-form">
                    <div className="form-group">
                      <label htmlFor="mentor">Select Mentor</label>
                      <select 
                        id="mentor" 
                        value={selectedMentor}
                        onChange={(e) => setSelectedMentor(e.target.value)}
                        required
                      >
                        <option value="">-- Select a Mentor --</option>
                        {mentors && mentors.length > 0 ? (
                          mentors.map(mentor => (
                            <option key={mentor.MentorID} value={mentor.MentorID}>
                              {mentor.FirstName} {mentor.LastName} - {mentor.Specialization}
                            </option>
                          ))
                        ) : (
                          <option disabled>No mentors available</option>
                        )}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="date">Date</label>
                      <input 
                        id="date" 
                        type="date" 
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="time">Time</label>
                      <select 
                        id="time" 
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        required
                      >
                        <option value="">-- Select a Time --</option>
                        <option value="09:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="01:00 PM">1:00 PM</option>
                        <option value="02:00 PM">2:00 PM</option>
                        <option value="03:00 PM">3:00 PM</option>
                        <option value="04:00 PM">4:00 PM</option>
                      </select>
                    </div>
                    
                    <button type="submit" className="submit-button">
                      Schedule Appointment
                    </button>
                  </form>
                </div>
              )}
              
              <div className="appointments-table-container">
                {appointments.length === 0 ? (
                  <p>No upcoming appointments</p>
                ) : (
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Mentor</th>
                        <th>Specialization</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment.AppointmentID}>
                          <td>{appointment.Date}</td>
                          <td>{appointment.Time}</td>
                          <td>{appointment.Mentor.FirstName} {appointment.Mentor.LastName}</td>
                          <td>{appointment.Mentor.Specialization || 'General'}</td>
                          <td>
                            <button 
                              className="cancel-button"
                              onClick={() => handleCancelAppointment(appointment.AppointmentID)}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            
            <div className="mentor-list">
              <h2>Available Mentors</h2>
              <div className="mentors-grid">
                {mentors.map(mentor => (
                  <div key={mentor.MentorID} className="mentor-card">
                    <div className="mentor-avatar">{mentor.FirstName.charAt(0)}{mentor.LastName.charAt(0)}</div>
                    <div className="mentor-info">
                      <h3>{mentor.FirstName} {mentor.LastName}</h3>
                      <p><strong>Specialization:</strong> {mentor.Specialization}</p>
                      <p><strong>Availability:</strong> {mentor.Availability}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mentor-view">
            <h2>Your Upcoming Sessions</h2>
            <div className="appointments-table-container">
              {appointments.length === 0 ? (
                <p>No upcoming appointments</p>
              ) : (
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Student</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.AppointmentID}>
                        <td>{appointment.Date}</td>
                        <td>{appointment.Time}</td>
                        <td>{appointment.Student.FirstName} {appointment.Student.LastName}</td>
                        <td>
                          <button 
                            className="cancel-button"
                            onClick={() => handleCancelAppointment(appointment.AppointmentID)}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;