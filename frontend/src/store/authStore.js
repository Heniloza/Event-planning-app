import {create} from "zustand"


export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoggedIn: false,

  isLoading: false,
  isLoggingIn: false,
  isSigningIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,

  setUser: (user) => set({ user }),
  setIsLoggedIn: (state) => set({ isLoggedIn: state }),
  setIsAuthenticated: (state) => set({ isAuthenticated: state }),

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({
        user: res.data.user,
        isLoggedIn: true,
      });

      Toast.show({
        type: "success",
        text1: "Login Successful",
      });
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(error.response?.data?.message || "Login failed");
      set({ isLoggedIn: false, isAuthenticated: false });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({
        user: res.data.user,
        isLoggedIn: true,
        isAuthenticated: true,
      });

      toast.show({
        type: "success",
        text1: "Signup successfully",
      });
    } catch (error) {
      console.error("Signup error:", error.message);
      toast.show({
        type: "error",
        text1: error.response?.data?.message || "Signup failed",
      });
      set({ isLoggedIn: false, isAuthenticated: false });
    } finally {
      set({ isSigningIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      set({
        user: null,
        isAuthenticated: false,
        isLoggedIn: false,
      });

      toast.show({type:"success",text1:"Logged out successfully!"});
    } catch (error) {
      console.error("Logout error:", error.message);
      toast.show({type:"error",text1:"Failed to logout"});
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check-auth");

      set({
        user: res.data.user, 
        isAuthenticated: true,
        isLoggedIn: true,
      });
    } catch (error) {
      console.error("Auth check error:", error.message);
      set({ user: null, isAuthenticated: false, isLoggedIn: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));