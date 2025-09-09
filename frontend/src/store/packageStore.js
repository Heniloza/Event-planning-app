import Toast from "react-native-toast-message";
import { create } from "zustand";
import { axiosInstance } from "../api/api";



export const usePackageStore = create((set) => ({
    packages: [],
    allPackages:[],
    isCreatingPackage: false,

    createPackage:async (packageData) => {
        set({ isCreatingPackage: true });
        try {
            const res = await axiosInstance.post(
              "/vendor/package/create",
              packageData
            );

            set((state) => ({
              packages: [...state.packages, res.data.data],
            }));
            Toast.show({
                type: "success",
                text1: "Package created successfully",
            })
        } catch (error) {
            console.log("error in creating package", error);
            Toast.show({
                type: "error",
                text1: error.response?.data?.message || "Failed to create package",
            })
        }finally{
            set({ isCreatingPackage: false });
        }
    },

    fetchPackage:async (vendorId) => {
        try {
             const res = await axiosInstance.get(
               `/vendor/package/get?vendorId=${vendorId}`
             );
         set({ packages: res.data.data });
        } catch (error) {
            console.log("error in fetching packages", error);
            Toast.show({
                type: "error",
                text1: error.response?.data?.message || "Failed to fetch packages",
            })
        }
    },

    fetchAllPackages: async () => {
        try {
            const res = await axiosInstance.get("/vendor/package/getAll");
            set({ allPackages: res.data.data });
            console.log("fetched all packages successfully");
        } catch (error) {
            console.log("error in fetching all packages", error);
        }
    }
}));