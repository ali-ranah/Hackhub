import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput,Image, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import logo from "../../../assets/logo.jpg";
import { selectSelectedRole } from '../../../State/Reducers/roleSlice';
import { useNavigation } from '@react-navigation/native';
import Profile from './Profile';

const Header = () => {
  const [openNav, setOpenNav] = useState(false);
  const navigation = useNavigation();

const navList = (
  <View className="mt-2  flex flex-col  gap-2 lg:mb-0 lg:mt-0  lg:flex-row lg:items-center lg:gap-6">
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <Text style={{ color: 'white', marginHorizontal: 6 }}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Hackathons')}>
      <Text style={{ color: 'white', marginHorizontal: 6 }}>Hackathons</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Compiler')}>
      <Text style={{ color: 'white', marginHorizontal: 6 }}>Compiler</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('AI Bot')}>
      <Text style={{ color: 'white', marginHorizontal: 6 }}>AI Bot</Text>
    </TouchableOpacity>
  </View>
);
  return (
    <View className="w-screen border-0 rounded-none px-2 py-2" style={{ backgroundColor: "#14082c" }}>
      <View className="container mx-auto flex items-end justify-center text-white">
        <TouchableOpacity className='absolute left-2'>
          <Image source={logo} className="w-10 h-8" />
        </TouchableOpacity>
        {/* <View>{navList}</View> */}
        <View className="items-center gap-x-4 flex flex-row">
        <Profile />

      <View className="flex items-center justify-center">
      <TouchableOpacity
          className='ml-auto  h-[4vh] w-[6vw]  text-inherit mr-4 hover:bg-transparent focus:bg-transparent active:bg-transparent'
          onPress={() => setOpenNav(!openNav)}
        >
          <MaterialIcons name={openNav ? 'close' : 'menu'} size={28}  color="white" className='flex' />
        </TouchableOpacity>
        </View>
        
        </View>
      </View>

      {openNav && (
        <View className='flex flex-col mt-6'>
          {navList}
          <View className="flex  gap-x-2 w-full md:flex-row md:items-center">
          <View className="relative flex w-full mt-6">
              <TextInput
                placeholder="Search..."
                placeholderTextColor='white'
                className='border border-white p-2 text-white'
              />
            </View>
            <View className='flex mt-6 min-w-screen items-center justify-center'>
            <TouchableOpacity className='bg-gray-700 flex rounded-lg items-center justify-center w-[24vw] h-[4vh]'>
              <Text className='text-white'>Search</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Header;
