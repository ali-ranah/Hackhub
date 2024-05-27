import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Image, ToastAndroid, StyleSheet,TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from '../../../State/Reducers/tokenSlice';
import { selectSelectedRole } from '../../../State/Reducers/roleSlice';
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
  if(!formData.image_url){
return;
  }
  try {
    console.log('Image Url',formData.image_url)
    const response = await AxiosRequest.put('/api/users/profile', formData, {
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      setTimeout(() => {
       navigation.navigate('Profile');
      }, 1000);
    } else {
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

    }
  } catch (error) {
    console.error('Error:', error);
    ToastAndroid.show('An error occurred. Please try again later.', ToastAndroid.SHORT);
  }
}; 


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <Button title="Select Image" onPress={pickFromCamera} />
      {formData.image_url ? (
        <Image source={{ uri: formData.image_url }} style={styles.image} />
      ) : null}
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
      <View>
          <TextInput
    value={formatDate(formData.dob)}
    editable={false}
    style={styles.input1}
    />
  <View className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">

<TouchableOpacity onPress={() => setShowDatePicker(true)} className='p-3'>
  <MaterialIcons name="calendar-today"  color="black"  />
 
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
      <Button title="Save" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#14082c',
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
});

export default UpdateProfile;
