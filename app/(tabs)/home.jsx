import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LogoHeader from '../../components/LogoHeader';
import ActionButton from '../../components/ActionButton';
import PetCard from '../../components/PetCard';
import EventItem from '../../components/EventItem';

const Home = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('User');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await axios.get('http://192.168.0.100:8000/api/user/me/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
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

  const fetchPetData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await axios.get('http://192.168.0.100:8000/api/pets/pets/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      setPets(response.data || []);
    } catch (error) {
      console.error('Error fetching pet data:', error);
      setPets([]); // Fallback to empty array
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUserData(), fetchPetData()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const renderEvents = () => {
    const allEvents = pets.flatMap(pet =>
      pet.reminders?.map(reminder => ({
        petName: pet.name,
        type: reminder.type,
        icon: reminder.icon,
        date: reminder.date
      })) || []
    );
    return allEvents.map((event, idx) => <EventItem key={idx} event={event} />);
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary-900 flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5EEAD4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary-900 flex-1" edges={['right', 'left','top']}>
      <ScrollView>
        <View className="w-full min-h-[85vh] px-1 my-6">
          <LogoHeader showName={true} />
          <Text className="text-2xl text-white mt-3 mb-3 ml-3">
            <Text className="text-white font-psemibold text-2xl mr-1">Welcome, </Text>
            <Text className="font-psemibold text-accent-ble">{firstName}</Text>
          </Text>

{pets.length > 0 && (
  <View className="bg-primary-800 rounded-2xl p-3 m-2">
    {/* Pet Section Header with View All */}
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-xl font-psemibold text-white ml-2">Pets</Text>
      {pets.length > 3 && (
        <TouchableOpacity 
          onPress={() => router.push('/pets')}
          activeOpacity={0.7}
        >
          <Text className="text-accent-ble font-pmedium mr-2">View All</Text>
        </TouchableOpacity>
      )}
    </View>

    {/* Pet Cards - Limited to 3 initially */}
    <View className="space-y-4">
      {pets.slice(0, 2).map(pet => (
        <PetCard
          key={pet.id}
          pet={pet}
          onEdit={() => router.push({
            pathname: '/edit-pet',
            params: { 
              id: pet.id,
              name: pet.name,
              breed: pet.breed,
              age: pet.age,
              gender: pet.gender,
              photo: pet.photo || ''
            }
          })}
        />
      ))}
    </View>

    {/* Events section remains unchanged */}
    <View className="bg-primary-900 rounded-2xl p-5 mt-1">
      <View className="flex-row items-center mb-3 justify-between">
        <Text className="text-lg font-psemibold text-white">Events</Text>
         <TouchableOpacity onPress={() => router.push('/(tabs)/events')} activeOpacity={0.7}>
          <Text className="text-accent-ble font-pmedium">View All</Text>
        </TouchableOpacity>
      </View>
      {renderEvents()}
    </View>
  </View>
)}
          
          <View className="flex-row justify-between rounded-2xl">
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
              action: () => router.push('/add-pet')
            },
            {
              icon: 'calendar-outline',
              label: 'Events',
              color: '#ff6363',
              action: () => router.push('/events')
            }
            ].map((btn, idx) => (
              <ActionButton
                key={idx}
                icon={btn.icon}
                label={btn.label}
                color={btn.color}
                onPress={btn.action}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;