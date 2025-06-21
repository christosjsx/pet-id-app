import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const AddPet = () => {
  return (
    <SafeAreaView className="bg-primary-900 flex-1">
      <View className="p-4">
        <Text className="text-2xl text-white font-psemibold mb-6">Add New Pet</Text>
        
        <Text className="text-white mb-4">This is a temporary screen to test navigation</Text>
        
        <TouchableOpacity
          className="bg-accent-ble px-4 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-primary-900 font-psemibold text-center">Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddPet;