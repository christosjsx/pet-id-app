import { View, Text, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

import LogoHeader from '../components/LogoHeader';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';

const EditPet = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [form, setForm] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    photo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      setForm({
        name: params.name || '',
        breed: params.breed || '',
        age: params.age || '',
        gender: params.gender || '',
        photo: params.photo || '',
      });
    }
  }, [params.id]);

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
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
  if (!form.name || !form.breed || !form.age || !form.gender) {
    Alert.alert('Error', 'All fields except photo are required');
    return;
  }

  try {
    setIsSubmitting(true);

    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      Alert.alert('Error', 'Access token missing. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('breed', form.breed);
    formData.append('age', form.age);
    formData.append('gender', form.gender);

    // If photo is a local file URI, append it as a file
    if (form.photo && form.photo.startsWith('file://')) {
      // Extract file extension for type
      const uriParts = form.photo.split('.');
      const fileExtension = uriParts[uriParts.length - 1].toLowerCase();

      // Map common extensions to mime types, default to jpeg
      const mimeTypes = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
      };
      const mimeType = mimeTypes[fileExtension] || 'image/jpeg';

      formData.append('photo', {
        uri: form.photo,
        name: `photo.${fileExtension}`,
        type: mimeType,
      });
    }

    await axios.put(
      `${API_BASE_URL}/api/pets/pets/${params.id}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    router.replace('/home');
  } catch (error) {
    console.error('Update error:', error);
    Alert.alert('Error', error.response?.data?.message || 'Failed to update pet');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleDelete = () => {
    Alert.alert(
      'Delete Pet',
      'Are you sure you want to delete this pet profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSubmitting(true);

              const token = await AsyncStorage.getItem('accessToken');
              if (!token) {
                Alert.alert('Error', 'Access token missing. Please log in again.');
                return;
              }

              await axios.delete(`${API_BASE_URL}/api/pets/pets/${params.id}/`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              router.replace('/home');
            } catch (error) {
              console.error('Delete error:', error.response?.data || error.message);
              Alert.alert('Error', 'Failed to delete pet');
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="bg-primary-900 h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] px-4 my-6">
          <LogoHeader showName={true} />

          {/* Title + Icons */}
          <View className="flex-row justify-between items-center mt-3 mb-1">
            <Text className="text-2xl text-white font-psemibold">Edit Pet Details</Text>

            <View className="flex-row space-x-4">
              {/* Delete icon */}
              <TouchableOpacity
                onPress={handleDelete}
                activeOpacity={0.7}
                accessibilityLabel="Delete pet"
              >
                <Ionicons name="trash-outline" size={24} color="#FCA5A5" />
              </TouchableOpacity>

              {/* Back icon */}
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
                accessibilityLabel="Go back"
              >
                <Ionicons name="arrow-back-outline" size={24} color="#5EEAD4" />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-sm text-gray-300 font-pregular mb-2">
            Update your furry friend's details
          </Text>

          {/* Profile Picture + Name Field */}
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
                  const isSelected = form.gender?.toLowerCase() === gender.toLowerCase();
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

          {/* Submit Button */}
          <View className="mt-20">
            <CustomButton
              title="Save Changes"
              handlePress={handleSubmit}
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditPet;
