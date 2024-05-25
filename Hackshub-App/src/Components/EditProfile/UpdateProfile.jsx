import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Image, ToastAndroid, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from '../../../State/Reducers/tokenSlice';
import { selectSelectedRole } from '../../../State/Reducers/roleSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// import RNFetchBlob from 'rn-fetch-blob';


const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    image_url: '',
    country: '',
    mobile: '',
    region: '',
    dob: '',
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

  // const handleImageUpload = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });
  //   const uriParts = result.assets[0].uri.split('/');
  //   const filename = uriParts[uriParts.length - 1];

  //   console.log("Image filename:", filename);
  //   console.log("ImagePicker result:", result); // Log the result for debugging

  //   if (!result.canceled) {
  //     setLoading(true);
  //     if (result.assets[0].mimeType === 'image/jpeg' || result.assets[0].mimeType === 'image/png') {
  //     const data = new FormData();
  //     data.append('file',filename);
  //     data.append('upload_preset', 'ml_default');
  //     data.append('cloud_name', 'dnircbhck');

  //     try {
  //       const response = await fetch('https://api.cloudinary.com/v1_1/dnircbhck/image/upload',{ 
  //         method: 'POST',
  //         body: data,
  //     }
  //     );
  //     const imageData = await response.json();
  //     console.log('Image DATA',imageData);
  //       const secureUrl = imageData.secure_url;
  //       console.log("Secure Url", secureUrl);
  //       setFormData({
  //         ...formData,
  //         image_url: secureUrl,
  //       });
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error uploading image:', error);
  //       setLoading(false);
  //       ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
  //     }
  //   }
  // }else{
  //   setLoading(false);
  //   ToastAndroid.show('Please select an image in JPEG or PNG format', ToastAndroid.SHORT);

  // }
  // };


const handleImageUpload = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  console.log("ImagePicker result:", result);

  if (!result.canceled) {
    setLoading(true);
    if (result.assets[0].mimeType === 'image/jpeg' || result.assets[0].mimeType === 'image/png') {
      const imageUri = result.assets[0].uri;
      const uploadUrl = 'https://api.cloudinary.com/v1_1/dnircbhck/image/upload';
      const uploadPreset = 'ml_default';

      try {
        const response = await RNFetchBlob.fetch(
          'POST',
          uploadUrl,
          {
            'Content-Type': 'multipart/form-data',
          },
          [
            {
              name: 'file',
              filename: 'image.jpg',
              type: result.assets[0].mimeType,
              data: RNFetchBlob.wrap(imageUri),
            },
            { name: 'upload_preset', data: uploadPreset },
            { name: 'cloud_name', data: 'dnircbhck' },
          ]
        );

        const imageData = response.json();
        console.log('Image DATA', imageData);
        const secureUrl = imageData.secure_url;
        console.log("Secure Url", secureUrl);
        setFormData({
          ...formData,
          image_url: secureUrl,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error uploading image:', error);
        setLoading(false);
        ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
      }
    } else {
      setLoading(false);
      ToastAndroid.show('Please select an image in JPEG or PNG format', ToastAndroid.SHORT);
    }
  } else {
    setLoading(false);
    ToastAndroid.show('Please select an image', ToastAndroid.SHORT);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <Button title="Select Image" onPress={handleImageUpload} />
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
      <TextInput
        placeholder="Date Of Birth"
        value={formData.dob}
        onChangeText={(text) => handleChange('dob', text)}
        style={styles.input}
      />
      <Button title="Save" onPress={handleImageUpload} disabled={loading} />
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
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default UpdateProfile;
