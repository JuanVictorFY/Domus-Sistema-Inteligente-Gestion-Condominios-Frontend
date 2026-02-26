import apiClient from '../api.js';

// Users
export const getUsers   = (params) => apiClient.get('/users', { params });
export const createUser = (data) => apiClient.post('/users', data);
export const updateUser = (id, data) => apiClient.put(`/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);

// Profile
export const getProfile       = () => apiClient.get('/profile');
export const updateProfile    = (data) => apiClient.put('/profile', data);
export const changePassword   = (data) => apiClient.put('/profile/password', data);

// Tickets
export const getTickets    = (params) => apiClient.get('/tickets', { params });
export const createTicket  = (data) => apiClient.post('/tickets', data);
export const updateTicket  = (id, data) => apiClient.put(`/tickets/${id}`, data);

// Reservations
export const getReservations   = (params) => apiClient.get('/reservations', { params });
export const createReservation = (data) => apiClient.post('/reservations', data);
export const updateReservationStatus = (id, status) => apiClient.patch(`/reservations/${id}/status`, { status });

// Areas
export const getAreas  = () => apiClient.get('/areas');
export const createArea = (data) => apiClient.post('/areas', data);
export const updateArea = (id, data) => apiClient.put(`/areas/${id}`, data);
export const deleteArea = (id) => apiClient.delete(`/areas/${id}`);

// Stats
export const getStats = () => apiClient.get('/stats');
export const getPersonalStats = () => apiClient.get('/stats/me');
export const getDashboardSummary = () => apiClient.get('/dashboard/summary');

// Maintenance
export const getMaintenance = (params) => apiClient.get('/maintenance', { params });
export const createMaintenance = (data) => apiClient.post('/maintenance', data);
export const updateMaintenanceStatus = (id, status) => apiClient.put(`/maintenance/${id}/status`, { status });

// Notifications
export const getNotifications = () => apiClient.get('/notifications');
export const markNotificationRead = (id) => apiClient.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => apiClient.patch('/notifications/read-all');

// Announcements
export const getAnnouncements = (params) => apiClient.get('/announcements', { params });
export const createAnnouncement = (data) => apiClient.post('/announcements', data);
export const deleteAnnouncement = (id) => apiClient.delete(`/announcements/${id}`);

// Visitors
export const getVisitors = (params) => apiClient.get('/visitors', { params });
export const createVisitor = (data) => apiClient.post('/visitors', data);
export const checkInVisitor = (id) => apiClient.patch(`/visitors/${id}/checkin`);
export const checkOutVisitor = (id) => apiClient.patch(`/visitors/${id}/checkout`);

// Parcels
export const getParcels = (params) => apiClient.get('/parcels', { params });
export const createParcel = (data) => apiClient.post('/parcels', data);
export const deliverParcel = (id) => apiClient.patch(`/parcels/${id}/deliver`);

// Polls
export const getPolls = () => apiClient.get('/polls');
export const votePoll = (id, optionId) => apiClient.post(`/polls/${id}/vote`, { optionId });

// Documents
export const getDocuments = () => apiClient.get('/documents');

// Reports
export const getMonthlyReport = (month, year) => apiClient.get('/reports/monthly', { params: { month, year } });
