import { API_CONFIG } from '../utils/constants';

class AuthService {
  async signIn(email, password) {
    try {
      const response = await fetch(`${API_CONFIG.IDENTITY_BASE_URL}/User/SignIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.accepted && result.data && result.data.length > 0) {
        const userData = result.data[0];
        localStorage.setItem('accessToken', userData.accessToken);
        localStorage.setItem('userEmail', email);
        return {
          success: true,
          data: {
            user: { email },
            accessToken: userData.accessToken,
          },
        };
      } else {
        return {
          success: false,
          error: result.errorMessages?.join(', ') || 'Մուտքը ձախողվեց։ Ստուգեք ձեր տվյալները։',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Մուտքի ժամանակ տեղի ունեցավ սխալ։',
      };
    }
  }

  async signOut() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userEmail');
    }
    return { success: true };
  }

  getStoredToken() {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  getStoredEmail() {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('userEmail');
    }
    return null;
  }
}

export default new AuthService();
