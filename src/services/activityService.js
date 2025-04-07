import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getActivities = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/activities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

export const getActivityIcon = (activityType) => {
  switch (activityType) {
    case 'ai_notification':
      return 'notifications';
    case 'guest_message':
      return 'message';
    case 'owner_reply':
      return 'reply';
    case 'owner_message_delivered':
      return 'check_circle';
    case 'emergency_notification':
      return 'warning';
    default:
      return 'info';
  }
};

export const getActivityColor = (activityType) => {
  switch (activityType) {
    case 'ai_notification':
      return 'primary';
    case 'guest_message':
      return 'secondary';
    case 'owner_reply':
      return 'success';
    case 'owner_message_delivered':
      return 'info';
    case 'emergency_notification':
      return 'error';
    default:
      return 'default';
  }
}; 