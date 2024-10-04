import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { Image } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source = {images.logo}
            className="w-[380px] h-[60%]"
            resizeMode="contain"
          />
          <View className="relative">
            <Text className="text-3xl text-white font-bold text-center">
            Making pet care simple and reliable with
              <Text className="text-secondary-200"> PawPal</Text>
              .
            </Text>
          </View>
            <Text className="text-sm font-pregular text-gray-100 mt-10 text-center">
              "Caring for your pet just got easier. Track visits, set reminders, and more."
            </Text>
            <CustomButton
              title="Continue with Email"
              handlePress={()=>router.push('/sign-in')}
              containerStyles="w-full mt-10"
            />
          </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light'/>
    </SafeAreaView>
  );
}
