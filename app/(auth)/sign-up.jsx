import { View, Text, ScrollView, Image, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import { Link, useRouter } from 'expo-router'

import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'

import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SignUp = () => {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    surname: '',
    contact: '',
    area: '',
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    // Frontend field validation
    if (!form.name || !form.surname || !form.contact || !form.area || !form.email || !form.password) {
      Alert.alert('All fields required to register.')
      return
    }

    if (form.password.length < 4) {
      Alert.alert('Password must be at least 6 characters.')
      return
    }

    try {
      setIsSubmitting(true)

      // Send POST request to Django backend
      const response = await axios.post('http://192.168.0.101:8000/api/user/register/', {
        'email': form.email,
        'username': form.email,
        'password': form.password,
        'first_name': form.name,
        'last_name': form.surname,
        'contact': form.contact,
        'area': form.area
      })

      // Extract tokens from Django response
      const { access, refresh } = response.data

      // Store tokens on the device
      await AsyncStorage.setItem('accessToken', access)
      await AsyncStorage.setItem('refreshToken', refresh)

      // Navigate to home screen
      router.replace('home')

    } catch (error) {
      console.error(error.response?.data || error.message)
      Alert.alert('Sign up failed.', 'Invalid credentials or server error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
          {/* Logo */}
          <View className="flex-row items-center">
            <Image 
              source={images.logoSmall}
              resizeMode='contain' 
              className='w-[60px] h-[45px]'
            />
            <Image 
              source={images.logoName}
              resizeMode='contain' 
              className='w-[100px] h-[70px]'
            />
          </View>

          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sign up to our services.
          </Text>

          {/* Name / Surname */}
          <View className="flex-row mt-10 gap-x-5">
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

          {/* Password */}
          <FormField
            title='Password:'
            value={form.password}
            handleChangeText={(e)=> setForm({...form, password: e})}
            otherStyles='mt-3'
          />

          {/* Submit Button */}
          <CustomButton
            title='Register'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />

          {/* Link to Sign In */}
          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-regular'>
              Have an account already?
            </Text>
            <Link href="/sign-in" className='text-lg font-psemibold text-secondary'>Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
