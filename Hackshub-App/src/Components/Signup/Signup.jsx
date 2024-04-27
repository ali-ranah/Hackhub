import React, { useState } from 'react';
import { View, Text,   SafeAreaView,ScrollView ,TextInput, Button, TouchableOpacity,ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { MaterialIcons } from '@expo/vector-icons';
import { AxiosRequest } from '../Axios/AxiosRequest';
import DateTimePicker from '@react-native-community/datetimepicker';

// import DatePicker from 'react-native-date-picker';

const Signup = () => {
    const navigation = useNavigation();
  const [fullname, setFullName] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
//   const [open, setOpen] = useState(false)
const [DOB, setDOB] = useState(new Date());
const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control visibility of the date picker
  const dispatch = useDispatch();
  const role = 'Participant';

//   const roleOptions = ['Participant', 'Organizer'];

const formatDate = (date) => {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const onChange = (event, selectedDate) => {
  const currentDate = selectedDate || DOB;
  setDOB(currentDate);
};



  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ToastAndroid.show('Invalid email address', ToastAndroid.SHORT);
      return;
    }

    const fullnameRegex = /^[a-zA-Z ]*$/;
  if (!fullnameRegex.test(fullname)) {
    ToastAndroid.show('Fullname should not contain numbers', ToastAndroid.SHORT);
    return;
  }

    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      ToastAndroid.show('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit', ToastAndroid.SHORT);
      return;
    }
  
    // Confirm password match
    if (confirmPassword !== password) {
      ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
      return;
    }
  
    try {
      console.log(fullname,username,email,mobile,country,region,DOB,password,role);
      const response = await AxiosRequest.post('/api/auth/register', { fullname, username, email, mobile, country, region, DOB, password,role });
  
      // Handle response
      console.log('Registration successful:', response.data);
      console.log('Role',role);
      ToastAndroid.show('Registration successful', ToastAndroid.SHORT);
      setTimeout(() => {
        navigation.navigate("Login")
console.log('Registration successful');  
      }, 1000);
    } catch (error) {
      // Handle error
  
      if (error.response && error.response.status === 409) {
        ToastAndroid.show('Account with this email already exists, try another email address', ToastAndroid.SHORT);

      } else {
        ToastAndroid.show('Registration failed', ToastAndroid.SHORT);

      }
    }
  };

  return (
    <SafeAreaView className="h-full flex  items-center justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
      <View className="max-w-md  w-full p-8 bg-white rounded-xl shadow-xl">
      <ScrollView className='space-y-4'>
        <Text className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</Text>
        <TextInput
          value={fullname}
          onChangeText={setFullName}
          placeholder='Full Name'
          className='border p-1'
        />
        <TextInput
          value={username}
          onChangeText={setUserName}
          placeholder='Username'
          className='border p-1'
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder='Email Address'
          className='border p-1'
        />
        <TextInput
          value={mobile}
          onChangeText={setMobile}
          placeholder='Mobile'
          className='border p-1'
        />
        <TextInput
          value={country}
          onChangeText={setCountry}
          placeholder='Country'
          className='border p-1'
        />
        <TextInput
          value={region}
          onChangeText={setRegion}
          placeholder='Region'
          className='border p-1'
        />
          <View className="relative">
          <TextInput
    value={formatDate(DOB)}
    editable={false}
    className='border p-1 text-black'
  />
  <View className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">

<TouchableOpacity onPress={() => setShowDatePicker(true)} className='p-3'>
  <MaterialIcons name="calendar-today"  color="black"  />
 
</TouchableOpacity>
            </View>
{showDatePicker && (
  <DateTimePicker
    value={DOB}
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
          {showPassword ? <Icon name='eye-slash'/>:<Icon name='eye'/> }
          </TouchableOpacity>
          </View>
        </View>
        <View className="relative">
          <TextInput
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder='Confirm Password'
            className='border p-1'
          />
                    <View className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">

          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className='p-3'>

{showConfirmPassword ? <Icon name='eye-slash'/>: <Icon name='eye'/>}
          </TouchableOpacity>
          </View>
          </View>
        {/* <Picker
          selectedValue={role}
          onValueChange={(itemValue) => dispatch(setSelectedRole(itemValue))}
          style={{ borderWidth: 1, borderColor: 'black', borderRadius: 4, padding: 8, marginBottom: 16 }}
        >
          {roleOptions.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker> */}
                <View className="text-center flex items-center justify-center mt-10 space-y-2">
        <Button title="Sign up" onPress={handleSubmit} color='black' />
        <Text className="text-gray-600">Already have an account? </Text>
        <TouchableOpacity  onPress={() => navigation.navigate('Login')}>
          <Text className='text-[#14082c] font-bold'>Sign in instead</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
