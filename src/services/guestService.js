import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getGuests = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/guests`);
    return response.data;
  } catch (error) {
    console.error('Error fetching guests:', error);
    return [];
  }
};

export const addGuest = async (guestData) => {
  try {
    const response = await axios.post(`${API_URL}/api/guests`, guestData);
    return response.data;
  } catch (error) {
    console.error('Error adding guest:', error);
    throw error;
  }
};

export const updateGuest = async (guestName, guestData) => {
  try {
    const response = await axios.put(`${API_URL}/api/guests/${encodeURIComponent(guestName)}`, guestData);
    return response.data;
  } catch (error) {
    console.error('Error updating guest:', error);
    throw error;
  }
};

export const deleteGuest = async (guestName) => {
  try {
    const response = await axios.delete(`${API_URL}/api/guests/${encodeURIComponent(guestName)}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting guest:', error);
    throw error;
  }
}; 