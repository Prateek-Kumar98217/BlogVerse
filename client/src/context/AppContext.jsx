import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  // ✅ Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message || "Failed to load blogs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Network error");
    }
  };

  useEffect(() => {
    fetchBlogs();

    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
    fetchBlogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
