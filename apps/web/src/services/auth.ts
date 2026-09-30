export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'Citizen' | 'Analyst' | 'Operator' | 'Admin';
  organization?: string;
  createdAt: string;
}

const AUTH_STORAGE_KEY = 'thander_auth_session';

const DEFAULT_USER: UserProfile = {
  id: 'usr-officer-01',
  email: 'duty.officer@thander.met.in',
  name: 'Flight Lt. Vikram Sharma',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  role: 'Operator',
  organization: 'National Severe Convective Operations Center',
  createdAt: '2026-01-15T08:00:00Z'
};

export const authService = {
  getUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return null;
  },

  setUser(user: UserProfile) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('thander-auth-changed'));
  },

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event('thander-auth-changed'));
  },

  isAuthenticated(): boolean {
    return !!this.getUser();
  },

  loginWithGoogleCredential(credential: string): UserProfile {
    // Decode Google JWT payload if provided
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      const user: UserProfile = {
        id: `g-${payload.sub}`,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        avatar: payload.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        role: 'Analyst',
        organization: 'Independent Meteorological Research',
        createdAt: new Date().toISOString()
      };
      this.setUser(user);
      return user;
    } catch {
      return this.loginDemo('Operator');
    }
  },

  loginDemo(role: 'Citizen' | 'Analyst' | 'Operator' | 'Admin' = 'Operator'): UserProfile {
    const rolesMap: Record<string, UserProfile> = {
      Operator: {
        id: 'usr-officer-01',
        email: 'duty.officer@thander.met.in',
        name: 'Duty Officer Vikram Sharma',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        role: 'Operator',
        organization: 'Western Ghats Convective Radar Net',
        createdAt: '2026-01-15T08:00:00Z'
      },
      Analyst: {
        id: 'usr-analyst-02',
        email: 'a.mukherjee@nwp.gov.in',
        name: 'Dr. Ananya Mukherjee',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
        role: 'Analyst',
        organization: 'Atmospheric Physics & Nowcasting Group',
        createdAt: '2026-02-10T10:30:00Z'
      },
      Admin: {
        id: 'usr-admin-01',
        email: 'sysadmin@thander.ai',
        name: 'Command Administrator',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        role: 'Admin',
        organization: 'THANDER AI Core Infrastructure',
        createdAt: '2025-11-01T00:00:00Z'
      },
      Citizen: {
        id: 'usr-citizen-09',
        email: 'rahul.deshmukh@gmail.com',
        name: 'Rahul Deshmukh',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
        role: 'Citizen',
        organization: 'Pune Rural Farmer Co-op',
        createdAt: '2026-03-01T12:00:00Z'
      }
    };
    const user = rolesMap[role] || rolesMap['Operator'];
    this.setUser(user);
    return user;
  }
};
