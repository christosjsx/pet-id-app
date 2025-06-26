import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'

import LogoHeader from '../../components/LogoHeader';
import ActionButton from '../../components/ActionButton';
import PetCard from '../../components/PetCard';
import EventItem from '../../components/EventItem';

const Home = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('User');
  const [pets, setPets] = useState([]);

  const fetchData = async () => {
    try {
      // Simulate fetching user data
      setFirstName('Evan');
      setPets([
        {
          id: 1,
          name: 'Freya',
          age: '5',
          breed: 'Labrador Retriever',
          gender: 'female',
          weight: '30',
          photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Labrador_Retriever_portrait.jpg/1200px-Labrador_Retriever_portrait.jpg',
          reminders: [{ type: "Doctor's Visit", date: 'May 3', icon: 'user-md' }]
        },
        {
          id: 2,
          name: 'Loki',
          age: '3',
          breed: 'Alabai',
          gender: 'male',
          weight: '30',
          photo: 'https://images.happypet.care/images/20260/white-central-asian-shepherd-portrait.webp',
          reminders: [{ type: 'Vaccination', date: 'April 28', icon: 'syringe' }]
        }
      ]);
    } catch (err) {
      console.error(err.message);
      Alert.alert('Error loading data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderEvents = () => {
    const allEvents = pets.flatMap(pet =>
      pet.reminders.map(reminder => ({
        petName: pet.name,
        type: reminder.type,
        icon: reminder.icon,
        date: reminder.date
      }))
    );
    return allEvents.map((event, idx) => <EventItem key={idx} event={event} />);
  };

  return (
    <SafeAreaView className="bg-primary-900 flex-1"
                  edges={['right', 'left','top']}>
        <ScrollView>
        <View className="w-full min-h-[85vh] px-4 my-6">
          <LogoHeader showName={true} />
          <Text className="text-2xl text-white mt-3 mb-3 ml-1">
            <Text className="font-pregular">Welcome, </Text>
            <Text className="font-psemibold text-accent-ble">{firstName}</Text>
          </Text>
          <View className="flex-row justify-between bg-primary-800 p-5 rounded-3xl space-x-3">
            {[{
              icon: 'add-circle-outline',
              label: 'Add Pet',
              color: '#7aff88',
              action: () => router.push('/add-pet')
            },
            {
              icon: 'medkit-outline',
              label: 'Vet Visits',
              color: '#5EEAD4',
              action: () => Alert.alert('Vet Visits')
            },
            {
              icon: 'calendar-outline',
              label: 'Reminders',
              color: '#ff6363',
              action: () => Alert.alert('Reminders')
            }].map((btn, idx) => (
              <ActionButton
                key={idx}
                icon={btn.icon}
                label={btn.label}
                color={btn.color}
                onPress={btn.action}
              />
            ))}
          </View>

          {pets.length > 0 && (
            <View className="bg-primary-800 rounded-3xl p-5 mt-3">
              {pets.map(pet => (
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
                  {/* Events Card */}
              <View className="bg-primary-900 rounded-3xl p-5">
                <View className="flex-row items-center mb-3">
                  <Text className="text-lg font-psemibold text-white mr-2">Events</Text>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/events')}
                    className="bg-primary-600 p-2 rounded-lg"
                    activeOpacity={0.8}
                  >
                    <Ionicons name="create-outline" size={20} color="#5EEAD4" />
                  </TouchableOpacity>
                </View>

                {renderEvents()}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
