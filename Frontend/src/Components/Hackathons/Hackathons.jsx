import React, { useEffect, useState } from 'react';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { useSelector } from 'react-redux'; // Import useSelector and useDispatch
import { selectToken } from '../../State/Reducers/tokenSlice';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Hackathons = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0); // Add state for totalEvents'
  const [eventStartIndex, setEventStartIndex] = useState(1); // Add state for starting index of events
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch events from backend
    const fetchEvents = async () => {
      console.log("Token", token);
      try {
        const response = await AxiosRequest.get(`/api/events/user-events?perPage=5&currentPage=${currentPage}`, {
          headers: {
            authorization: token // Pass the authorization token in the request headers
          }
        });
        const { body } = await response.data;
        setEvents(body.data);
        setTotalEvents(body.total);
        setTotalPages(Math.ceil(totalEvents / 5)); // Calculate total pages based on totalEvents
        setEventStartIndex((currentPage - 1) * 5 + 1);
        console.log("Total Pages", totalPages);
        console.log("Events",events);
        console.log("Total Events",totalEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    fetchEvents();
  }, [currentPage, token, totalEvents]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmission = (eventId) => {
    navigate(`/organizer/submissions/${eventId}`)
  };



  return (
    <>
      <div className="min-h-screen min-w-screen flex items-start justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-screen space-y-8 p-8 dark:bg-gray-800">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold mb-4 text-white dark:text-white">Event Summary</h1>
          </div>
          {Array.isArray(events) && events.length === 0 ? (
                <div className="flex items-center justify-center text-white dark:text-white">
                <p className="text-lg font-bold text-white mt-4">No Events Found</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-4">
                  {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-900 text-white'
                          : 'bg-gray-200 text-black'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-white dark:text-gray-300">Page {currentPage} of {totalPages}</span>
              </div>
              <div className="min-h-screen overflow-x-auto">
                <table className="min-w-full divide-y divide-black">
                  <thead className="dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">S.No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">Event Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-300 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black dark:bg-gray-800 dark:divide-gray-700">
                    {Array.isArray(events) && events.map((event, index) => (
                      <tr key={event.id} className="dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">{eventStartIndex+index}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">{event.event_title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">{formatDate(event.start_date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">{formatDate(event.end_date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {new Date() < new Date(event.start_date)? 'Not Started Yet': new Date() <= new Date(event.end_date)? 'Ongoing': 'Completed'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleSubmission(event.id)}>
                            Show Submissions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
  
};

export default Hackathons;

