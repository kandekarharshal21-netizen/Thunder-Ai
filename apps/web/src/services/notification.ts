// Web Notifications API service conforming to Section 33
class NotificationService {
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    } catch {
      return false;
    }
  }

  public sendAlertNotification(title: string, message: string, severity: 'INFO' | 'WARNING' | 'SEVERE' = 'WARNING') {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    try {
      new Notification(`[THANDER AI] ${title}`, {
        body: message,
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag: `thander-alert-${Date.now()}`
      });
    } catch (e) {
      console.warn("Could not dispatch desktop notification:", e);
    }
  }
}

export const notificationService = new NotificationService();
