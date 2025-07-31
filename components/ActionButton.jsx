// components/ActionButton.js
import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const ActionButton = ({ icon, label, color, onPress, containerStyle }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-primary-800 py-6 rounded-2xl items-center justify-center flex-1 ${containerStyle}`}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={32} color={color} />
      <Text className='text-sm font-psemibold text-white mt-2'>{label}</Text>
    </TouchableOpacity>
  )
}

export default ActionButton