import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity,Image } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { selectToken } from '../../../State/Reducers/tokenSlice';
import { AxiosRequest } from '../Axios/AxiosRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReadMoreText = ({ text, numberOfLines}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View>
      <Text
        className="text-sm text-start mr-[4vw] font-bold text-black"
        numberOfLines={isExpanded ? undefined : numberOfLines}
      >
        {text}
      </Text>
      {text.length > 50 && (
        <TouchableOpacity onPress={toggleExpand}>
          <Text className="text-sm font-bold text-blue-500">{isExpanded ? 'Read Less' : 'Read More'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const Home = () => {
  const [events, setEvents] = useState([]);
  const storedToken = AsyncStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const isFocused = useIsFocused();
  console.log("Token: " , token);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await AxiosRequest.get('/api/events/', {
          headers: {
            authorization: token
          }
        });
        const { body } = response.data;
        setEvents(body);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [isFocused]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  const calculateDaysLeft = (end_date) => {
    const currentDate = new Date();
    const end = new Date(end_date);
    const diffTime = end - currentDate;
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return diffDays;
  };

  const getStatus = (start_date, end_date) => {
    const currentDate = new Date();
    if (currentDate < new Date(start_date)) {
      return 'Not Started Yet';
    } else if (currentDate <= new Date(end_date)) {
      return 'Ongoing';
    } else {
      return 'Completed';
    }
  };

  const getBadgeIcon = (ratingInEventsRank) => {
    if (ratingInEventsRank == 1) {
      return <Image source={require('../../../assets/medal1.png')} style={{ width: 40, height: 40 }} />;
    } else if (ratingInEventsRank == 2) {
      return <Image source={require('../../../assets/medal2.png')} style={{ width: 40, height: 40 }} />;
    } else if (ratingInEventsRank == 3) {
      return <Image source={require('../../../assets/medal3.png')} style={{ width: 40, height: 40 }} />;
    } else {
      return null;
    }
  };
  

  return (
    <View className='min-h-screen w-full bg-[#14082c]'>
      <View className="space-y-8 p-8 dark:bg-gray-800">
        <View className="flex flex-col mb-[3vh] items-center justify-center">
          {events.map((event) => (
            <View key={event.id} className="w-full flex mb-[2vh] items-center justify-center">
              <Card className='w-full items-start justify-center rounded-2xl hover:shadow-black hover:shadow-2xl transition-transform hover:-translate-y-1'>
              <View className='mt-[2vh] flex flex-col  items-center justify-center text-center'>
              {getBadgeIcon(event.ratingInEventsRank)}
              <Text className='text-sm font-bold text-black'>Average Participation Rate: {event.averageRate}%</Text>
                </View>
                <Card.Content className="flex flex-col items-start p-10 ">
                <Text className="text-lg font-bold !self-center mb-[1vh] text-black">{event.event_title}</Text>
                  <View className='flex-row'>
                    <MaterialIcons name="date-range" size={20} color="black" />
                     <Text className="text-sm font-bold text-black">
                      {formatDate(event.start_date)} to {formatDate(event.end_date)}
                    </Text>
                  </View>
                  <View className='flex-row'>
                    <MaterialIcons name="access-time" size={20} color="black" />
                    <Text className="text-sm font-bold text-black">
                      Days Left: {calculateDaysLeft(event.end_date)}
                    </Text>
                  </View>
                  <View className='flex-row'>
                    {getStatus(event.start_date, event.end_date) === 'Not Started Yet' && <FontAwesome name="check-circle" size={20} color="gray" />}
                    {getStatus(event.start_date, event.end_date) === 'Ongoing' && <FontAwesome name="check-circle" size={20} color="green" />}
                    {getStatus(event.start_date, event.end_date) === 'Completed' && <FontAwesome name="check-circle" size={20} color="black" />}
                    <Text className="text-sm font-bold text-black">
                      Status: {getStatus(event.start_date, event.end_date)}
                    </Text>
                  </View>
                  <View className='flex-row'>
                    <MaterialIcons name="access-time" size={20} color="black" />
                    <Text className="text-sm font-bold text-black">
                      Time Allowed: {event.allowed_time} {parseInt(event.allowed_time) === 1 ? 'hour' : 'hours'}
                    </Text>
                  </View>
                  {/* <View className='flex-row'>
                    <MaterialIcons name="question-answer" size={20} color="black" />
                    <ReadMoreText text={`Question: ${event.question}`} numberOfLines={1}/>
                  </View> */}
                  <View className='flex-row'>
                    <MaterialIcons name="rule" size={20} color="black" />
                    <ReadMoreText text={`Guidelines: ${event.guidelines}`} numberOfLines={1}/>
                  </View>
                  <View className='flex-row'>
                    <MaterialIcons name="description" size={20} color="black" />
                    <ReadMoreText text={`Description: ${event.description}`} numberOfLines={1}/>
                  </View>
                  <View className='flex-row'>
                    <MaterialIcons name="attach-money" size={20} color="black" />
                    <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                      Prize Amount: PKR {event.prizeAmount}
                    </Text>
                  </View>
                  <View className='flex-row'>
                    <MaterialIcons name="people" size={20} color="black" />
                    <Text className="text-sm font-bold text-black">
                    Participants : {event.joinedParticipants}/{event.numberOfParticipants}
                    </Text>
                  </View>
                  <View className='flex-row'>
                    <MaterialIcons name="category" size={20} color="black" />
                    <Text className="text-sm font-bold text-black">
                      Preferred Language: {event.preferedLanguage}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Home;

