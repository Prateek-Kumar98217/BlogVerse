import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const useAppStore = create((set, get) => ({
  token: null,
  blogs: [],
  input: "",
  axios,

  fetchBlogs: async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
      if (data.success) {
        set({ blogs: data.blogs });
      } else {
        toast.error(data.message || "Failed to load blogs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Network error");
    }
  },

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
    }
  },

  setInput: (input) => {
    set({ input });
  },

  initialize: () => {
    const storedToken = localStorage.getItem("authToken");
    console.log("📥 Calling fetchBlogs()...");
    get().fetchBlogs();
    if (storedToken) {
      get().setToken(storedToken);
    }
  },
}));

console.log("Store state sample:", useAppStore.getState());
useAppStore.getState().initialize();

export default useAppStore;