// components/PetCard.js
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const PetCard = ({ pet, onEdit }) => {
  return (
    <View className='bg-primary-700 rounded-2xl flex-row items-center justify-between mb-4 px-3 py-4'>
      <View className='flex-row items-center'>
        <Image
          source={{ uri: pet.photo }}
          className='w-[60px] h-[60px] rounded-full mr-4'
        />
        <View>
          <Text className='text-xl font-psemibold text-white'>{pet.name}</Text>
          <Text className='text-sm font-pregular text-gray-300'>
            {pet.breed}, {pet.age} yrs
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => onEdit(pet)}
        className='bg-primary-600 p-2 rounded-lg'
        activeOpacity={0.8}
      >
        <Ionicons name="create-outline" size={22} color="#5EEAD4" />
      </TouchableOpacity>
    </View>
  )
}

export default PetCard
