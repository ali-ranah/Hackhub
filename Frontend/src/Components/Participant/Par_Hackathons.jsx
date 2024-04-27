import React, { useEffect, useState } from 'react';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { useNavigate } from 'react-router-dom';
import { selectToken } from '../../State/Reducers/tokenSlice';
import { ToastContainer, toast } from 'react-toastify';
import { setEventIdAction } from '../../State/Reducers/eventIdSlice';
import { useDispatch, useSelector } from 'react-redux';

const Par_Hackathons = () => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const[showGrade,setShowGrade] = useState(null);
  const storedToken = localStorage.getItem('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken) || storedToken;

useEffect(() => {
  const fetchEventData = async () => {
      try {
          const [eventsResponse, signedEventsResponse] = await Promise.all([
              AxiosRequest.get('/api/events/', {
                  headers: {
                      authorization: token
                  }
              }),
              AxiosRequest.get('/api/events/participants/user', {
                  headers: {
                      authorization: token
                  }
              })
          ]);

          const { body: eventsData } = await eventsResponse.data;
          const { body: signedEvents } = await signedEventsResponse.data;

          const updatedEvents = [];

          for (const event of eventsData) {
              const isRegistered = signedEvents.some(signedEvent => signedEvent.event_id === event.id);
              let projectDataLength = 0;
              let gradingData = null;
              if (isRegistered) {
                  const projectResponse = await AxiosRequest.get(`/api/events/project/${event.id}`, {
                      headers: {
                          authorization: token
                      }
                  });
                  const { body: projectData } = projectResponse.data;
                  projectDataLength = projectData ? 1 : 0;

                  if (projectData) {
                      const gradingResponse = await AxiosRequest.get(`/api/events/projects/${projectData.submitted_by}/${projectData.id}/grading`, {
                          headers: {
                              authorization: token
                          }
                      });
                      gradingData = gradingResponse.data.body;
                      console.log('Grading data',gradingData);
                  }
              }
              updatedEvents.push({ ...event, registered: isRegistered, projectDataLength, gradingData });
          }

          setEvents(updatedEvents);
          setLoadingEvents(false);
      } catch (error) {
          console.error('Error fetching events:', error);
      }
  };

  fetchEventData();
}, [token]);



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  const handleJoinEvent = async (eventId,question,guidelines,description) => {
    try {
      await AxiosRequest.post(`/api/events/${eventId}/participants`, {
        question:question,
        guidelines:guidelines,
        description:description
      }, {
        headers: {
          authorization: token
        }
      });
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId ? { ...event, registered: true } : event
        )
      );
      setJoinedEvents([...joinedEvents, eventId]); // Add the joined event to the list

      dispatch(setEventIdAction(eventId));
      toast.success('Event registered successfully');
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error('Already participated in this event');
      } else {
        console.error('Error registering event:', error);
        toast.error('Error registering event');
      }
    }
  };

  const handleNavigate = (eventId) => {
    // Perform navigation logic here
    navigate(`/participant/compiler/${eventId}`);
  };

  return (
    <>
      <div className="min-h-screen min-w-screen flex items-start justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer />
        <div className="w-screen space-y-8 p-8 dark:bg-gray-800">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold mb-4 text-white dark:text-white">Event Summary</h1>
          </div>
          <div className="min-h-screen overflow-x-auto">
            {loadingEvents ? (
              <div className="flex items-center justify-center text-white dark:text-white">Loading...</div>
            ) : (
              Array.isArray(events) && events.length === 0 ? (
                <div className="flex items-center justify-center text-white dark:text-white">
                <p className="text-lg font-bold text-white mt-4">No Events Found</p>
                </div>
              ) :(
              <table className="min-w-full divide-y divide-black">
                <thead className="dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">S.No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">Event Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">Status</th>
                    {showGrade&&(
                      <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">Plagiarism</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">AI Content</th>
                    </>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black dark:bg-gray-800 dark:divide-gray-700">
                  {Array.isArray(events) && events.map((event, index) => (
                    <tr key={event.id} className="dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">{++index}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">{event.event_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">{formatDate(event.start_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">{formatDate(event.end_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                        {new Date() < new Date(event.start_date) ? 'Not Started Yet' : new Date() <= new Date(event.end_date) ? 'Ongoing' : 'Completed'}
                      </td>
                      {showGrade && (
  <>
    {event.gradingData && event.gradingData.length > 0 ? (
      <>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">{event.gradingData[0].average_rating}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">{event.gradingData[0].plagiarism_score}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">{event.gradingData[0].ai_content}</td>
      </>
    ) : (
      <>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">Not found</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">Not found</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">Not found</td>
      </>
    )}
  </>
)}



                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                      {!event.registered && new Date() >= new Date(event.start_date) && new Date() <= new Date(event.end_date) && !joinedEvents.includes(event.id) && !event.projectDataLength && (
                        <button
  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  onClick={() => handleJoinEvent(event.id, event.question, event.description, event.guidelines ? event.guidelines : '')}
>
  Join
</button>
)}

                        {event.registered  &&event.projectDataLength > 0 && !event.gradingData &&(
                          <span className="text-white font-bold ">Already Submitted</span>
                        )}
                        {event.registered  &&event.projectDataLength > 0 && event.gradingData &&(
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded " onClick={() =>!showGrade?setShowGrade('true'):setShowGrade(null)}>{!showGrade?'Show Grade':'Hide Grade'}</button>
                        )}
                        {event.registered && event.projectDataLength === 0 && (
                          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded " onClick={() => handleNavigate(event.id)}>Submit</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Par_Hackathons;
