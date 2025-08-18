import {
  View,
  Text,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/config';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


import LogoHeader from '../../components/LogoHeader';
import CustomButton from '../../components/CustomButton';

const EVENT_TYPES = ['All', 'Vet Visit', 'Grooming', 'Medication'];

// 🔧 Helpers
const toTitleCase = str =>
  str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');


const getIconName = (eventType) => {
  switch (eventType.toLowerCase()) {
    case 'vet visit':
      return 'medkit-outline';
    case 'grooming':
      return 'cut-outline';
    case 'medication':
      return 'bandage-outline';
    default:
      return 'calendar-outline';
  }
};

const formatDateTime = (dateStr, timeStr) => {
  const date = new Date(`${dateStr}T${timeStr}`);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
  hours = hours % 12 || 12;
  return `${month} ${day} · ${hours}:${minutes} ${ampm}`;
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [ascending, setAscending] = useState(true);
  const [menuVisibleId, setMenuVisibleId] = useState(null);

useFocusEffect(
  useCallback(() => {
    const fetchEvents = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/pets/events/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const formatted = response.data.map(event => ({
          id: event.id,
          petName: event.pet_name,
          type: toTitleCase(event.event_type),
          icon: getIconName(event.event_type),
          date: formatDateTime(event.date, event.time),
          rawDate: event.date,
          rawTime: event.time,
          notes: event.notes,
          photo: event.pet_photo,
        }));

        setEvents(formatted);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        Alert.alert('Error', 'Could not load events from the server.');
      }
    };

    fetchEvents();
  }, [])
);

  const filteredEvents = events.filter(event =>
    filter === 'All' ? true : event.type.toLowerCase() === filter.toLowerCase()
  );

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (ascending) return new Date(a.rawDate) - new Date(b.rawDate);
    else return new Date(b.rawDate) - new Date(a.rawDate);
  });

  const handleDelete = id => {
  Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        try {
          const accessToken = await AsyncStorage.getItem('accessToken');
          await axios.delete(`${API_BASE_URL}/api/pets/events/${id}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setEvents(prev => prev.filter(e => e.id !== id));
        } catch (error) {
          console.error('Failed to delete event:', error);
          Alert.alert('Error', 'Could not delete the event. Please try again.');
        }
      },
    },
  ]);
};


  const handleAdd = () => {
    router.push('/add-event');
  };

  const handleEdit = (event) => {
    console.log(event)
    router.push({
      pathname: '/edit-event',
      params: { event: JSON.stringify(event) },
    });
  };

  const renderEventItem = ({ item }) => {
    const isMenuOpen = menuVisibleId === item.id;

    return (
      <TouchableWithoutFeedback onPress={() => setMenuVisibleId(null)}>
        <View className="relative">
          <View className="bg-primary-800 rounded-2xl mb-4 p-4 shadow-md flex-row items-center">
            {/* Pet Image */}
            <Image
              source={{ uri: item.photo }}
              className="w-16 h-16 rounded-full mr-3"
              style={{ borderWidth: 1, borderColor: '#5EEAD4' }}
            />

            {/* Info */}
            <View className="flex-1 pr-2">
              <View className="flex-row items-center mb-1">
                <View className="bg-primary-900 rounded-full p-1 mr-2">
                  <Ionicons name={item.icon} size={14} color="#5EEAD4" />
                </View>
                <Text className="text-white font-psemibold">{item.type}</Text>
              </View>

              {item.notes ? (
                <Text className="text-gray-200 text-sm mb-1">{item.notes}</Text>
              ) : null}

              <Text className="text-gray-400 text-xs mt-1">{item.date}</Text>
            </View>

            {/* Menu */}
            <View className="justify-center items-center w-[40px]">
              {isMenuOpen ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      handleEdit(item);
                      setMenuVisibleId(null);
                    }}
                    className="mb-3"
                  >
                    <Ionicons name="create-outline" size={24} color="#90EE90" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleDelete(item.id);
                      setMenuVisibleId(null);
                    }}
                  >
                    <Ionicons name="trash-outline" size={24} color="#f87171" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => setMenuVisibleId(item.id)}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#5EEAD4" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibleId(null)}>
      <SafeAreaView className="flex-1 bg-primary-900 px-4 pt-6" edges={['right', 'left', 'top']}>
        <LogoHeader showName={true} containerStyle="mx-auto" />

        <View className="flex-row items-center mt-3 mb-3 ml-1">
          <Text className="text-white font-psemibold text-2xl mr-1">Events</Text>
          <Ionicons
            name={ascending ? 'arrow-up-outline' : 'arrow-down-outline'}
            size={20}
            color="#5EEAD4"
            onPress={() => setAscending(!ascending)}
          />
        </View>

        <CustomButton
          title="Add Event"
          handlePress={handleAdd}
          containerStyles="mb-4"
          textStyles="text-center"
        />

        {/* Filters */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          {EVENT_TYPES.map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilter(type)}
              className={`rounded-2xl px-3 py-2 border-2 ${
                filter === type ? 'border-accent-ble' : 'border-transparent'
              }`}
            >
              <Text
                className={`${
                  filter === type ? 'font-psemibold text-white' : 'font-pregular text-gray-400'
                }`}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <FlatList
          data={sortedEvents}
          keyExtractor={item => item.id.toString()}
          renderItem={renderEventItem}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Events;
