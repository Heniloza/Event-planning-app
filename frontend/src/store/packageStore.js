import Toast from "react-native-toast-message";
import { create } from "zustand";
import { axiosInstance } from "../api/api";



export const usePackageStore = create((set) => ({
  packages: [],
  allPackages: [],
  isCreatingPackage: false,
  generatedPackages: [],

  createPackage: async (packageData) => {
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
      });
    } catch (error) {
      console.log("error in creating package", error);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Failed to create package",
      });
    } finally {
      set({ isCreatingPackage: false });
    }
  },

  fetchPackage: async (vendorId) => {
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
      });
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
  },

  filterPackages: (selectedServices) => {
    set((state) => {
      const filtered = state.allPackages.filter((pkg) => {
        const services = Array.isArray(pkg.services_included)
          ? pkg.services_included.map((s) => (s ? s.toLowerCase() : ""))
          : [];

        return (
          services.length > 0 &&
          selectedServices.every((service) =>
            services.includes(service.toLowerCase())
          )
        );
      });

      console.log("All package data:", state.allPackages);
      console.log("Filtered Packages:", filtered);

      return { generatedPackages: filtered };
    });
  },

  generateBundles: (selectedServices, budgetData) => {
    set((state) => {
      const venues = state.allPackages.filter(
        (pkg) =>
          Array.isArray(pkg.services_included) &&
          pkg.services_included.map((s) => s.toLowerCase()).includes("venue") &&
          (!budgetData.venueBudget || pkg.price <= budgetData.venueBudget)
      );

      const decors = state.allPackages.filter(
        (pkg) =>
          Array.isArray(pkg.services_included) &&
          pkg.services_included
            .map((s) => s.toLowerCase())
            .includes("decorator") &&
          (!budgetData.decorBudget || pkg.price <= budgetData.decorBudget)
      );

      const caterers = state.allPackages.filter(
        (pkg) =>
          Array.isArray(pkg.services_included) &&
          pkg.services_included
            .map((s) => s.toLowerCase())
            .includes("caterer") &&
          (!budgetData.catererBudget || pkg.price <= budgetData.catererBudget)
      );

      let bundles = [];

      venues.forEach((v) => {
        decors.forEach((d) => {
          caterers.forEach((c) => {
            bundles.push({
              id: `${v._id}-${d._id}-${c._id}`,
              totalPrice: v.price + d.price + c.price,
              services: { venue: v, decor: d, caterer: c },
            });
          });
        });
      });

      bundles = bundles.sort((a, b) => a.totalPrice - b.totalPrice).slice(0, 4);

      console.log("Bundles data", bundles);
      return { generatedPackages: bundles };
    });
  },
  
}));