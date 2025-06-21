import { View, Image } from 'react-native'
import { images } from '../constants'

const LogoHeader = ({ showName = true, containerStyle = '', imageStyle = '' }) => (
  <View className={`flex-row items-center mt-3 ${containerStyle}`}>
    <Image
      source={images.logoSmall}
      resizeMode='contain'
      className={`w-[60px] h-[45px] ${imageStyle}`}
    />
    {showName && (
      <Image
        source={images.logoName}
        resizeMode='contain'
        className='w-[100px] h-[70px]'
      />
    )}
  </View>
)

export default LogoHeader
