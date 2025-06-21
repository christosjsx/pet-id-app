import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { useRouter } from 'expo-router';

import LogoHeader from '../components/LogoHeader';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';
import axios from 'axios';

const AddPet = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    petname: '',
    petbreed: '',
    petage: '',
    petgender: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.petname || !form.petbreed || !form.petage || !form.petgender) {
      Alert.alert('All fields required');
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post('http://192.168.0.101:8000/api/user/register/', form);
      router.replace('home');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className='bg-primary-900 h-full'>
      <ScrollView>
        <View className='w-full min-h-[85vh] px-4 my-6'>
          {/* Header */}
          <LogoHeader showName={true} />
          <Text className="text-2xl text-white font-psemibold mt-3">New Pet Profile</Text>
          <Text className="text-sm text-gray-300 font-pregular mb-2">Please provide your furry friend's details</Text>

          {/* Name Field */}
          <FormField
            title="Name:"
            value={form.petname}
            handleChangeText={(e) => setForm({...form, petname: e})}
            otherStyles="mt-3"
          />

          {/* Breed Field */}
          <FormField
            title="Breed:"
            value={form.petbreed}
            handleChangeText={(e) => setForm({...form, petbreed: e})}
            otherStyles="mt-3"
          />

          {/* Age and Gender Row - CORRECTED */}
          <View className="flex-row mt-3 space-x-3">
            {/* Age Field (exact same as before) */}
            <View className="flex-1">
              <FormField
                title="Age:"
                value={form.petage}
                handleChangeText={(e) => setForm({...form, petage: e})}
                keyboardType="numeric"
              />
            </View>

            {/* Gender Field (maintained original sizing) */}
            <View className="flex-1 space-y-2">
              <Text className="text-base text-gray-100 font-pmedium">Gender:</Text>
              <View className="w-full h-16 bg-primary-800 border-2 border-primary-700 rounded-2xl flex-row">
                {['Male', 'Female'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    className={`flex-1 items-center justify-center ${
                      form.petgender === gender ? 'bg-accent-ble' : ''
                    }`}
                    onPress={() => setForm({...form, petgender: gender})}
                  >
                    <Text className={`text-base ${
                      form.petgender === gender 
                        ? 'text-primary-900 font-psemibold' 
                        : 'text-gray-100 font-pregular'
                    }`}>
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Buttons Section - WITH YOUR REQUESTED STYLING */}
          <View className="mt-8">
            {/* Full-width Save Button */}
            <CustomButton
              title="Save Profile"
              handlePress={submit}
              isLoading={isSubmitting}
            />

            {/* Half-width Reset/Cancel Buttons */}
            <View className="flex-row mt-3 space-x-3">
              <TouchableOpacity
                className="flex-1 h-16 border border-gray-200 rounded-xl justify-center items-center"
                activeOpacity={0.7}
                onPress={() => setForm({
                  petname: '',
                  petbreed: '',
                  petage: '',
                  petgender: ''
                })}
              >
                <Text className="text-gray-200 font-psemibold text-lg">Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 h-16 border border-rose-500 rounded-xl justify-center items-center"
                activeOpacity={0.7}
                onPress={() => router.back()}
              >
                <Text className="text-rose-500 font-psemibold text-lg">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddPet;