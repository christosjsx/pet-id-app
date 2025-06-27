import { View, Text, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import LogoHeader from '../components/LogoHeader';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';

const EditPet = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [form, setForm] = useState({
    petname: '',
    petbreed: '',
    petage: '',
    petgender: '',
    photo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      setForm({
        petname: params.name || '',
        petbreed: params.breed || '',
        petage: params.age || '',
        petgender: params.gender || '',
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
    if (!form.petname || !form.petbreed || !form.petage || !form.petgender) {
      Alert.alert('Error', 'All fields except photo are required');
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.put(`http://192.168.0.101:8000/api/pets/${params.id}/`, form);
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
              await axios.delete(`http://192.168.0.101:8000/api/pets/${params.id}/`);
              router.replace('/home');
            } catch (error) {
              console.error('Delete error:', error);
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
                value={form.petname}
                handleChangeText={(text) => setForm({ ...form, petname: text })}
              />
            </View>
          </View>

          {/* Breed Field */}
          <FormField
            title="Breed:"
            value={form.petbreed}
            handleChangeText={(text) => setForm({ ...form, petbreed: text })}
            otherStyles="mt-7"
          />

          {/* Age and Gender */}
          <View className="flex-row mt-7 space-x-3">
            <View className="flex-1">
              <FormField
                title="Age:"
                value={form.petage}
                handleChangeText={(text) => setForm({ ...form, petage: text })}
                keyboardType="numeric"
              />
            </View>

            <View className="flex-1 space-y-2">
              <Text className="text-base text-gray-100 font-pmedium">Gender:</Text>
              <View className="w-full h-16 bg-primary-800 border-2 border-primary-700 rounded-2xl flex-row">
                {['Male', 'Female'].map((gender) => {
                  const isSelected = form.petgender?.toLowerCase() === gender.toLowerCase();
                  return (
                    <TouchableOpacity
                      key={gender}
                      className={`flex-1 items-center justify-center rounded-xl ${
                        isSelected ? 'bg-accent-ble' : ''
                      }`}
                      onPress={() => setForm({ ...form, petgender: gender })}
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
