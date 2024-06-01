import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider'
import { Avatar,Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectToken } from '../../../State/Reducers/tokenSlice';
import { selectEmail } from '../../../State/Reducers/emailSlice';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigation = useNavigation();
    const storedToken =  AsyncStorage.getItem('token');
    const storedEmail = AsyncStorage.getItem('email');
    

    const token = useSelector(selectToken)||storedToken;
    const email = useSelector(selectEmail)||storedEmail;

    const fetchUser = useCallback(async () => {
        setLoading(true);
    
        try {
          const response = await AxiosRequest.post(
            '/api/users/search',
            { email },
            {
              headers: {
                authorization: token,
              }
            }
          );
          const data = response.data.body.user;
          if (data) {
            setUser(data);
          } else {
            console.error('Failed to fetch user:', data.message);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        } finally {
          setLoading(false);
        }
      }, [email, token]);
    
      useEffect(() => {
        fetchUser();
      }, [fetchUser]);

    const handleEdit = () => {
        navigation.navigate('UpdateProfile');
    };

    const user_email = user?.email || 'demo@example.com';
    const country = user?.country || 'Demo Country';
    const mobile = user?.mobile || 'Demo Mobile';
    const region = user?.region || 'Demo Region';
    const dob = user?.DOB ? new Date(user.DOB).toLocaleDateString('en-GB') : 'Demo DOB';
    const image_url = user?.image_url || 'https://randomuser.me/api/portraits/men/32.jpg';

    const languageSkills = {
      C_skill: user?.C_skill,
      Cpp_skill: user?.Cpp_skill,
      JAVA_skill: user?.JAVA_skill,
      PYTHON_skill: user?.PYTHON_skill
    };
    console.log('LanguageSkills', languageSkills);
  
    const languages = [
      { name: 'C', skill: languageSkills.C_skill },
      { name: 'C++', skill: languageSkills.Cpp_skill },
      { name: 'JAVA', skill: languageSkills.JAVA_skill },
      { name: 'PYTHON', skill: languageSkills.PYTHON_skill }
    ];

    return (
        <View className='flex min-h-screen items-center justify-start  bg-[#14082c]'>
            {loading ? (
                <ActivityIndicator color="white" size="large" />
            ) : (
                <>
                    <View className='flex relative mt-4'>
                        <Avatar.Image source={{ uri: image_url }} size={150} />
                    </View>
                    <View className='flex items-center justify-center gap-2 mt-4'>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Email:</Text>
                        <Text style={{ color: 'white' }}>{user_email}</Text>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Country:</Text>
                        <Text style={{ color: 'white' }}>{country}</Text>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Mobile:</Text>
                        <Text style={{ color: 'white' }}>{mobile}</Text>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Region:</Text>
                        <Text style={{ color: 'white' }}>{region}</Text>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Date of Birth:</Text>
                        <Text className='text-white mb-4'>{dob}</Text>
                        <Text variant="h6" className="font-bold self-center text-white">Language Skills</Text>
                        {languages.map((language, index) => (
            <View key={index} className='flex flex-row gap-2 '>
                <Text style={{ marginRight: 10, color: 'white' }}>{language.name}:</Text>
                <Slider
                    style={{ flex: 1 ,padding:6 }}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={language.skill}
                    enabled={false}
                />
            </View>
        ))}
                        <Button
                            icon={() => <MaterialCommunityIcons name="pencil" size={24} color="white" />}
                            mode="contained"
                            onPress={handleEdit}
                            className='flex bg-gray-600'
                        >
                            Edit Profile
                        </Button>
                    </View>
                </>
            )}
        </View>
    );
};

export default EditProfile;
