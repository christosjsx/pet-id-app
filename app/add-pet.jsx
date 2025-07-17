import { View, Text, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

import LogoHeader from '../components/LogoHeader';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';

const AddPet = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    photo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets.length > 0) {
        setForm({ ...form, photo: result.assets[0].uri });
      }
    } catch (error) {
      console.log('Image picking error:', error);
      Alert.alert('Error picking image');
    }
  };

 const submit = async () => {
  if (!form.name || !form.breed || !form.age || !form.gender) {
    Alert.alert('All fields except photo are required');
    return;
  }

  try {
    setIsSubmitting(true);

    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const data = new FormData();
    data.append('name', form.name);
    data.append('breed', form.breed);
    data.append('age', form.age);
    data.append('gender', form.gender);

    // Only append photo if it exists
    if (form.photo) {
      const fileName = form.photo.split('/').pop();
      const fileType = fileName.split('.').pop();

      data.append('photo', {
        uri: form.photo,
        name: fileName,
        type: `image/${fileType}`,
      });
    }

    await axios.post(`${API_BASE_URL}/api/pets/pets/`, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    router.replace('home');
  } catch (error) {
    console.error('Submission error:', error.response?.data || error.message);
    Alert.alert('Error', error.response?.data?.message || 'Submission failed');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <SafeAreaView className="bg-primary-900 h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] px-4 my-6">
          <LogoHeader showName={true} />

          {/* Title and top-right icons */}
          <View className="flex-row items-center justify-between mt-3 mb-1">
            <Text className="text-2xl text-white font-psemibold">New Pet Profile</Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={() =>
                  setForm({
                    name: '',
                    breed: '',
                    age: '',
                    gender: '',
                    photo: '',
                  })
                }
                accessibilityLabel="Reset form"
              >
                <Ionicons name="refresh-outline" size={24} color="#90EE90" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Cancel and go back">
                <Ionicons name="arrow-back-outline" size={24} color="#5EEAD4" />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-sm text-gray-300 font-pregular mb-2">
            Please provide your furry friend's details
          </Text>

          {/* Profile Picture + Name in same row */}
          <View className="flex-row items-start mt-5">
            <View className="w-20">
              <Text className="text-base text-gray-100 font-psemibold mb-2">Picture:</Text>
              <TouchableOpacity
                onPress={pickImage}
                className="w-16 h-16 rounded-2xl bg-primary-800 border-2 border-primary-700 justify-center items-center"
              >
                {form.photo ? (
                  <Image
                    source={{ uri: form.photo }}
                    className="w-full h-full rounded-xl"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="camera-outline" size={20} color="#ccc" />
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-1">
              <FormField
                title="Name:"
                value={form.name}
                handleChangeText={(text) => setForm({ ...form, name: text })}
              />
            </View>
          </View>

          {/* Breed Field */}
          <FormField
            title="Breed:"
            value={form.breed}
            handleChangeText={(text) => setForm({ ...form, breed: text })}
            otherStyles="mt-7"
          />

          {/* Age and Gender */}
          <View className="flex-row mt-7 space-x-3">
            <View className="flex-1">
              <FormField
                title="Age:"
                value={form.age}
                handleChangeText={(text) => setForm({ ...form, age: text })}
                keyboardType="numeric"
              />
            </View>

            <View className="flex-1 space-y-2">
              <Text className="text-base text-gray-100 font-pmedium">Gender:</Text>
              <View className="w-full h-16 bg-primary-800 border-2 border-primary-700 rounded-2xl flex-row">
                {['Male', 'Female'].map((gender) => {
                  const isSelected = form.gender === gender;
                  return (
                    <TouchableOpacity
                      key={gender}
                      className={`flex-1 items-center justify-center rounded-xl ${
                        isSelected ? 'bg-accent-ble' : ''
                      }`}
                      onPress={() => setForm({ ...form, gender: gender })}
                    >
                      <Text
                        className={`text-base ${
                          isSelected
                            ? 'text-primary-900 font-psemibold'
                            : 'text-gray-100 font-pregular'
                        }`}
                      >
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Save Button */}
          <View className="mt-20">
            <CustomButton title="Save Profile" handlePress={submit} isLoading={isSubmitting} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddPet;
