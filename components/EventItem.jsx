// components/EventItem.js
import { View, Text } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

const EventItem = ({ event }) => {
  return (
    <View className='flex-row items-center mb-3'>
      <View className='bg-primary-700 rounded-full p-2 mr-1'>
        <FontAwesome5 name={event.icon} size={14} color="white" />
      </View>
      <Text className='text-base text-white font-pregular mr-1'>
        {event.petName} has a {event.type.toLowerCase()} on {event.date}.
      </Text>
    </View>
  )
}

export default EventItem