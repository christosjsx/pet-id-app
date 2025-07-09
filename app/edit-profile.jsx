import { View, Text, ScrollView, Image, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useRouter, useLocalSearchParams } from 'expo-router'

import LogoHeader from '../components/LogoHeader'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'

import axios from 'axios'

const EditProfile = () => {
  const router = useRouter()
  const { user } = useLocalSearchParams()

  // Initialize form with user data
  const [form, setForm] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    contact: user?.contact || '',
    area: user?.area || '',
    email: user?.email || '',
    password: '' // Password field left empty for security
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    // Frontend field validation (excluding password since it's optional for edits)
    if (!form.name || !form.surname || !form.contact || !form.area || !form.email) {
      Alert.alert('All fields except password are required.')
      return
    }

    // Only validate password if it's being changed
    if (form.password && form.password.length < 6) {
      Alert.alert('Password must be at least 6 characters if provided.')
      return
    }

    try {
      setIsSubmitting(true)

      // Send PUT/PATCH request to update profile
      const response = await axios.patch('http://192.168.0.100:8000/api/user/profile/', {
        'email': form.email,
        'first_name': form.name,
        'last_name': form.surname,
        'contact': form.contact,
        'area_code': form.area,
        ...(form.password && { 'password': form.password }) // Only include password if changed
      })

      Alert.alert('Success', 'Profile updated successfully')
      router.back() // Return to profile page

    } catch (error) {
      console.error(error.response?.data || error.message)
      Alert.alert('Update failed.', error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
     <SafeAreaView className='bg-primary-900 h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
          {/* Logo */}
         <LogoHeader showName={true} />

          <Text className="text-2xl text-white text-semibold mt-5 font-psemibold">
            Edit Your Profile
          </Text>

          {/* Name / Surname */}
          <View className="flex-row mt-7 gap-x-5">
            <View className="flex-1">
              <FormField
                title="First name:"
                value={form.name}
                handleChangeText={(e) => setForm({ ...form, name: e })}
              />
            </View>
            <View className="flex-1">
              <FormField
                title="Last name:"
                value={form.surname}
                handleChangeText={(e) => setForm({ ...form, surname: e })}
              />
            </View>
          </View>

          {/* Contact / Area */}
          <View className="flex-row mt-3 gap-x-5">
            <View className="flex-1">
              <FormField
                title='Contact number:'
                value={form.contact}
                handleChangeText={(e)=> setForm({...form, contact: e})}
                keyboardType="phone-pad"
              />
            </View>
            <View className="flex-1">
              <FormField
                title='Area code:'
                value={form.area}
                handleChangeText={(e)=> setForm({...form, area: e})}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Email */}
          <FormField
            title='Email:'
            value={form.email}
            handleChangeText={(e)=> setForm({...form, email: e})}
            otherStyles='mt-3'
            keyboardType='email-address'
          />

          {/* Password (optional for changes) */}
          <FormField
            title='New Password (leave blank to keep current):'
            value={form.password}
            handleChangeText={(e)=> setForm({...form, password: e})}
            otherStyles='mt-3'
            secureTextEntry
          />

          {/* Update Button */}
          <CustomButton
            title='Save Changes'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />

          {/* Cancel Button */}
          <CustomButton
            title='Cancel'
            handlePress={() => router.back()}
            containerStyles='mt-4 bg-transparent border border-accent-ble'
            textStyles='text-accent-ble'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile