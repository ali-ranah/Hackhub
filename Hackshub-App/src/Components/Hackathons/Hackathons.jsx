import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView,StyleSheet,TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { selectToken } from '../../../State/Reducers/tokenSlice';
import { AxiosRequest } from '../Axios/AxiosRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row } from 'react-native-table-component';

const Hackathons = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="min-h-screen min-w-screen flex items-center justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
      <ScrollView>
        <View className="flex items-center justify-center">
          <Text className="text-2xl font-bold  mb-4 text-white dark:text-white">Event Summary</Text>
        </View>
        <Table borderStyle={styles.tableBorder} className={'w-[90vw]'}>
          <Row textStyle={styles.tableText}   data={['ID', 'Title', 'Start Date', 'End Date', 'Status']}  />
          {events.map((item, index) => (
            <Row textStyle={styles.tableText}    key={item.id} data={[++index, item.event_title, formatDate(item.start_date), formatDate(item.end_date), new Date() < new Date(item.start_date) ? 'Not Started Yet' : new Date() <= new Date(item.end_date) ? 'Ongoing' : 'Completed']} />
          ))}
        </Table>
        {Array.isArray(events) && events.length === 0 && (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginTop: 4 }}>No Events Found</Text>
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
    padding:10
  }
});

export default Hackathons;
