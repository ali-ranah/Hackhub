import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Button,ToastAndroid,StyleSheet} from 'react-native';
import {Picker} from "@react-native-picker/picker";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from "../../../State/Reducers/tokenSlice";
// import { selectName } from "../../../State/Reducers/nameSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosRequest } from "../Axios/AxiosRequest";

const Compiler = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
//   const [title, setTitle] = useState("");
//   const [question, setQuestion] = useState("");
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
  
  const storedToken = AsyncStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
//   const storedName = AsyncStorage.getItem('name');
//   const name = useSelector(selectName) || storedName;

//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
//         const response = await axios.get('/api/events/participants/user', {
//           headers: {
//             authorization: token
//           }
//         });
//         const events = response.data.body;
//         if (events.length > 0) {
//           setQuestion(events[0].question);
//         }
//       } catch (error) {
//         console.error("Failed to fetch question:", error);
//       }
//     };

//     fetchQuestion();
//   }, [token]);

  const compileCode = async () => {
    try {
      const response = await AxiosRequest.post("/api/compile/", {
        code,
        input,
        lang,
      });
      setOutput(response.data);
      setError("");
    } catch (err) {
      setError(err.response.data.error || "An error occurred");
      setOutput("");
    }
  };

//   const submitProject = async () => {
//     const eventId = navigation.getParam('eventId');
//     try {
//       const response = await axios.post(`/api/events/${eventId}/projects`, {
//         project_title: title,
//         participant_or_team_name: name,
//         project_writeups: code,
//       }, {
//         headers: {
//           authorization: token
//         }
//       });
//       Toast.show({
//         type: 'success',
//         text1: 'Project submitted successfully',
//       });
//       dispatch(setEventIdAction(null));
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.message === 'Project already submitted') {
//         Toast.show({
//           type: 'error',
//           text1: 'Project already submitted',
//         });
//       } else {
//         console.error(error.response.data.error || "An error occurred");
//         Toast.show({
//           type: 'error',
//           text1: 'Project Submission Failed',
//         });
//       }
//     }
//   };

  return (
    <View className="min-w-screen min-h-screen flex flex-col justify-center text-center items-center p-6 bg-[#14082c]">
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="Enter your code here"
        multiline
        className='border bg-white w-full rounded-lg p-4 mb-[2vh]'

/>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Enter your input here"
        multiline
        className='border bg-white rounded-lg w-full p-2 mb-[2vh]'
      />
      <Picker
        selectedValue={lang}
        onValueChange={(itemValue) => setLang(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Language" value="" />
        <Picker.Item label="C" value="C" />
        <Picker.Item label="C++" value="C++" />
        <Picker.Item label="Java" value="Java" />
        <Picker.Item label="Python" value="Python" />
      </Picker>
      <View className="flex flex-col items-center justify-center mt-[2vh]">
        <Button title="Compile & Run" onPress={compileCode} color='black' />
        {/* <Button title="Submit Project" onPress={submitProject} /> */}
      </View>
      <Text style={styles.outputText}>Output:</Text>
      {error ? <Text style={styles.errorText}>Error: {error}</Text> : null}
      <View className='flex w-full'>
      <ScrollView className='p-6 mt-[2vh]  border bg-white' contentContainerStyle='justify-center align-center'>
        <Text className='text-black'>{output}</Text>
      </ScrollView>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
    picker: {
      width: '100%',
      padding: 20,
      marginVertical: 8,
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'gray',
    },
    outputText: {
      fontSize: 16,
      color: 'white',
      marginTop: 16,
    },
    output: {
      width: '100%',
      padding: 12,
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'gray',
    },
    errorText: {
      color: 'red',
    },
  });

export default Compiler;