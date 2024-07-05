import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView,StyleSheet,TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { selectToken } from '../../../State/Reducers/tokenSlice';
import { AxiosRequest } from '../Axios/AxiosRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row } from 'react-native-table-component';
import { Button } from 'react-native-paper';

const Hackathons = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [FetchJoinedEvents, setFetchJoinedEvents] = useState(true);
  const [joinedEvents, setJoinedEvents] = useState(new Set()); // To store IDs of events already joined
  const storedToken = AsyncStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await AxiosRequest.get('/api/events/', {
          headers: {
            authorization: token,
          },
        });
        const { body } = await response.data;
        setEvents(body);
        setLoading(false);
        await fetchJoinedEvents(); // Fetch events user has already joined
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const fetchJoinedEvents = async () => {
    try {
      const response = await AxiosRequest.get('/api/events/participants/user', {
        headers: {
          authorization: token,
        },
      });
      const joinedEventsData = await response.data.body.map(event => event.event_id);
      setJoinedEvents(new Set(joinedEventsData));
      setFetchJoinedEvents(false); 
    } catch (error) {
      console.error('Error fetching joined events:', error);
      setFetchJoinedEvents(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  const handleJoinEvent = async (eventId, question, guidelines, description) => {
    try {
      await AxiosRequest.post(`/api/events/${eventId}/participants`, {
        question: question,
        guidelines: guidelines,
        description: description
      }, {
        headers: {
          authorization: token
        }
      });
      // After successfully joining, fetch updated events including the newly joined event
      await fetchJoinedEvents(); // Refresh joined events list
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };


  if (loading) {
    return (
      <View className="min-h-screen min-w-screen flex items-center justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (FetchJoinedEvents) {
    return (
      <View className="min-h-screen min-w-screen flex items-center justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="min-h-screen min-w-screen flex items-center justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
      <ScrollView>
      {Array.isArray(events) && events.length > 0 ? (
       <>
        <View className="flex items-center justify-center">
          <Text className="text-2xl font-bold  mb-4 text-white dark:text-white">Event Summary</Text>
        </View>
        <Table borderStyle={styles.tableBorder} className={'w-[90vw]'}>
          <Row textStyle={styles.tableText}   data={['ID', 'Title', 'Start Date', 'End Date', 'Status', 'Action']}  />
          {events.map((item, index) => (
  <Row
    textStyle={styles.tableText}
    key={item.id}
    data={[
      ++index,
      item.event_title,
      formatDate(item.start_date),
      formatDate(item.end_date),
      new Date() < new Date(item.start_date)
        ? 'Not Started Yet'
        : new Date() <= new Date(item.end_date)
        ? 'Ongoing'
        : 'Completed',
        joinedEvents.has(item.id)
        ? 'Already Joined'
        : new Date() < new Date(item.start_date)
        ? 'Not Started Yet'
        : new Date() > new Date(item.end_date)
        ? 'Completed'
        : (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              handleJoinEvent(item.id, item.question, item.guidelines, item.description)
            }
          >
            <Text className='text-white font-bold'>Join Event</Text>
          </TouchableOpacity>
        ),
    ]}
  />
))}
        </Table>
        </>
      ):(
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginTop: 4 }}>No Events Found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  tableBorder: {
    borderWidth: 2,
    borderColor: 'white',
  },
  tableText: {
    color: 'white',
    padding:6
  },
  button: {
    backgroundColor: 'green',
    padding: 2,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal:6
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default Hackathons;
