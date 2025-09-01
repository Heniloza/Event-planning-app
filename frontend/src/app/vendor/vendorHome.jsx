import { View, Text } from 'react-native'
import React, { useEffect } from 'react'

export default function vendorHome() {
    const {isAuthenticated,vendor} = useVendorAuthStore()

    useEffect(()=>{
        if(isAuthenticated && vendor.status !== 'approved'){
            navigation.navigate('vendorLogin')
          }
    },[isAuthenticated,vendor])
  return (
    <View>
      <Text>vendorHome</Text>
    </View>
  )
}