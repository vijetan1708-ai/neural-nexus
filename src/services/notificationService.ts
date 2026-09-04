import { ProactiveNotification } from '../types/alerts';

export class NotificationService {
  private static STORAGE_KEY = 'weathergpt_notifications_v1';

  /**
   * Request browser push notification permissions
   */
  static async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return await Notification.requestPermission();
  }

  /**
   * Check if notifications are enabled
   */
  static isPermissionGranted(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  }

  /**
   * Send a system notification and store in history timeline
   */
  static sendNotification(notification: ProactiveNotification) {
    // 1. Browser Native Push Notification
    if (this.isPermissionGranted()) {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo.svg',
          badge: '/logo.svg',
          tag: notification.id
        });
      } catch (e) {
        console.warn('Native notification trigger failed:', e);
      }
    }

    // 2. Persist to in-app timeline
    this.saveNotificationToHistory(notification);
  }

  /**
   * Retrieve notification history from storage
   */
  static getHistory(): ProactiveNotification[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fall through to initial defaults
    }

    // Default preloaded notifications to showcase proactive intelligence
    return [
      {
        id: 'notif_1',
        title: '🌧️ Heavy Rain Early Notice',
        message: 'Precipitation probability increasing over Chennai coastal belt. Showers expected between 4:30 PM and 7:00 PM.',
        timestamp: 'Today at 01:15 PM',
        read: false,
        type: 'rain_alert',
        severity: 'alert',
        sourceType: 'ai_prediction',
        actionText: 'View Radar'
      },
      {
        id: 'notif_2',
        title: '🚨 IMD Official Warning Issued',
        message: 'Regional Special Bulletin: Convective squalls and lightning warnings issued for North Coastal Tamil Nadu.',
        timestamp: 'Today at 10:45 AM',
        read: true,
        type: 'official_warning',
        severity: 'warning',
        sourceType: 'official_imd',
        actionText: 'Emergency Mode'
      },
      {
        id: 'notif_3',
        title: '🌡️ Afternoon Thermal Advisory',
        message: 'UV Index predicted to peak at 8.2 today. Ensure sun protection for outdoor workers.',
        timestamp: 'Yesterday at 09:00 AM',
        read: true,
        type: 'heat_alert',
        severity: 'watch',
        sourceType: 'ai_prediction',
        actionText: 'Heat Safety'
      }
    ];
  }

  /**
   * Save a new notification to history
   */
  static saveNotificationToHistory(notif: ProactiveNotification) {
    const list = this.getHistory();
    const updated = [notif, ...list.filter(item => item.id !== notif.id)].slice(0, 30);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Mark all notifications as read
   */
  static markAllAsRead(): ProactiveNotification[] {
    const list = this.getHistory().map(n => ({ ...n, read: true }));
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore
    }
    return list;
  }
}
