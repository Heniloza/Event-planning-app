import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from "react-native";
import { useVendorAuthStore } from "../../store/vendorAuthStore";
import { axiosInstance } from "../../api/api";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const VendorsInfo = () => {
  const { allVendors, fetchAllVendors } = useVendorAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
   fetchAllVendors();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllVendors();
    setRefreshing(false);
  };

  const handleDeleteVendor = (vendorId) => {
    Alert.alert(
      "Delete Vendor",
      "Are you sure you want to permanently delete this vendor?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axiosInstance.delete(`/vendor/delete/${vendorId}`);
              Toast.show({
                type: "success",
                text1: "Vendor deleted successfully",
              });
              await fetchAllVendors();
            } catch (err) {
              console.error("Error deleting vendor:", err);
              Toast.show({
                type: "error",
                text1: "Failed to delete vendor",
              });
            }
          },
        },
      ]
    );
  };


  const renderVendorCard = ({ item }) => {

    return (
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 14,
          marginHorizontal: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          {item.logo ? (
            <Image
              source={{ uri: item.logo }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                marginRight: 12,
                borderWidth: 2,
                borderColor: "#E5E7EB",
              }}
            />
          ) : (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                marginRight: 12,
                backgroundColor: "#3B82F6",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                {item.business_name?.charAt(0)?.toUpperCase() || "V"}
              </Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 3,
              }}
              numberOfLines={1}
            >
              {item.business_name || "Unnamed Business"}
            </Text>
            <Text
              style={{
                color: "#6B7280",
                fontSize: 13,
              }}
              numberOfLines={1}
            >
              {item.owner_name || "N/A"}
            </Text>
          </View>

        </View>

        <View style={{ marginBottom: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{ color: "#6B7280", fontSize: 13, flex: 1 }}
              numberOfLines={1}
            >
               {item.email || "No email"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text style={{ color: "#6B7280", fontSize: 13, flex: 1 }}>
               {item.phone || "N/A"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text style={{ color: "#6B7280", fontSize: 13, flex: 1 }}>
               {item.category || "N/A"}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{ color: "#6B7280", fontSize: 13, flex: 1 }}
              numberOfLines={1}
            >
               {item.location || "Not specified"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#EF4444",
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => handleDeleteVendor(item._id)}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: 13,
            }}
          >
            Delete Vendor
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View
        style={{
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          paddingBottom: 14,
          paddingTop: 20,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: "#6B7280", fontSize: 13 }}>
          {allVendors.length} {allVendors.length === 1 ? "vendor" : "vendors"}{" "}
          total
        </Text>
      </View>

      {allVendors?.length > 0 ? (
        <FlatList
          data={allVendors}
          keyExtractor={(item) => item._id}
          renderItem={renderVendorCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#9CA3AF", fontSize: 16 }}>
            No vendors found
          </Text>
          <Text style={{ color: "#9CA3AF", fontSize: 13, marginTop: 6 }}>
            Pull down to refresh
          </Text>
        </View>
      )}
    </View>
  );
};

export default VendorsInfo;
