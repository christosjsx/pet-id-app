import { View, Text, ScrollView, Image } from 'react-native'

import { useState } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'

import { Link } from 'expo-router'

import FormField from '../../components/FormField'

import CustomButton from '../../components/CustomButton'

import axios from 'axios' //lib to make the HTTP requests backend

import AsyncStorage from '@react-native-async-storage/async-storage'//store data on the user's device

import { Alert } from 'react-native' // native alert popups

import { useRouter } from 'expo-router' // hook from expo to navigate between screens




const SignIn = () => {

  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  
const [isSubmitting, setIsSubmitting] = useState(false)

//on submit, form validation to ensure email and password are not empty

  const submit= async () => {
    if (!form.email || !form.password){
      Alert.alert('Invalid email or password.') // native pop up in case fields are empty
      return
    }

    try {
      setIsSubmitting(true) // loading state set to true. use for spinner on submit button
      
      // POST request to Django. await pauses until a response is sent from server side

      const response = await axios.post('',{
        username: form.email,
        password: form.password
      })

      // Extract tokens from response. If login successful, Django returns a JSON object with the following tokens

      const { access, refresh } = response.data 

      //Stores tokens on device

      await AsyncStorage.setItem('accessToken', access) // short lived token for authenticated requests
      await AsyncStorage.setItem('refreshToken', refresh) // get a new access token in case it expires

      router.replace('') //page after authentication
      
      // error handling from axios call

    } catch (error) {
      console.error(error.response?.data || error.message)
      Alert.alert('Login failed.', 'Invalid credentials or server error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
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
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Log in to our services.</Text>

          <FormField
          title='Email:'
          value={form.email}
          handleChangeText={(e)=> setForm({...form,email: e})}
          otherStyles='mt-7'
          keyboardType='email-address'
          />

          <FormField
          title='Password:'
          value={form.password}
          handleChangeText={(e)=> setForm({...form,password: e})}
          otherStyles='mt-7'
          />

          <CustomButton
            title='Sign In'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}/>

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-regular'>
              Don't have an account?
            </Text>
            <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn