import { View, Image } from 'react-native';
import { images } from '../constants';

const LogoHeader = ({ containerStyle = '', imageStyle = '' }) => (
  <View className={`items-center mx-5 mb-2 ${containerStyle}`}>
    <Image
      source={images.logoFull}
      resizeMode='contain'
      className={`w-[200px] h-[60px] ${imageStyle}`}
    />
  </View>
);

export default LogoHeader;
