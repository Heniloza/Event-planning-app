import Toast from "react-native-toast-message";
import { create } from "zustand";
import { axiosInstance } from "../api/api";



export const usePackageStore = create((set) => ({
  packages: [],
  allPackages: [],
  isCreatingPackage: false,
  generatedPackages: [],
  userInputs: {},

  setUserInputs: (inputs) => set({ userInputs: inputs }),

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
      console.log(res.data.data);
      
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
      console.log(
        "Fetched packages:",
        res.data.data.map((p) => p.services_included)
      );
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
      const serviceFilters = {
        Venue: (pkg) =>
          Array.isArray(pkg.services_included) &&
          pkg.services_included.includes("Venue") &&
          (!budgetData.venueBudget ||
            (pkg.price || 0) <= budgetData.venueBudget),

        Decorator: (pkg) =>
          Array.isArray(pkg.services_included) &&
          pkg.services_included.includes("Decorator") &&
          (!budgetData.decorBudget ||
            (pkg.price || 0) <= budgetData.decorBudget),

        Caterer: (pkg) =>
          Array.isArray(pkg.services_included) &&
          pkg.services_included.includes("Caterer") &&
          (!budgetData.catererBudget ||
            (pkg.price || 0) <= budgetData.catererBudget),
      };

      const groups = selectedServices.reduce((acc, service) => {
        acc[service] = state.allPackages.filter(serviceFilters[service]);
        return acc;
      }, {});

      let bundles = [];

      if (selectedServices.length === 1) {
        const service = selectedServices[0];
        bundles = (groups[service] || []).map((pkg) => ({
          id: pkg._id,
          totalPrice: pkg.price || 0,
          services: {
            Venue: service === "Venue" ? pkg : null,
            Decorator: service === "Decorator" ? pkg : null,
            Caterer: service === "Caterer" ? pkg : null,
          },
        }));
      } else {
        function combine(
          services,
          currentBundle = {},
          currentPrice = 0,
          idx = 0
        ) {
          if (idx === services.length) {
            bundles.push({
              id: Object.values(currentBundle)
                .map((s) => s._id)
                .join("-"),
              totalPrice: currentPrice,
              services: {
                Venue: currentBundle.Venue || null,
                Decorator: currentBundle.Decorator || null,
                Caterer: currentBundle.Caterer || null,
              },
            });
            return;
          }

          const service = services[idx];
          (groups[service] || []).forEach((pkg) => {
            combine(
              services,
              { ...currentBundle, [service]: pkg },
              currentPrice + (pkg.price || 0),
              idx + 1
            );
          });
        }

        combine(selectedServices);
      }

      bundles = bundles.sort((a, b) => a.totalPrice - b.totalPrice).slice(0, 4);

      return { generatedPackages: bundles };
    });
  },
}));