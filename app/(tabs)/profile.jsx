import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LogoHeader from '../../components/LogoHeader';
import CustomButton from '../../components/CustomButton';
import { API_BASE_URL } from '../../constants/config';

const Profile = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: '', email: '' });
  const [pets, setPets] = useState([]);
  const [events, setEvents] = useState([]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return Alert.alert('Unauthorized', 'You must log in first.');

      // Fetch user info
      const userRes = await axios.get(`${API_BASE_URL}/api/user/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({
        name: userRes.data.first_name + ' ' + userRes.data.last_name,
        email: userRes.data.email
      });

      // Fetch pets
      const petsRes = await axios.get(`${API_BASE_URL}/api/pets/pets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPets(Array.isArray(petsRes.data) ? petsRes.data : []);

      // Fetch events
      const eventsRes = await axios.get(`${API_BASE_URL}/api/pets/events/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
      
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Error', 'Unable to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data every time screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-primary-900 px-4 pt-6" edges={['right', 'left','top']}>
      <LogoHeader showName={true} containerStyle="mx-auto mb-20" />

      {/* User Profile */}
      <View className="items-center mb-6">
        <View className="w-20 h-20 rounded-full border-2 border-accent-ble mb-3 items-center justify-center bg-primary-700">
          <Ionicons name="person-outline" size={40} color="#5EEAD4" />
        </View>

        <View className="flex-row items-center">
          <Text className="text-white text-xl font-psemibold mr-2">{user.name}</Text>
          <TouchableOpacity onPress={() => router.push('/edit-profile')}>
            <Ionicons name="create-outline" size={18} color="#5EEAD4" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400 text-sm mt-1">{user.email}</Text>
      </View>

      {/* Pets Section */}
      <TouchableOpacity onPress={() => toggleSection('pets')} className="bg-primary-800 rounded-xl p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="paw" size={22} color="#5EEAD4" />
            <Text className="text-white font-psemibold ml-3">Pets</Text>
            <View className="ml-2 bg-accent-ble rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-primary-900 text-xs font-psemibold">{pets.length}</Text>
            </View>
          </View>
          <Ionicons name={expandedSection === 'pets' ? 'chevron-up' : 'chevron-down'} size={18} color="#5EEAD4" />
        </View>

        {expandedSection === 'pets' && (
          <View className="mt-3 space-y-3">
            {pets.map(pet => (
              <View key={pet.id} className="flex-row items-center">
                <Image
                  source={{ uri: pet.photo }}
                  className="w-10 h-10 rounded-full mr-3"
                  style={{ borderWidth: 1, borderColor: '#5EEAD4' }}
                />
                <Text className="text-white">
                  <Text className="font-psemibold">{pet.name}</Text>
                  <Text className="text-gray-400 text-s">, {pet.age} year old {pet.breed}</Text>
                </Text>
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
      <TouchableOpacity onPress={() => toggleSection('events')} className="bg-primary-800 rounded-xl p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="medkit-outline" size={22} color="#5EEAD4" />
            <Text className="text-white font-psemibold ml-3">Events</Text>
            <View className="ml-2 bg-accent-ble rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-primary-900 text-xs font-psemibold">{events.length}</Text>
            </View>
          </View>
          <Ionicons name={expandedSection === 'events' ? 'chevron-up' : 'chevron-down'} size={18} color="#5EEAD4" />
        </View>

        {expandedSection === 'events' && (
          <View className="mt-3 space-y-3">
            {events.slice(0, 3).map(event => (
              <View key={event.id} className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#5EEAD4" />
                <View>
                  <Text className="text-white font-pmedium ml-3">{capitalize(event.event_type)} for <Text className="text-accent-ble">{event.pet_name}</Text></Text>
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

      {/* Sign Out Button */}
      <CustomButton
  title="Sign Out"
  handlePress={async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: async () => {
            // Clear the token
            await AsyncStorage.removeItem('accessToken');
            // Navigate to Sign In page
            router.replace('/sign-in'); // replace so user can't go back
          } 
        },
      ]
    );
  }}
  containerStyles="bg-red-600 py-3 mb-8"
  textStyles="text-white font-psemibold"
/>
    </SafeAreaView>
  );
};

export default Profile;
