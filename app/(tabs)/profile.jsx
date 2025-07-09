import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import LogoHeader from '../../components/LogoHeader';
import CustomButton from '../../components/CustomButton';

const Profile = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [counts] = useState({
    pets: 2,
    events: 5,
    reminders: 3
  });

  // Sample data
  const user = {
    name: 'Evan',
    email: 'evan@pawpal.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    pets: [
      { id: 1, name: 'Freya', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Labrador_Retriever_portrait.jpg/1200px-Labrador_Retriever_portrait.jpg' },
      { id: 2, name: 'Loki', photo: 'https://images.happypet.care/images/20260/white-central-asian-shepherd-portrait.webp' }
    ],
    events: [
      { id: 1, title: 'Vet Visit', date: 'Tomorrow' },
      { id: 2, title: 'Grooming', date: 'Friday' }
    ],
    reminders: [
      { id: 1, title: 'Medication', time: '8:00 AM' },
      { id: 2, title: 'Walk', time: '5:00 PM' }
    ]
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-900 px-4 pt-6"
                    edges={['right', 'left','top']}>
        <LogoHeader showName={true} containerStyle="mx-auto" />

        {/* User Profile */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: user.avatar }}
            className="w-20 h-20 rounded-full border-2 border-accent-ble mb-3"
          />
          <View className="flex-row items-center">
            <Text className="text-white text-xl font-psemibold mr-2">{user.name}</Text>
            <TouchableOpacity onPress={() => router.push('/edit-profile')}>
              <Ionicons name="create-outline" size={18} color="#5EEAD4" />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-400 text-sm mt-1">{user.email}</Text>
        </View>

        {/* Pets Section */}
        <TouchableOpacity 
          onPress={() => toggleSection('pets')}
          className="bg-primary-800 rounded-xl p-4 mb-4"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="paw" size={22} color="#5EEAD4" />
              <Text className="text-white font-psemibold ml-3">Pets</Text>
              <View className="ml-2 bg-accent-ble rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-primary-900 text-xs font-psemibold">{counts.pets}</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedSection === 'pets' ? 'chevron-up' : 'chevron-down'} 
              size={18} 
              color="#5EEAD4" 
            />
          </View>

          {expandedSection === 'pets' && (
            <View className="mt-3 space-y-3">
              {user.pets.map(pet => (
                <View key={pet.id} className="flex-row items-center">
                  <Image
                    source={{ uri: pet.photo }}
                    className="w-10 h-10 rounded-full mr-3"
                    style={{
                      borderWidth: 1,
                      borderColor: '#5EEAD4',
              }
              }
            />
                  <Text className="text-white font-pmedium">{pet.name}</Text>
                </View>
              ))}
              <CustomButton
                title="View All Pets"
                handlePress={() => router.push('/pets')}
                containerStyles="mt-2 bg-primary-700 py-1.5"
                textStyles="text-accent-ble text-sm"
              />
            </View>
          )}
        </TouchableOpacity>

        {/* Events Section */}
        <TouchableOpacity 
          onPress={() => toggleSection('events')}
          className="bg-primary-800 rounded-xl p-4 mb-4"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="medkit-outline" size={22} color="#5EEAD4" />
              <Text className="text-white font-psemibold ml-3">Events</Text>
              <View className="ml-2 bg-accent-ble rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-primary-900 text-xs font-psemibold">{counts.events}</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedSection === 'events' ? 'chevron-up' : 'chevron-down'} 
              size={18} 
              color="#5EEAD4" 
            />
          </View>

          {expandedSection === 'events' && (
            <View className="mt-3 space-y-3">
              {user.events.map(event => (
                <View key={event.id} className="flex-row items-center">
                  <Ionicons name="time-outline" size={16} color="#5EEAD4" className="mr-3" />
                  <View>
                    <Text className="text-white font-pmedium ml-3">{event.title}</Text>
                    <Text className="text-gray-400 text-xs ml-3">{event.date}</Text>
                  </View>
                </View>
              ))}
              <CustomButton
                title="View All Events"
                handlePress={() => router.push('/events')}
                containerStyles="mt-2 bg-primary-700 py-1.5"
                textStyles="text-accent-ble text-sm"
              />
            </View>
          )}
        </TouchableOpacity>

        {/* Reminders Section */}
        <TouchableOpacity 
          onPress={() => toggleSection('reminders')}
          className="bg-primary-800 rounded-xl p-4 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={22} color="#5EEAD4" />
              <Text className="text-white font-psemibold ml-3">Reminders</Text>
              <View className="ml-2 bg-accent-ble rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-primary-900 text-xs font-psemibold">{counts.reminders}</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedSection === 'reminders' ? 'chevron-up' : 'chevron-down'} 
              size={18} 
              color="#5EEAD4" 
            />
          </View>

          {expandedSection === 'reminders' && (
            <View className="mt-3 space-y-3">
              {user.reminders.map(reminder => (
                <View key={reminder.id} className="flex-row items-center">
                  <Ionicons name="notifications-outline" size={16} color="#5EEAD4" className="mr-3" />
                  <View>
                    <Text className="text-white font-pmedium ml-3">{reminder.title}</Text>
                    <Text className="text-gray-400 text-xs ml-3">{reminder.time}</Text>
                  </View>
                </View>
              ))}
              <CustomButton
                title="View All Reminders"
                handlePress={() => router.push('/reminders')}
                containerStyles="mt-2 bg-primary-700 py-1.5"
                textStyles="text-accent-ble text-sm"
              />
            </View>
          )}
        </TouchableOpacity>

        {/* Sign Out Button */}
        <CustomButton
          title="Sign Out"
          handlePress={() => Alert.alert('Sign Out', 'Are you sure?')}
          containerStyles="bg-red-600 py-3 mb-8"
          textStyles="text-white font-psemibold"
        />
    </SafeAreaView>
  );
};

export default Profile;