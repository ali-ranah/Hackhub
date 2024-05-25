import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, SafeAreaView, KeyboardAvoidingView,Platform} from 'react-native';
import {AxiosRequest} from '../Axios/AxiosRequest';
import { IconButton,ActivityIndicator } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AIChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);


  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    }
    setLoading(true);

    try {
      const response = await AxiosRequest.post('/api/ask/', { message: input });
      const data = response.data;
      setMessages([...messages, { text: input, isUser: true }, { text: data.response, isUser: false }]);
      setInput('');
    } catch (error) {
      console.error('API Error:', error);
      // Handle error (e.g., display an error message to the user)
    } finally {
        setLoading(false);
      }
  };

  return (
    <SafeAreaView className="flex flex-col w-full min-h-screen  bg-[#14082c]">
        {/* <KeyboardAvoidingView
                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        > */}
      <ScrollView className="flex flex-col mb-2 overflow-y-auto h-[60vh]">
        {messages.map((msg, index) => (
          <View key={index}  className={`mb-[2vh] flex p-4 ${msg.isUser ? 'self-end' : 'self-start'}`}>
                          <Text className={`mb-2 text-white  flex ${msg.isUser ? 'self-end ' : 'self-start'}`}>{msg.isUser ? 'You' : 'Bot'}</Text>
            <Text className={`rounded-lg px-4 py-2 max-w-xs ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView 
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
      <View className="p-4  flex w-screen items-center justify-center  border-t border-black">

      <View className="flex w-screen relative p-4 mb-[6vh]">
      <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          placeholder="Type your message..."
          placeholderTextColor={'white'}
          className='border border-white p-4 text-white'

        />
                  <View className='absolute right-[8vw] top-[5vw]' >
                    {loading ? (
                        <IconButton icon={ActivityIndicator} containerColor='white'  color='black'/>
                    ):(
                        <TouchableOpacity  onPress={sendMessage} >
        <IconButton icon="send" containerColor='white' iconColor='black' /> 
        </TouchableOpacity>
                    )    
                    }
      
        </View>
      </View>
      </View>
      </KeyboardAvoidingView>

      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default AIChatBot;
