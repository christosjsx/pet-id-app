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

import LogoHeader from '../../components/LogoHeader';
import CustomButton from '../../components/CustomButton';

const samplePets = [
  {
    id: 1,
    name: 'Freya',
    age: '5',
    breed: 'Labrador Retriever',
    gender: 'female',
    weight: '30',
    photo:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Labrador_Retriever_portrait.jpg/1200px-Labrador_Retriever_portrait.jpg',
  },
  {
    id: 2,
    name: 'Loki',
    age: '3',
    breed: 'Alabai',
    gender: 'male',
    weight: '30',
    photo:
      'https://images.happypet.care/images/20260/white-central-asian-shepherd-portrait.webp',
  },
];

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [menuVisibleId, setMenuVisibleId] = useState(null);

  useEffect(() => {
    setPets(samplePets); // Replace with real API call if needed
  }, []);

  const handleDelete = (id) => {
    Alert.alert('Delete Pet', 'Are you sure you want to delete this pet?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setPets((prev) => prev.filter((p) => p.id !== id)),
      },
    ]);
  };

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

  const renderPetItem = ({ item }) => {
    const isMenuOpen = menuVisibleId === item.id;

    return (
      <TouchableWithoutFeedback onPress={() => setMenuVisibleId(null)}>
        <View className="relative">
          <View className="bg-primary-800 rounded-2xl mb-4 p-4 shadow-md flex-row items-center">
            {/* Pet Image */}
            <Image
              source={{ uri: item.photo }}
              className="w-20 h-20 rounded-full mr-5"
              style={{
                borderWidth: 1,
                borderColor: '#5EEAD4', // Accent blue hex from your Ionicons color
              }}
            />

            {/* Pet Info */}
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

            <View className="flex-row">
              <Text className="text-gray-300 font-psemibold text-sm">Weight: </Text>
              <Text className="text-gray-300 text-sm flex-shrink">{item.weight} kg</Text>
            </View>
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        className="flex-1 bg-primary-900 px-4 pt-6"
        edges={['top', 'left', 'right']}
      >
        {/* Logo */}
        <LogoHeader showName={true} containerStyle="mx-auto" />

        {/* Header */}
        <View className="flex-row items-center mt-3 mb-3 ml-1 justify-between">
          <Text className="text-white font-psemibold text-2xl">Your Friends</Text>
        </View>

         <CustomButton
          title="Add Pet"
          handlePress={handleAdd}
          containerStyles="mb-4"
          textStyles="text-center"
        />

        {/* Pet List */}
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPetItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Pets;
