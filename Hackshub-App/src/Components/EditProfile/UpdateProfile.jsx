import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Image, ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo
import { AxiosRequest } from '../Axios/AxiosRequest'; // Assuming AxiosRequest is correctly configured
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectToken } from '../../../State/Reducers/tokenSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateProfile = () => {
  const storedToken = AsyncStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    image_url: '',
    country: '',
    mobile: '',
    region: '',
    dob: '',
  });
  const [loading, setLoading] = useState(false);

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

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      const data = new FormData();
      data.append('file', {
        uri: result.uri,
        name: `profile-picture-${Date.now()}`,
        type: 'image/jpeg',
      });
      data.append('upload_preset', 'ml_default');
      data.append('cloud_name', 'dnircbhck');
      try {
        const response = await AxiosRequest.post('https://api.cloudinary.com/v1_1/dnircbhck/image/upload', data);
        const imageData = response.data;
        const secureUrl = imageData.secure_url;
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
  };

  const handleSubmit = () => {
    AxiosRequest.put('/api/users/profile', formData, {
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        setTimeout(() => {
          navigation.navigate('Profile')
        }, 1000);
      } else {
        alert(response.data.message);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Update Profile</Text>
      <Button title="Select Image" onPress={handleImageUpload} />
      {formData.image_url ? <Image source={{ uri: formData.image_url }} style={{ width: 200, height: 200 }} /> : null}
      <TextInput
        placeholder="Country"
        value={formData.country}
        onChangeText={(text) => handleChange('country', text)}
      />
      <TextInput
        placeholder="Mobile"
        value={formData.mobile}
        onChangeText={(text) => handleChange('mobile', text)}
      />
      <TextInput
        placeholder="Region"
        value={formData.region}
        onChangeText={(text) => handleChange('region', text)}
      />
      <TextInput
        placeholder="Date Of Birth"
        value={formData.dob}
        onChangeText={(text) => handleChange('dob', text)}
      />
      <Button title="Save" onPress={handleSubmit} />
    </View>
  );
};

export default UpdateProfile;
