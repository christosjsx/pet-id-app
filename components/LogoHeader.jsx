import { View, Image } from 'react-native';
import { images } from '../constants';

const LogoHeader = ({ containerStyle = '', imageStyle = '' }) => (
  <View className={`items-center m-5 ${containerStyle}`}>
    <Image
      source={images.logoFull}
      resizeMode='contain'
      className={`w-[200px] h-[60px] ${imageStyle}`}
    />
  </View>
);

export default LogoHeader;
