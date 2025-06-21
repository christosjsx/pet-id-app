// components/ActionButton.js
import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const ActionButton = ({ icon, label, color, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className='flex-1 bg-primary-700 py-5 rounded-xl items-center justify-center mr-1'
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={32} color={color} />
      <Text className='text-sm font-psemibold text-white mt-2'>{label}</Text>
    </TouchableOpacity>
  )
}

export default ActionButton