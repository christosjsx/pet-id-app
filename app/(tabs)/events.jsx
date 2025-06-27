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

import LogoHeader from '../../components/LogoHeader';
import CustomButton from '../../components/CustomButton';

const EVENT_TYPES = ['All', 'Vet Visit', 'Grooming', 'Medication'];

const sampleEvents = [
  {
    id: 1,
    petName: 'Freya',
    type: 'Vet Visit',
    icon: 'medkit-outline',
    date: '2025-07-01',
    notes: 'General check-up and rabies vaccination.',
    photo:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Labrador_Retriever_portrait.jpg/1200px-Labrador_Retriever_portrait.jpg',
  },
  {
    id: 2,
    petName: 'Loki',
    type: 'Medication',
    icon: 'bandage-outline',
    date: '2025-06-28',
    notes: 'Heartworm preventative administered.',
    photo:
      'https://images.happypet.care/images/20260/white-central-asian-shepherd-portrait.webp',
  },
  {
    id: 3,
    petName: 'Freya',
    type: 'Grooming',
    icon: 'cut-outline',
    date: '2025-06-15',
    notes: 'Full grooming with nail trimming and ear cleaning.',
    photo:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Labrador_Retriever_portrait.jpg/1200px-Labrador_Retriever_portrait.jpg',
  },
  {
    id: 4,
    petName: 'Freya',
    type: 'Grooming',
    icon: 'cut-outline',
    date: '2025-06-15',
    notes: 'Full grooming with nail trimming and ear cleaning.',
    photo:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Labrador_Retriever_portrait.jpg/1200px-Labrador_Retriever_portrait.jpg',
  },
];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [ascending, setAscending] = useState(true);
  const [menuVisibleId, setMenuVisibleId] = useState(null);

  useEffect(() => {
    setEvents(sampleEvents);
  }, []);

  const filteredEvents = events.filter(event =>
    filter === 'All' ? true : event.type === filter
  );

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (ascending) return new Date(a.date) - new Date(b.date);
    else return new Date(b.date) - new Date(a.date);
  });

  const handleDelete = id => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setEvents(prev => prev.filter(e => e.id !== id)),
      },
    ]);
  };

  const handleAdd = () => {
    router.push('/add-edit-event'); // Push to your add/edit event screen
  };

  const handleEdit = (event) => {
    router.push({
      pathname: '/add-edit-event',
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
              style={{
                borderWidth: 1,
                borderColor: '#5EEAD4',
              }
              }
            />

            {/* Event Info + Notes */}
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

            {/* Action Menu */}
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
      <SafeAreaView className="flex-1 bg-primary-900 px-4 pt-6"
                    edges={['right', 'left','top']}>
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

        {/* Event List */}
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
