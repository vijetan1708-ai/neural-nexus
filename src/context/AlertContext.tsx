import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProactiveNotification, WeatherAlert } from '../types/alerts';
import { NotificationService } from '../services/notificationService';

interface AlertContextType {
  alerts: WeatherAlert[];
  setAlerts: React.Dispatch<React.SetStateAction<WeatherAlert[]>>;
  notifications: ProactiveNotification[];
  unreadNotificationsCount: number;
  addNotification: (notif: ProactiveNotification) => void;
  markNotificationsAsRead: () => void;
  isEmergencyMode: boolean;
  setIsEmergencyMode: (active: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [notifications, setNotifications] = useState<ProactiveNotification[]>(() => NotificationService.getHistory());
  const [isEmergencyMode, setIsEmergencyMode] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const addNotification = (notif: ProactiveNotification) => {
    NotificationService.sendNotification(notif);
    setNotifications(prev => [notif, ...prev.filter(n => n.id !== notif.id)]);
  };

  const markNotificationsAsRead = () => {
    const updated = NotificationService.markAllAsRead();
    setNotifications(updated);
  };

  return (
    <AlertContext.Provider value={{
      alerts,
      setAlerts,
      notifications,
      unreadNotificationsCount,
      addNotification,
      markNotificationsAsRead,
      isEmergencyMode,
      setIsEmergencyMode,
      isNotificationDrawerOpen,
      setIsNotificationDrawerOpen
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
