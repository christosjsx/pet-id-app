import { View, Text, ScrollView, Image } from 'react-native'

import { useState } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'

import { Link } from 'expo-router'

import FormField from '../../components/FormField'

import CustomButton from '../../components/CustomButton'



const SignUp = () => {

  const [form, setForm] = useState({
    name: '',
    surname: '',
    contact: '',
    area: '',
    email: '',
    password: ''
  })
  
const [isSubmitting, setIsSubmitting] = useState(false)

  const submit=() => {

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
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Sign up to our services.</Text>
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

          <View className="flex-row mt-3 gap-x-5">
            <View className="flex-1">
              <FormField
          title='Contact number:'
          value={form.contact}
          handleChangeText={(e)=> setForm({...form,contact: e})}
          keyboardType="phone-pad"
          />
            </View>
            <View className="flex-1">
              <FormField
                title='Area code:'
                value={form.area}
                handleChangeText={(e)=> setForm({...form,area: e})}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <FormField
          title='Email:'
          value={form.email}
          handleChangeText={(e)=> setForm({...form,email: e})}
          otherStyles='mt-3'
          keyboardType='email-address'
          />

          <FormField
          title='Password:'
          value={form.password}
          handleChangeText={(e)=> setForm({...form,password: e})}
          otherStyles='mt-3'
          />

          <CustomButton
            title='Register'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}/>

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