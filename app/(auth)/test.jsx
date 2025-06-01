import { View, Text } from 'react-native';

export default function ColorTest() {
  return (
    <View className="flex-1 p-4">
      <View className="h-20 bg-primary-900 mb-2 justify-center">
        <Text className="text-white text-center">primary-900</Text>
      </View>
      <View className="h-20 bg-primary-800 mb-2 justify-center">
        <Text className="text-white text-center">primary-800</Text>
      </View>
      <View className="h-20 bg-primary-700 mb-2 justify-center">
        <Text className="text-white text-center">primary-700</Text>
      </View>
    </View>
  );
}