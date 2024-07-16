// SearchResults.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react'; // Assuming Card and Typography are from Material Tailwind
import { AxiosRequest } from '../Axios/AxiosRequest';
import { useSelector } from 'react-redux';
import { selectToken } from '../../State/Reducers/tokenSlice';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q');
  const [results, setResults] = useState({
    events: [],
    notifications: [],
    entry: [] // Updated to 'entry' based on backend response
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await AxiosRequest.get(`/api/search?query=${searchQuery}`, {
          headers: {
            Authorization: token
          }
        });
        setResults(response.data); // Assuming API returns an object with events, notifications, and entry array
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery, token]);

  return (
    <div className="p-6  flex flex-col text-center items-center justify-center space-y-6 bg-[#14082c]">
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="red">{error}</Typography>}
      {!loading && !error && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Search Results for "{searchQuery}"</h2>
          {results.events.length > 0 && (
            <Card className='flex justify-center  text-center'>
              <CardHeader className="bg-black mt-[2vh] text-white">Events</CardHeader>
              <CardBody>
                <ul className="divide-y divide-gray-200">
                  {results.events.map((event) => (
                    <li key={event.id} className="py-4">
                      <Typography  variant='paragraph' color="black">Event Title: {event.event_title}</Typography>
                      <Typography variant='paragraph' color="black">Event Description: {event.description}</Typography>
                      {/* Add more details as needed */}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
          {results.notifications.length > 0 && (
            <Card className='flex justify-center  text-center'>
              <CardHeader className="bg-black mt-[2vh] text-white">Notifications</CardHeader>
              <CardBody>
                <ul className="divide-y divide-gray-200">
                  {results.notifications.map((notification) => (
                    <li key={notification.id} className="py-4">
                      <Typography variant='paragraph' color="black">Message: {notification.message}</Typography>
                      {/* Add more details as needed */}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
          {results.entry.length > 0 && (
            <Card className='flex justify-center  text-center'>
              <CardHeader className="bg-black mt-[2vh] text-white">Projects</CardHeader>
              <CardBody>
                <ul className="divide-y divide-gray-200">
                  {results.entry.map((entry) => (
                    <li key={entry.id} className="py-4">
                      <Typography variant='paragraph' color="black">Project Title: {entry.project_title}</Typography>
                      <Typography variant='paragraph' color="black">Submitted By: {entry.participant_or_team_name}</Typography>
                      {/* Add more details as needed */}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
