import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

interface ChatStore {
  messages: any[];
  users: any[];
  selectedUser: any | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;


  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (selectedUser: User | null) => void;
  sendMessage: (messageData: MessageData) => Promise<void>;
}

interface User {
  _id: string;
  name: string;
  profilePic?: string; 
}

interface MessageData {
  
}


export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,


  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data as User[] });
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages : res.data})
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: MessageData) => {
    const { selectedUser, messages } = get()
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] })
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
}))