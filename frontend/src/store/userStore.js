import Toast from "react-native-toast-message";
import { create } from "zustand";
import { axiosInstance } from "../api/api.js";

export const useUserStore = create((set) => ({


    sendReport: async ({userId,description}) => {
        try {
            const res = await axiosInstance.post("/user/report",{userId,description});   
            Toast.show({
              type: "success",
              text1: "We’ve received your report. We’ll look into it",
            });
            return res.data;
        } catch (error) {
            console.log(error.response?.data?.message || "Failed to send report");
        }   
    },
}));
