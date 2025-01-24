import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';

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
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

interface SignupData {

}

interface LoginData {
  email: string;
  password: string;
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
    set({isSigningUp: true});
    try {
      const res = await axiosInstance.post('auth/signup', data);
      set({ authUser: res.data });
      toast.success("Account created successfully");

    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({isSigningUp: false});
    }
  },

  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('auth/login', data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({isLoggingIn: false});
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('auth/logout');
      set({authUser: null});
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }
}));