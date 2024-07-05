import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Image, ToastAndroid, StyleSheet,TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from '../../../State/Reducers/tokenSlice';
import { selectSelectedRole } from '../../../State/Reducers/roleSlice';
import Slider from '@react-native-community/slider'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';



const UpdateProfile = () => {
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [formData, setFormData] = useState({
    image_url: '',
    country: '',
    mobile: '',
    region: '',
    C_skill: 0,
    Cpp_skill: 0,
    JAVA_skill: 0,
    PYTHON_skill: 0,
    dob: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const storedToken = AsyncStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
      }
    })();
  }, []);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSliderChange = (language, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [language]: value,
    }));
  };

const pickFromCamera = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  console.log("ImagePicker result:", result);

  if (!result.canceled) {
    setLoading(true);
    let newFile = 
    {
      uri:result.assets[0].uri,
      type:`image/${result.assets[0].uri.split(".")[1]}`,
      name:`image.${result.assets[0].uri.split(".")[1]}`,
    };
console.log("New File",newFile);
    handleImageUpload(newFile);

  };
  }

  const handleImageUpload= async (image)=>{
    const data = new FormData(); 
    data.append('file',image); 
    data.append('upload_preset','ml_default'); 
    data.append('cloud_name','dnircbhck'); 
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dnircbhck/image/upload', {
        method: 'POST',
        body: data,
      });
      const imageData = await response.json();
      const secureUrl = imageData.secure_url; // Access the secure_url property
      console.log("Secure Url",secureUrl);
      setFormData({
        ...formData,
        image_url: secureUrl,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoading(false);
    }
   }

  const formatDate = (date) => {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.dob;
    setFormData(prevState => ({ ...prevState,dob: currentDate}));
  };
      

const handleSubmit = async (e) => {
  e.preventDefault();
  const fullnameRegex = /^[a-zA-Z ]*$/;
  const mobileRegex = /^[0-9]+$/;
  if (formData.mobile && !mobileRegex.test(formData.mobile)) {
    ToastAndroid.show('Mobile should only contain numbers', ToastAndroid.SHORT);
    return;
  }
  
  if (formData.country && !fullnameRegex.test(formData.country)) {
    ToastAndroid.show('Country should only contain alphabets', ToastAndroid.SHORT);
    return;
  }

  if (formData.region && !fullnameRegex.test(formData.region)) {
    ToastAndroid.show('Region should only contain alphabets', ToastAndroid.SHORT);
    return;
  }
  try {
  console.log('Form Data', formData);
    console.log('Image Url',formData.image_url)
    if(loading) {
      ToastAndroid.show('Please Wait For Image to Upload.', ToastAndroid.SHORT);
      return;
    }
    const filteredFormData = {
      ...formData,
      C_skill: formData.C_skill > 0 ? formData.C_skill : undefined,
      Cpp_skill: formData.Cpp_skill > 0 ? formData.Cpp_skill : undefined,
      JAVA_skill: formData.JAVA_skill > 0 ? formData.JAVA_skill : undefined,
      PYTHON_skill: formData.PYTHON_skill > 0 ? formData.PYTHON_skill : undefined,
    };

    // Remove undefined properties
    Object.keys(filteredFormData).forEach(key => {
      if (filteredFormData[key] === undefined) {
        delete filteredFormData[key];
      }
    });
    console.log('Filtered Form Data', filteredFormData);

    const response = await AxiosRequest.put('/api/users/profile', filteredFormData, {
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    });

    if (response && response.status === 200) {
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      setTimeout(() => {
       navigation.navigate('Home');
      }, 1000);
    } else {
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

    }
  } catch (error) {
    if (error.response.status === 400 && error.response.data.message === 'No valid fields to update'){
      ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
     }
     else{
     console.error('Error:', error);
     ToastAndroid.show('An error occurred. Please try again later.', ToastAndroid.SHORT);
    }
  }
}; 


  return (
    <View className="h-full flex items-center justify-center bg-[#14082c] py-6 px-4 ">
      <View className="flex flex-col mb-[3vh] w-full items-center justify-center">
      <Text className="mt-6 text-center text-2xl mb-[2vh] font-bold text-white">Update Profile</Text>
      <TouchableOpacity style={styles.button} onPress={pickFromCamera} >
<Text className='text-white font-bold'>Select Image</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Country"
        value={formData.country}
        onChangeText={(text) => handleChange('country', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Mobile"
        value={formData.mobile}
        onChangeText={(text) => handleChange('mobile', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Region"
        value={formData.region}
        onChangeText={(text) => handleChange('region', text)}
        style={styles.input}
      />
                <Text variant="h6" className="font-bold text-white">Language Skills</Text>
                {['C_skill', 'Cpp_skill', 'JAVA_skill', 'PYTHON_skill'].map((language) => (
            <View key={language} className="mt-2 w-full">
              <Text className="text-white">{language.replace('_skill', '')}</Text>
                    <Slider
                value={formData[language]}
                onValueChange={(value) => handleSliderChange(language, value)}
                step={1}
                minimumValue={0}
                maximumValue={10}
              />
              </View>
                ))}
            <View className="mt-2 w-full">
          <TextInput
    value={formatDate(formData.dob)}
    editable={false}
    style={styles.input1}
    />
  <View className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 cursor-pointer">

<TouchableOpacity onPress={() => setShowDatePicker(true)} className='p-3'>
  <MaterialIcons name="calendar-today"  color="black" size={20} />
 
</TouchableOpacity>
            </View>
{showDatePicker && (
  <DateTimePicker
    value={formData.dob}
    onChange={(event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        onChange(null, selectedDate);
      }
    }}
    mode="date"
    display="default"
  />
)}
</View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text className='text-white font-bold'>Save</Text>
        </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection:'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#14082c',
    gap:4
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  input1: {
    width: "140%",
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 4,
    width:'25%',
    height:'8%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent:'center',
    marginVertical: 10,
  }
});

export default UpdateProfile;
