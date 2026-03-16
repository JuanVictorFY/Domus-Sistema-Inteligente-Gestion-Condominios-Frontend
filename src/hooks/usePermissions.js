import { useAuth } from './useAuth.js';

export const usePermissions = () => {
  const { user } = useAuth();
  const role = user?.role?.toUpperCase() || '';

  return {
    can: (action) => {
      const permissions = {
        manageUsers:      role === 'ADMIN',
        approveReservations: role === 'ADMIN',
        viewReports:      role === 'ADMIN',
        manageAreas:      role === 'ADMIN',
        createTicket:     role === 'RESIDENTE',
        createReservation:role === 'RESIDENTE',
        manageSecurity:   role === 'SEGURIDAD' || role === 'ADMIN',
        viewBitacora:     role === 'SEGURIDAD' || role === 'ADMIN',
        manageNotifications: role === 'ADMIN',
      };
      return permissions[action] ?? false;
    },
    isAdmin:     role === 'ADMIN',
    isResident:  role === 'RESIDENTE',
    isSecurity:  role === 'SEGURIDAD',
  };
};
