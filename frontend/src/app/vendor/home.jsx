import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useVendorAuthStore } from '../../store/vendorAuthStore.js'
import UpcomingBookings from '../../components/UpcomingBookings.jsx'

export default function vendorHome() {



    const {isAuthenticated,vendor} = useVendorAuthStore()

    useEffect(()=>{
        if(isAuthenticated && vendor.status !== 'approved'){
            navigation.navigate('vendorLogin')
          }
    },[isAuthenticated,vendor])
  return (
    <View>
      <UpcomingBookings />  
      <Text>vendorHome</Text>
    </View>
  )
}