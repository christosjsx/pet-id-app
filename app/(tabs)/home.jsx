import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { images } from '../../constants'

const Home = () => {
  const [firstName, setFirstName] = useState('User')
  const [pets, setPets] = useState([])

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken')
      setFirstName('Georgios')

      setPets([
        {
          id: 1,
          name: 'Bella',
          age: '2 years old',
          photo: 'https://place-puppy.com/100x100',
          reminders: [
            { type: 'Vaccination', date: 'April 28', icon: 'syringe', color: '#FCD7CC' },
            { type: "Doctor's Visit", date: 'May 3', icon: 'user-md', color: '#D7F5E9' }
          ]
        }
      ])
    } catch (err) {
      console.error(err.message)
      Alert.alert('Error loading data')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const renderReminder = (reminder, index) => (
    <View key={index} className='flex-row justify-between items-center mt-2'>
      <View className='flex-row items-center'>
        <View className='bg-gray-600 rounded-full p-2 mr-3'>
          <FontAwesome5 name={reminder.icon} size={14} color="white" />
        </View>
        <Text className='text-base text-white font-pregular'>{reminder.type}</Text>
      </View>
      <Text className='text-base text-accent font-pmedium'>{reminder.date}</Text>
    </View>
  )

  return (
    <SafeAreaView className='bg-primary-900 h-full'>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        {/* Header Section */}
        <View className='flex-row items-center mb-6'>
          <Image
            source={images.logoSmall}
            resizeMode='contain'
            className='w-[40px] h-[40px]'
          />
          <Text className='text-white text-2xl font-psemibold ml-3'>
            Welcome, {firstName}
          </Text>
        </View>

        {/* Pet Card */}
        {pets.map(pet => (
          <View key={pet.id} className='bg-primary-800 rounded-3xl p-6 mb-6'>
            <View className='flex-row items-center mb-4'>
              <Image
                source={{ uri: pet.photo }}
                className='w-[60px] h-[60px] rounded-full mr-3'
              />
              <View>
                <Text className='text-xl font-psemibold text-white'>{pet.name}</Text>
                <Text className='text-sm font-pregular text-gray-400'>{pet.age}</Text>
              </View>
            </View>

            <Text className='text-base font-psemibold text-white mb-3'>Upcoming Reminders</Text>
            {pet.reminders.map(renderReminder)}
          </View>
        ))}

        {/* Action Buttons */}
        <View className='flex-row justify-between bg-primary-800 p-5 rounded-3xl space-x-3'>
          {[
            { icon: 'add-circle-outline', label: 'Add Pet', color: '#5EEAD4' },
            { icon: 'medkit-outline', label: 'Log Visit', color: '#3B82F6' },
            { icon: 'calendar-outline', label: 'Reminder', color: '#F87171' },
          ].map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => Alert.alert(btn.label)}
              className='flex-1 bg-primary-700 py-5 rounded-xl items-center justify-center'
              activeOpacity={0.8}
            >
              <Ionicons name={btn.icon} size={32} color={btn.color} />
              <Text className='text-sm font-psemibold text-white mt-2'>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home