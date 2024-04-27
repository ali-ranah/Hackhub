import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity,ToastAndroid,Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRole, selectSelectedRole } from '../../../State/Reducers/roleSlice';
import { selectToken } from '../../../State/Reducers/tokenSlice';
import { selectEmail } from '../../../State/Reducers/emailSlice';
import { useNavigation } from '@react-navigation/native';
import { AxiosRequest } from '../Axios/AxiosRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Profile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const storedRole = AsyncStorage.getItem('selectedRole');
  const role = useSelector(selectSelectedRole) || storedRole;
  const storedToken = AsyncStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const storedEmail = AsyncStorage.getItem('email');
  const email = useSelector(selectEmail) || storedEmail;
  const [imagePath, setImagePath] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(async () => {
    const confirmed = await new Promise((resolve) =>
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => resolve(true) },
        ],
        { cancelable: false }
      )
    );

    if (confirmed) {
      ToastAndroid.show('Logout successful', ToastAndroid.SHORT);
      await AsyncStorage.removeItem('email');
      dispatch(setSelectedRole(null));
      navigation.navigate('Login');
    }
  }, [dispatch, navigation]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      try {
        const response = await AxiosRequest.post(
          '/api/users/search',
          { email },
          {
            headers: {
              authorization: token,
            },
          }
        );
        const data = response.data.body.user;
        if (data) {
          setImagePath(data.image_url);
        } else {
          console.error('Failed to fetch user:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token, email]);

  const handleProfileScreen = () => {
    navigation.navigate('Profile');
  };

  const image_url = imagePath || 'https://randomuser.me/api/portraits/men/32.jpg';

  return (
    <>
      <View className='flex flex-row gap-2 space-x-4 items-center'>
        <Ionicons name="notifications-outline" size={24} color="white" />
        {loading ? (
          <View className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"/>
        ) : (
          <Avatar.Image
            source={{ uri: image_url }}
            size={32}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>

      <View>
      <TouchableOpacity onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
        <Ionicons
          name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType='none'
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          className='justify-center flex-1'
          onPress={() => setIsDropdownOpen(false)}
        >
          <View className='flex items-start justify-center min-w-screen h-[14vh] bg-gray-300 absolute top-10 right-6 rounded-xl p-4'>
            <Button onPress={handleProfileScreen}>
             <View className='flex-row'>
              <Ionicons name="person" size={16} color="black"/>
              <Text className='text-black'>Profile</Text>
              </View>
            </Button>
            <Button onPress={handleLogout} className='mt-2'>
            <View className='flex-row'>
              <Ionicons name="log-out" size={18} color="black"/>
              <Text className='text-black'>Log out</Text>
              </View>
            </Button>
            </View>
        </TouchableOpacity>
      </Modal>
    </View>
    </>
  );
};

export default Profile;
