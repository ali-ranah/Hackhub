import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectToken } from '../../../State/Reducers/tokenSlice';
import { AxiosRequest } from '../Axios/AxiosRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [events, setEvents] = useState([]);
  const storedToken = AsyncStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;

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
  }, []);

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

  return (
    <View className='h-full w-full bg-[#14082c] mb-20'>
      <View  className="flex flex-col items-center justify-center">
        {events.map((event) => (
          <View key={event.id} className="w-full flex mb-2 items-center justify-center">
            <Card className=' w-3/4  items-start justify-center rounded-2xl hover:shadow-black hover:shadow-2xl transition-transform  hover:-translate-y-1'>
              <Card.Content className="flex flex-col items-start">
              <Text className="text-lg font-bold text-black">{event.event_title}</Text>
                <View className='flex-row'>
                  <MaterialIcons name="date-range" size={20} color="black" />
                  <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                    {formatDate(event.start_date)} to {formatDate(event.end_date)}
                  </Text>
                </View>
                <View className='flex-row'>
                  <MaterialIcons name="access-time" size={20} color="black" />
                  <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                    Days Left: {calculateDaysLeft(event.end_date)}
                  </Text>
                </View>
                <View className='flex-row'>
                  {getStatus(event.start_date, event.end_date) === 'Not Started Yet' && <FontAwesome name="check-circle" size={20} color="gray" />}
                  {getStatus(event.start_date, event.end_date) === 'Ongoing' && <FontAwesome name="check-circle" size={20} color="green" />}
                  {getStatus(event.start_date, event.end_date) === 'Completed' && <FontAwesome name="check-circle" size={20} color="black" />}
                  <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                    Status: {getStatus(event.start_date, event.end_date)}
                  </Text>
                </View>
                <View className='flex-row'>
                  <MaterialIcons name="location-on" size={20} color="black" />
                  <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                    Location: {event.location}
                  </Text>
                </View>
                <View className='flex-row'>
                  <MaterialIcons name="attach-money" size={20} color="black" />
                  <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                    Prize Amount: {event.prizeAmount}
                  </Text>
                </View>
                <View className='flex-row'>
                  <MaterialIcons name="people" size={20} color="black" />
                  <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                    Participants Allowed: {event.numberOfParticipants}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="category" size={20} color="black" />
                  <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                    Preferred Language: {event.preferedLanguage}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Home;
