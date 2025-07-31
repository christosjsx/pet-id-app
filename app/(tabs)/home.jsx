import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from '../../constants/config';
import LogoHeader from '../../components/LogoHeader';
import ActionButton from '../../components/ActionButton';
import PetCard from '../../components/PetCard';
import EventItem from '../../components/EventItem';

const Home = () => {
  const router = useRouter();

  // ================================
  // 🔄 State Management
  // ================================
  const [firstName, setFirstName] = useState('User');
  const [pets, setPets] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // 🔐 Fetch User Info
  // ================================
  const fetchUserData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found');

      const response = await axios.get(`${API_BASE_URL}/api/user/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      setFirstName(response.data?.first_name || 'User');
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        router.push('/sign-in');
      }
    }
  };

  // ================================
  // 🐾 Fetch Pets
  // ================================
  const fetchPetData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found');

      const response = await axios.get(`${API_BASE_URL}/api/pets/pets/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      setPets(response.data || []);
    } catch (error) {
      console.error('Error fetching pet data:', error);
      setPets([]);
    }
  };

  // ================================
  // 🗓 Fetch Events
  // ================================
  const fetchEventData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found');

      const response = await axios.get(`${API_BASE_URL}/api/pets/events/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  // ================================
  // 🔁 Fetch All Data on Load
  // ================================
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUserData(), fetchPetData(), fetchEventData()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ================================
  // 🌀 Loading State
  // ================================
  if (loading) {
    return (
      <SafeAreaView className="bg-primary-900 flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5EEAD4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary-900 flex-1" edges={['right', 'left', 'top']}>
      <ScrollView>
        <View className="w-full min-h-[85vh] px-4 my-6">
          
          {/* ============================ */}
          {/* 👋 Welcome Header */}
          {/* ============================ */}
          <LogoHeader showName={true} />
          <Text className="text-2xl text-white mt-3 mb-3">
            <Text className="font-psemibold text-white mr-1">Welcome, </Text>
            <Text className="font-psemibold text-accent-ble">{firstName}</Text>
          </Text>

          {/* ============================ */}
          {/* 🐾 Pets Section */}
          {/* ============================ */}
          <View className="bg-primary-800 rounded-2xl p-5 mb-5">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xl font-psemibold text-white">Pets</Text>
              <TouchableOpacity onPress={() => router.push('/pets')} activeOpacity={0.7}>
                <Text className="text-accent-ble font-pmedium">View All</Text>
              </TouchableOpacity>
            </View>

            {pets.length === 0 ? (
              <Text className="text-gray-400 text-base text-center">You haven't added any pets yet.</Text>
            ) : (
              <View className="space-y-4">
                {pets.slice(0, 2).map(pet => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onEdit={() =>
                      router.push({
                        pathname: '/edit-pet',
                        params: {
                          id: pet.id,
                          name: pet.name,
                          breed: pet.breed,
                          age: pet.age,
                          gender: pet.gender,
                          photo: pet.photo || ''
                        }
                      })
                    }
                  />
                ))}
              </View>
            )}
          </View>

          {/* ============================ */}
          {/* 🗓 Events Section */}
          {/* ============================ */}
          <View className="bg-primary-800 rounded-2xl p-5 mb-5">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-psemibold text-white">Events</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/events')} activeOpacity={0.7}>
                <Text className="text-accent-ble font-pmedium">View All</Text>
              </TouchableOpacity>
            </View>

            {events.length === 0 ? (
              <Text className="text-gray-400 text-base text-center">You haven't added any events yet.</Text>
            ) : (
              <View className="space-y-2">
                {events.slice(0, 4).map((event, idx) => (
                  <EventItem key={idx} event={event} />
                ))}
              </View>
            )}
          </View>

          {/* ============================ */}
          {/* 🔘 Action Buttons */}
          {/* ============================ */}
          <View className="flex-row justify-between">
            {[
              {
                icon: 'person-outline',
                label: 'Profile',
                color: '#63f5ffff',
                action: () => router.push('/profile')
              },
              {
                icon: 'add-circle-outline',
                label: 'Add Pet',
                color: '#7aff88',
                action: () => router.push('/add-pet'),
                style: 'mx-4'
              },
              {
                icon: 'calendar-outline',
                label: 'Add Event',
                color: '#ff6363',
                action: () => router.push('/add-edit-event')
              }
            ].map((btn, idx) => (
              
              <ActionButton
                key={idx}
                icon={btn.icon}
                label={btn.label}
                color={btn.color}
                onPress={btn.action}
                containerStyle={btn.style}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
