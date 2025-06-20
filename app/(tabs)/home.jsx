import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { images } from '../../constants'
import { StatusBar } from 'expo-status-bar'

const Home = () => {
  const [firstName, setFirstName] = useState('User')
  const [pets, setPets] = useState([])

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken')
      setFirstName('Evan')

      setPets([
        {
          id: 1,
          name: 'Freya',
          age: '3',
          breed: 'Greek Shepherd',
          gender: 'female',
          weight: '30',
          photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Labrador_Retriever_portrait.jpg/1200px-Labrador_Retriever_portrait.jpg',
          reminders: [
            { type: "Doctor's Visit", date: 'May 3', icon: 'user-md' }
          ]
        },
        {
          id: 2,
          name: 'Loki',
          age: '3',
          breed: 'Alabai',
          gender: 'male',
          weight: '30',
          photo: 'https://images.happypet.care/images/20260/white-central-asian-shepherd-portrait.webp',
          reminders: [
            { type: 'Vaccination', date: 'April 28', icon: 'syringe' }
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

  const renderEvents = () => {
    const allEvents = pets.flatMap(pet =>
      pet.reminders.map(reminder => ({
        petName: pet.name,
        type: reminder.type,
        icon: reminder.icon,
        date: reminder.date
      }))
    )

    return allEvents.map((event, index) => (
      <View key={index} className='flex-row items-center mb-3'>
        <View className='bg-gray-600 rounded-full p-2 mr-3'>
          <FontAwesome5 name={event.icon} size={14} color="white" />
        </View>
        <Text className='text-base text-white font-pregular'>
          {event.petName} has a {event.type.toLowerCase()} on {event.date}.
        </Text>
      </View>
    ))
  }

  return (
    <SafeAreaView className='bg-primary-900 h-full'>
      <StatusBar style="light" />
      <ScrollView>
        <View className='w-full min-h-[85vh] px-4 my-6'>

          {/* Header */}
          <View className='flex-row items-center mt-3'>
            <Image source={images.logoSmall} resizeMode='contain' className='w-[60px] h-[45px]' />
            <Image source={images.logoName} resizeMode='contain' className='w-[100px] h-[70px]' />
          </View>
          <Text className='text-2xl text-white mt-3 mb-3 ml-1'>
            <Text className='font-pregular'>Welcome, </Text>
            <Text className='font-psemibold text-accent-ble'>{firstName}</Text>
          </Text>

          {/* Action Buttons */}
          <View className='flex-row justify-between bg-primary-800 p-5 rounded-3xl space-x-3'>
            {[
              { icon: 'add-circle-outline', label: 'Add Pet', color: '#7aff88' },
              { icon: 'medkit-outline', label: 'Vet Visits', color: '#5EEAD4' },
              { icon: 'calendar-outline', label: 'Reminders', color: '#ff6363' },
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

          {/* Pets and Events */}
          {pets.length > 0 && (
            <View className='bg-primary-800 rounded-3xl p-5 mt-6'>

              {/* Pet Cards */}
              {pets.map((pet) => (
                <View
                  key={pet.id}
                  className='bg-primary-700 rounded-2xl flex-row items-center justify-between mb-4 px-3 py-4'
                >
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
                    onPress={() => Alert.alert('Edit Pet Info', `Editing ${pet.name}`)}
                    className='bg-primary-600 p-2 rounded-lg'
                    activeOpacity={0.8}
                  >
                    <Ionicons name="create-outline" size={22} color="#5EEAD4" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Events List */}
              <View className='mt-2'>
                <Text className='text-lg font-psemibold text-white mb-3'>Events</Text>
                {renderEvents()}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
