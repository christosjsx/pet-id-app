import React, { useState } from 'react';
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

// Constants
const EVENT_TYPES = ['Vet Visit', 'Grooming', 'Medication'];
const PET_NAMES = ['Freya', 'Loki'];

const AddEditEvent = () => {
  const router = useRouter();
  const { event } = useLocalSearchParams();
  const parsedEvent = event ? JSON.parse(event) : null;

  // State
  const [type, setType] = useState(parsedEvent?.type || EVENT_TYPES[0]);
  const [notes, setNotes] = useState(parsedEvent?.notes || '');
  const [date, setDate] = useState(parsedEvent?.date ? new Date(parsedEvent.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPets, setSelectedPets] = useState(
    parsedEvent?.petName ? [parsedEvent.petName] : []
  );

  // Helpers
  const togglePetSelection = (pet) => {
    setSelectedPets((prev) =>
      prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
    );
  };

  const getIconByType = (eventType) => {
    switch (eventType) {
      case 'Vet Visit':
        return 'medkit-outline';
      case 'Medication':
        return 'bandage-outline';
      case 'Grooming':
        return 'cut-outline';
      default:
        return 'calendar-outline';
    }
  };

  // Save logic
  const handleSave = () => {
    if (selectedPets.length === 0 || !type || !date) {
      Alert.alert('Missing Info', 'Please select at least one pet, an event type, and a date.');
      return;
    }

    const baseEvent = {
      type,
      notes,
      date: date.toISOString().split('T')[0],
      icon: getIconByType(type),
      photo: parsedEvent?.photo || '',
    };

    const newEvents = selectedPets.map((pet) => ({
      ...baseEvent,
      id: parsedEvent?.id || Date.now() + Math.random(),
      petName: pet,
    }));

    console.log('SAVED EVENTS:', newEvents);

    // TODO: Save `newEvents` to global state or pass them back
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-900 px-4 pt-4">
      <LogoHeader showName={true} containerStyle="mx-auto" />

      {/* Header with Title left and Back button right */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-white text-2xl font-psemibold">
          {parsedEvent ? 'Edit Event' : 'Add Event'}
        </Text>

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
            {PET_NAMES.map((pet) => (
              <TouchableOpacity
                key={pet}
                onPress={() => togglePetSelection(pet)}
                className={`px-3 py-2 rounded-xl border-2 ${
                  selectedPets.includes(pet) ? 'border-accent-ble' : 'border-gray-700'
                }`}
              >
                <Text
                  className={`${
                    selectedPets.includes(pet)
                      ? 'text-white font-psemibold'
                      : 'text-gray-400 font-pregular'
                  }`}
                >
                  {pet}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Type Picker */}
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

          {/* Date Picker */}
          <Text className="text-white font-pmedium mb-2">Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="bg-primary-800 p-3 rounded-xl mb-4"
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

          {/* Notes */}
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
            <Text className="text-primary-900 font-psemibold text-lg">
              {parsedEvent ? 'Update Event' : 'Add Event'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddEditEvent;
