import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LogoHeader from '../components/LogoHeader';
import { API_BASE_URL } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EVENT_TYPES = ['Vet Visit', 'Grooming', 'Medication'];

const EditEvent = () => {
  const router = useRouter();
  const { event } = useLocalSearchParams(); // event is stringified

  // Parse once per event change
  const parsedEvent = useMemo(() => {
    try {
      return event ? JSON.parse(event) : null;
    } catch {
      return null;
    }
  }, [event]);

  // Form state
  const [type, setType] = useState(EVENT_TYPES[0]);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedPets, setSelectedPets] = useState([]);

  // Pets
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);

  // Formatters
  const formatDate = (d) => d.toISOString().split('T')[0];
  const formatTimeForAPI = (d) => d.toTimeString().split(' ')[0];
  const formatTime = (d) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Load pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/api/pets/pets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch pets');
        const data = await response.json();
        setPets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading pets:', error);
        setPets([]);
      } finally {
        setLoadingPets(false);
      }
    };
    fetchPets();
  }, []);

  // Pre-fill form with event details (excluding pet selection)
useEffect(() => {
  if (!parsedEvent) return;

  setType(parsedEvent.type || EVENT_TYPES[0]);
  setNotes(parsedEvent.notes || '');

  // Case 1: datetime is already provided (rare)
  if (parsedEvent.datetime) {
    const dt = new Date(parsedEvent.datetime);
    if (!isNaN(dt.getTime())) setDate(dt);
    return;
  }

  // Case 2: use rawDate + rawTime (preferred)
  if (parsedEvent.rawDate) {
    const timePart = parsedEvent.rawTime || "00:00:00"; // fallback midnight
    const combined = `${parsedEvent.rawDate}T${timePart}`;
    const dt = new Date(combined);

    if (!isNaN(dt.getTime())) {
      setDate(dt);
      return;
    }
  }
}, [parsedEvent]);

  // Select the pet based on event.petName once pets are loaded
  const didInitSelection = useRef(false);
  useEffect(() => {
    if (didInitSelection.current) return; // run once
    if (loadingPets) return;
    if (!parsedEvent) {
      if (pets.length > 0) setSelectedPets([String(pets[0].id)]);
      didInitSelection.current = true;
      return;
    }

    const eventPetName = parsedEvent.petName?.toLowerCase?.();
    const match = pets.find(
      (p) => eventPetName && p.name.toLowerCase() === eventPetName
    );

    if (match) {
      setSelectedPets([String(match.id)]);
    } else if (pets.length > 0) {
      setSelectedPets([String(pets[0].id)]);
    }
    didInitSelection.current = true;
  }, [parsedEvent, loadingPets, pets]);

  // Toggle pet selection (multi-select preserved)
  const togglePetSelection = (petId) => {
    const idStr = String(petId);
    setSelectedPets((prev) =>
      prev.includes(idStr) ? prev.filter((p) => p !== idStr) : [...prev, idStr]
    );
  };

  // Update event
  const handleUpdate = async () => {
    if (selectedPets.length === 0 || !type || !date) {
      Alert.alert(
        'Missing Info',
        'Please select at least one pet, an event type, and a date.'
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Unauthorized', 'You need to be logged in to update an event.');
        return;
      }

      const payload = {
        pet: selectedPets[0], // using first selected pet for API
        event_type: String(type || '').toLowerCase(),
        notes,
        date: formatDate(date),
        time: formatTimeForAPI(date),
      };

      const response = await fetch(
        `${API_BASE_URL}/api/pets/events/${parsedEvent?.id}/`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update event: ${errorText}`);
      }

      Alert.alert('Success', 'Event updated successfully!');
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'There was a problem updating your event. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-900 px-4 pt-4">
      <LogoHeader showName={true} containerStyle="mx-auto" />

      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-white text-2xl font-psemibold">Edit Event</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
              pets.map((pet) => {
                const idStr = String(pet.id);
                const isSelected = selectedPets.includes(idStr);
                return (
                  <TouchableOpacity
                    key={pet.id}
                    onPress={() => togglePetSelection(pet.id)}
                    className={`px-3 py-2 rounded-xl border-2 ${
                      isSelected ? 'border-accent-ble' : 'border-gray-700'
                    }`}
                  >
                    <Text
                      className={`${
                        isSelected
                          ? 'text-white font-psemibold'
                          : 'text-gray-400 font-pregular'
                      }`}
                    >
                      {pet.name}
                    </Text>
                  </TouchableOpacity>
                );
              })
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
                    type === item
                      ? 'text-white font-psemibold'
                      : 'text-gray-400 font-pregular'
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date & Time */}
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
                    if (selectedDate) {
                      setDate(
                        new Date(
                          selectedDate.getFullYear(),
                          selectedDate.getMonth(),
                          selectedDate.getDate(),
                          date.getHours(),
                          date.getMinutes()
                        )
                      );
                    }
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
                    if (selectedTime) {
                      setDate(
                        new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate(),
                          selectedTime.getHours(),
                          selectedTime.getMinutes()
                        )
                      );
                    }
                  }}
                />
              )}
            </View>
          </View>

          {/* Notes */}
          <Text className="text-white font-pmedium mb-2">Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="e.g., Updated notes for vet visit"
            placeholderTextColor="#aaa"
            className="bg-primary-800 text-white p-3 rounded-xl h-32 text-base mb-8"
            textAlignVertical="top"
          />

          {/* Update Button */}
          <TouchableOpacity
            onPress={handleUpdate}
            className="bg-accent-ble rounded-xl min-h-[62px] justify-center items-center"
          >
            <Text className="text-primary-900 font-psemibold text-lg">
              Update Event
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditEvent;
