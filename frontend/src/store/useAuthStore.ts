import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  fullName: string;
  profilePic: string;
  createdAt: string;
}

interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: OnlineUser[];
  socket: Socket | null;

  checkAuth: () => Promise<void>; 
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

interface OnlineUser {
  _id: string;
  fullName: string;
  name: string;
  profilePic?: string;
}

interface SignupData {

}

interface LoginData {
  email: string;
  password: string;
}

interface ProfileData {

}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket:null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('auth/check');

      set({authUser: res.data});
      get().connectSocket();

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
      get().connectSocket();

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

      get().connectSocket();
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
      get().disconnectSocket();

    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile : async (data: ProfileData) => {
    set ({isUpdatingProfile: true});
    try {
      const res = await axiosInstance.put('auth/update-profile', data);
      set ({authUser: res.data});
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.log(`Error updating profile: ${error}`);
      toast.error(error.response.data.message);
    } finally {
      set ({isUpdatingProfile: false});
    }
  },

  connectSocket: () => {
    const { authUser } = get()
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      }
    })
    socket.connect();

    set({ socket: socket });

    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds })
    })
  },

  disconnectSocket: () => {
    if(get().socket?.connected) get().socket?.disconnect();
  },
}));