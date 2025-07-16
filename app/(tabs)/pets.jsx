import {
  View,
  Text,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import LogoHeader from '../../components/LogoHeader';
import CustomButton from '../../components/CustomButton';

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Session Expired', 'Please log in again.');
          router.push('/sign-in');
          return;
        }

        const response = await axios.get('http://192.168.0.100:8000/api/pets/pets/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPets(response.data || []);
      } catch (err) {
        console.error('Error fetching pets:', err);
        Alert.alert('Error', 'Failed to load pets. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleEdit = (pet) => {
    router.push({
      pathname: '/edit-pet',
      params: {
        id: pet.id.toString(),
        name: pet.name,
        age: pet.age,
        breed: pet.breed,
        gender: pet.gender,
        photo: pet.photo,
      },
    });
  };

  const handleAdd = () => {
    router.push('/add-pet');
  };

  const renderPetItem = ({ item }) => (
    <TouchableWithoutFeedback>
      <View className="relative">
        <View className="bg-primary-800 rounded-2xl mb-4 p-4 shadow-md flex-row items-center">
          <Image
            source={{ uri: item.photo }}
            className="w-20 h-20 rounded-full mr-5"
            style={{
              borderWidth: 1,
              borderColor: '#5EEAD4',
            }}
          />

          <View className="flex-1 pr-2">
            <Text className="text-white font-psemibold text-lg">{item.name}</Text>

            <View className="flex-row">
              <Text className="text-gray-300 font-psemibold text-sm">Breed: </Text>
              <Text className="text-gray-300 text-sm italic flex-shrink">{item.breed}</Text>
            </View>

            <View className="flex-row">
              <Text className="text-gray-300 font-psemibold text-sm">Age: </Text>
              <Text className="text-gray-300 text-sm flex-shrink">{item.age} years</Text>
            </View>

            <View className="flex-row">
              <Text className="text-gray-300 font-psemibold text-sm">Gender: </Text>
              <Text className="text-gray-300 text-sm flex-shrink">
                {item.gender.charAt(0).toUpperCase() + item.gender.slice(1)}
              </Text>
            </View>
          </View>

          {/* Edit Icon Only */}
          <View className="justify-center items-center w-[40px]">
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Ionicons name="create-outline" size={24} color="#5EEAD4" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        className="flex-1 bg-primary-900 px-4 pt-6"
        edges={['top', 'left', 'right']}
      >
        <LogoHeader showName={true} containerStyle="mx-auto" />

        <View className="flex-row items-center mt-3 mb-3 ml-1 justify-between">
          <Text className="text-white font-psemibold text-2xl">Your Friends</Text>
        </View>

        <CustomButton
          title="Add Pet"
          handlePress={handleAdd}
          containerStyles="mb-4"
          textStyles="text-center"
        />

        {loading ? (
          <Text className="text-white text-center mt-10">Loading pets...</Text>
        ) : pets.length === 0 ? (
          <Text className="text-gray-400 font-pregular text-center mt-10">
            No pets found. Tap "Add Pet" to get started!
          </Text>
        ) : (
          <FlatList
            data={pets}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPetItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Pets;
