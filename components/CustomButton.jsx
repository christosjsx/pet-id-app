import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title,handlePress,containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        className={`bg-accent-ble rounded-xl min-h-[62px] justify-center items-center
         ${containerStyles} ${isLoading ? 'opacity-50':''}`}
         disabled={isLoading}
         >
        <Text className={`text-primary-900 font-psemibold text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton