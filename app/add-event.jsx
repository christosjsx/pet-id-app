import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView, Alert,} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import LogoHeader from '../components/LogoHeader';

import { API_BASE_URL } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
const EVENT_TYPES = ['Vet Visit', 'Grooming', 'Medication'];

const AddEvent = () => {
  const router = useRouter();

  // State for form
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedPets, setSelectedPets] = useState([]);

  // State for pets fetched from API
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);

  // Fetch user's pets from API on mount
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken'); // Adjust key if different
        const response = await fetch(`${API_BASE_URL}/api/pets/pets`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch pets');
        const data = await response.json();
        setPets(data); // Assuming data is array of pet objects with `id` and `name`
      } catch (error) {
        console.error('Error loading pets:', error);
        setPets([]); // fallback to empty array
      } finally {
        setLoadingPets(false);
      }
    };

    fetchPets();
  }, []);

  // Toggle pet selection (by pet id)
  const togglePetSelection = (petId) => {
    setSelectedPets((prev) =>
      prev.includes(petId) ? prev.filter((p) => p !== petId) : [...prev, petId]
    );
  };

  // Format date to YYYY-MM-DD for API
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Format time to HH:mm:ss for API
  const formatTimeForAPI = (date) => {
    return date.toTimeString().split(' ')[0];
  };

  // Format time for display in UI
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Save handler with API request
  const handleSave = async () => {
    if (selectedPets.length === 0 || !type || !date) {
      Alert.alert('Missing Info', 'Please select at least one pet, an event type, and a date.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Unauthorized', 'You need to be logged in to save an event.');
        return;
      }

      for (const petId of selectedPets) {
        const payload = {
          pet: petId,
          event_type: type.toLowerCase(), // lowercase per API
          notes,
          date: formatDate(date),
          time: formatTimeForAPI(date),
          is_completed: false,
        };

        const response = await fetch(`${API_BASE_URL}/api/pets/events/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to save event: ${errorText}`);
        }
      }

      Alert.alert('Success', 'Event(s) saved successfully!');
      router.back();

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'There was a problem saving your event. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-900 px-4 pt-4">
      <LogoHeader showName={true} containerStyle="mx-auto" />

      {/* Header with Title left and Back button right */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-white text-2xl font-psemibold">Add Event</Text>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/events')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="p-2"
        >
          <Ionicons name="arrow-back" size={28} color="#5EEAD4" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Pet Selection */}
          <Text className="text-white font-pmedium mb-2">Assign to Pet(s)</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {loadingPets ? (
              <Text className="text-gray-400">Loading pets...</Text>
            ) : pets.length === 0 ? (
              <Text className="text-gray-400">No pets found.</Text>
            ) : (
              pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  onPress={() => togglePetSelection(pet.id)}
                  className={`px-3 py-2 rounded-xl border-2 ${
                    selectedPets.includes(pet.id) ? 'border-accent-ble' : 'border-gray-700'
                  }`}
                >
                  <Text
                    className={`${
                      selectedPets.includes(pet.id)
                        ? 'text-white font-psemibold'
                        : 'text-gray-400 font-pregular'
                    }`}
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Event Type Picker */}
          <Text className="text-white font-pmedium mb-2">Event Type</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {EVENT_TYPES.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setType(item)}
                className={`px-3 py-2 rounded-xl border-2 ${
                  type === item ? 'border-accent-ble' : 'border-gray-700'
                }`}
              >
                <Text
                  className={`${
                    type === item ? 'text-white font-psemibold' : 'text-gray-400 font-pregular'
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date and Time Pickers */}
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-white font-pmedium mb-2">Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-primary-800 p-3 rounded-xl"
              >
                <Text className="text-white">{date.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === 'android') setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}
            </View>

            <View className="flex-1 ml-2">
              <Text className="text-white font-pmedium mb-2">Time</Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="bg-primary-800 p-3 rounded-xl"
              >
                <Text className="text-white">{formatTime(date)}</Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    if (Platform.OS === 'android') setShowTimePicker(false);
                    if (selectedTime) setDate(selectedTime);
                  }}
                />
              )}
            </View>
          </View>

          {/* Notes input */}
          <Text className="text-white font-pmedium mb-2">Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="e.g., Rabies vaccination and general check-up"
            placeholderTextColor="#aaa"
            className="bg-primary-800 text-white p-3 rounded-xl h-32 text-base mb-8"
            textAlignVertical="top"
          />

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className="bg-accent-ble rounded-xl min-h-[62px] justify-center items-center"
          >
            <Text className="text-primary-900 font-psemibold text-lg">Add Event</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddEvent;
