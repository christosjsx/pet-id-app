import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

import LogoHeader from '../components/LogoHeader';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';

const EditProfile = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    surname: '',
    contact: '',
    location: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', 'Access token missing. Please log in again.');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/user/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setForm({
          name: user.first_name || '',
          surname: user.last_name || '',
          contact: user.contact || '',
          location: user.location || '',
          email: user.email || '',
        });
      } catch (error) {
        console.error(error.response?.data || error.message);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async () => {
  if (!form.name || !form.surname || !form.contact || !form.location || !form.email) {
    Alert.alert('Error', 'All fields are required');
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

    await axios.put(
      `${API_BASE_URL}/api/user/me/`, 
      {
        first_name: form.name,
        last_name: form.surname,
        contact: form.contact,
        location: form.location,
        email: form.email,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    Alert.alert('Success', 'Profile updated successfully');
    router.back();
  } catch (error) {
    console.error(error.response?.data || error.message);
    Alert.alert('Update failed', error.response?.data?.message || 'Failed to update profile');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <SafeAreaView className="bg-primary-900 h-full">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="w-full min-h-[85vh] px-4 my-6">
          <LogoHeader showName={true} />

          {/* Title + Back Button */}
          <View className="flex-row justify-between items-center mt-3 mb-1">
            <Text className="text-2xl text-white font-psemibold">Edit Profile</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="flex-row items-center"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back-outline" size={24} color="#5EEAD4" />
              <Text className="text-base text-[#5EEAD4] font-pmedium ml-1">Back</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-gray-300 font-pregular mb-5">
            Update your profile details
          </Text>

          {/* Name / Surname */}
          <View className="flex-row gap-x-5">
            <View className="flex-1">
              <FormField
                title="First name:"
                value={form.name}
                handleChangeText={(text) => setForm({ ...form, name: text })}
              />
            </View>
            <View className="flex-1">
              <FormField
                title="Last name:"
                value={form.surname}
                handleChangeText={(text) => setForm({ ...form, surname: text })}
              />
            </View>
          </View>

          {/* Contact / Location */}
          <View className="flex-row mt-3 gap-x-5">
            <View className="flex-1">
              <FormField
                title="Contact number:"
                value={form.contact}
                handleChangeText={(text) => setForm({ ...form, contact: text })}
                keyboardType="phone-pad"
              />
            </View>
            <View className="flex-1">
              <FormField
                title="Location:"
                value={form.location}
                handleChangeText={(text) => setForm({ ...form, location: text })}
              />
            </View>
          </View>

          {/* Email */}
          <FormField
            title="Email:"
            value={form.email}
            handleChangeText={(text) => setForm({ ...form, email: text })}
            otherStyles="mt-3"
            keyboardType="email-address"
          />

          {/* Submit Button */}
          <View className="mt-10">
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

export default EditProfile;
