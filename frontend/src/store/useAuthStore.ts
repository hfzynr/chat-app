import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;

  checkAuth: () => Promise<void>; 
  signup: (data: SignupData) => Promise<void>;
}

interface SignupData {

}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('auth/check');

      set({authUser: res.data});
    } catch (error) {
      set({authUser: null});
      console.log(`Error checking auth: ${error}`);
    } finally {
      set({isCheckingAuth: false});
    }
  },

  signup: async (data: SignupData) => {

  }
}));