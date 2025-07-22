// src/services/api.js

const BASE_URL = 'http://localhost:5050/api';

// Helper function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

/**
 * A reusable helper function to make all API requests.
 * It automatically handles adding the authorization token and parsing JSON.
 * This makes our code much cleaner and easier to maintain.
 * @param {string} endpoint - The API endpoint to call (e.g., '/events').
 * @param {object} options - Configuration for the fetch call (e.g., method, body).
 * @returns {Promise<object>} The JSON response from the API.
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add the Authorization header if a token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    const data = await response.json();

    // If the response is not successful, return the error message from the backend
    if (!response.ok) {
      return { success: false, message: data.message || `Request failed with status ${response.status}` };
    }
    
    // The backend already sends a structured response like { success: true, ... }
    return data;
  } catch (error) {
    // Handle network errors (e.g., server is down)
    console.error(`API Request Error to ${endpoint}:`, error);
    return { success: false, message: 'Network error. Please check your connection or if the server is running.' };
  }
};


// This is the main object you will import and use in your components
export const api = {

  // ==================================
  //  Authentication Functions
  // ==================================
  signup: (formData) => apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(formData)
  }),

  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),


  // ==================================
  //  Event Functions
  // ==================================
  
  /**
   * Gets all events for the public events page.
   */
  getEvents: () => apiRequest('/events'),

  /**
   * Gets a single event by its ID.
   * @param {string} id - The ID of the event.
   */
  getEvent: (id) => apiRequest(`/events/${id}`),

  /**
   * ✅ Gets only the events created by the currently logged-in club.
   * This is the function your Club Dashboard should use.
   */
  getMyEvents: () => apiRequest('/events/my-events'),

  /**
   * Creates a new event.
   * @param {object} eventData - The data for the new event.
   */
  createEvent: (eventData) => apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  }),

  /**
   * Updates an existing event.
   * @param {string} id - The ID of the event to update.
   * @param {object} eventData - The new data for the event.
   */
  updateEvent: (id, eventData) => apiRequest(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData)
  }),

  /**
   * Deletes an event.
   * @param {string} id - The ID of the event to delete.
   */
  deleteEvent: (id) => apiRequest(`/events/${id}`, {
    method: 'DELETE'
  }),
  

  // ==================================
  //  Registration (Booking) Functions
  // ==================================
  
  /**
   * Books a ticket for an event for a specific user.
   * @param {string} eventId - The ID of the event.
   * @param {string} userId - The ID of the user.
   */
  bookEvent: (eventId, userId) => apiRequest(`/registrations`, {
      method: 'POST',
      body: JSON.stringify({ event: eventId, user: userId })
  }),

  /**
   * Gets all bookings made by a specific user.
   * @param {string} userId - The ID of the user.
   */
  getUserBookings: () => apiRequest(`/registrations/my-bookings`),
};