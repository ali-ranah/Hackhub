import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button,StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setEmailAction } from '../../../State/Reducers/emailSlice';
import { setSelectedRole } from '../../../State/Reducers/roleSlice';
import { setTokenAction } from '../../../State/Reducers/tokenSlice';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const role = 'Participant';
  const dispatch = useDispatch();

  useEffect(() => {
    const getPasswordFromStorage = async () => {
      const storedPassword = await AsyncStorage.getItem('password');
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedPassword) {
        setPassword(storedPassword);
      }
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };

    getPasswordFromStorage();
  }, []);

  const handleSubmit = async () => {
    try {
      dispatch(setEmailAction(email));
      dispatch(setSelectedRole(role));
      await AsyncStorage.setItem('selectedRole', role);

      if (rememberMe) {
        await AsyncStorage.setItem('password', password);
      }

      const response = await AxiosRequest.post('/api/auth/login/participant', { email, password, role });

      const token = response.data.body.token;
      console.log('token', token);
      dispatch(setTokenAction(token));
      await AsyncStorage.setItem('token', token);
      ToastAndroid.show('Login successful', ToastAndroid.SHORT);
      console.log('Role', role);
      setTimeout(() => {
        navigation.navigate('Home');
        console.log('Participant');
      }, 500);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        ToastAndroid.show('Invalid Email or Password', ToastAndroid.SHORT);
      }else if (error.response && error.response.status === 403) {
        ToastAndroid.show('Not A Participant, Please Enter Registered Participant Account', ToastAndroid.SHORT);
      }
      else if (error.response && error.response.status === 404) {
        ToastAndroid.show('Account Not Found', ToastAndroid.SHORT);
      }
       else {
        ToastAndroid.show('Login failed', ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View className="h-full flex items-center justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
      <View className="max-w-md w-full  p-8 bg-white rounded-xl shadow-xl">
        <View className="space-y-4 p-2">
          <Text className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</Text>

          <TextInput
            value={email}
            placeholder='Email Address'
            onChangeText={setEmail}
            className='border p-1'
          />
          <View className="relative">
            <TextInput
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholder='Password'
              className='border p-1'
            />
            <View className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className='p-3'>
                {showPassword ? <Icon name='eye-slash' /> : <Icon name='eye' />}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="text-center flex items-center justify-center mt-10 space-y-2">
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text className='text-white font-bold'>Sign in</Text>
          </TouchableOpacity>
          <Text className="text-gray-600">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text className='text-[#14082c] font-bold'>Sign up instead</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  }
});


export default Login;
