import { View, Text, ScrollView, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, Link } from 'expo-router'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { images } from '../../constants'
import LogoHeader from '../../components/LogoHeader'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'

const SignIn = () => {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    const { email, password } = form
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await axios.post(
        'http://192.168.0.101:8000/api/user/token/',
        { username: email, password }
      )
      const { access, refresh } = response.data
      await AsyncStorage.setItem('accessToken', access)
      await AsyncStorage.setItem('refreshToken', refresh)
      router.replace('/home')
    } catch (error) {
      console.error(error.response?.data || error.message)
      Alert.alert('Login Failed', 'Invalid credentials or server error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary-900 h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] px-4 my-6">
          {/* Reusable logo header */}
          <LogoHeader showName={true} />

          {/* Prompt */}
          <Text className="text-2xl text-white font-psemibold mt-5">
            Log in to our services.
          </Text>

          {/* Form Fields */}
          <FormField
            title="Email:"
            value={form.email}
            handleChangeText={e => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password:"
            value={form.password}
            handleChangeText={e => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          {/* Submit Button */}
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-10"
            isLoading={isSubmitting}
          />

          {/* Link to Sign Up */}
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-regular">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="text-lg font-psemibold text-accent-ble">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
