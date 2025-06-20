import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { useState } from 'react'
import { icons } from '../constants'

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View
        className="w-full h-16 px-4 bg-primary-800 
                   border-2 border-primary-700 rounded-2xl
                   items-center flex-row"
      >
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="gray-400"
          onChangeText={handleChangeText}
          secureTextEntry={title==='Password:' && !showPassword}
          autoCapitalize='none'
          {...props}
        />

        {title === 'Password:' && (
          <TouchableOpacity onPress={()=>
            setShowPassword(!showPassword)}>
            <Image source={!showPassword ? icons.eye : icons.eyeHide} className='w-6 h-6'
            resizeMode='contain'/>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
