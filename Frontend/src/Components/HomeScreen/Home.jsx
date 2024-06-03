import React, { useEffect, useState } from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import { MdDateRange, MdAccessTime, MdPeople, MdAttachMoney, MdCategory, MdTextSnippet, MdError, MdQuestionAnswer, MdTimer } from 'react-icons/md';
import { HiBadgeCheck } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { selectToken } from '../../State/Reducers/tokenSlice';
import { AxiosRequest } from '../Axios/AxiosRequest';
import Medal1 from '../../assets/medal1.png';
import Medal2 from '../../assets/medal2.png';
import Medal3 from '../../assets/medal3.png';



const Home = () => {
  const [events, setEvents] = useState([]);
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [expandedGuidelines, setExpandedGuidelines] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  console.log('Token',token)

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
        console.log(body);
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

  const toggleExpandQuestion = (eventId) => {
    setExpandedQuestions((prevExpanded) => ({
      ...prevExpanded,
      [eventId]: !prevExpanded[eventId]
    }));
  };
  
  const toggleExpandGuidelines = (eventId) => {
    setExpandedGuidelines((prevExpanded) => ({
      ...prevExpanded,
      [eventId]: !prevExpanded[eventId]
    }));
  };
  
  const toggleExpandDescription = (eventId) => {
    setExpandedDescriptions((prevExpanded) => ({
      ...prevExpanded,
      [eventId]: !prevExpanded[eventId]
    }));
  };
  
  const getBadgeIcon = (ratingInEventsRank) => {
    console.log(ratingInEventsRank)
    if (ratingInEventsRank == 1) {
      // return <FaMedal size={20} color="gold" />;
      return <img src={Medal1} className='w-[6vw] md:w-[4vw]'  />;

    } else if (ratingInEventsRank == 2) {
      // return <RiMedal2Fill size={20} color="silver" />;
      return <img src={Medal2} className='w-[4vw]'  />;

    } else if (ratingInEventsRank == 3) {
      // return <RiMedalFill size={20} color="bronze" />;
      return <img src={Medal3} className='w-[4vw]'  />;

    } else {
      return null;
    }
  };
  

  return (
    <div className="min-h-screen w-full bg-[#14082c]">
      <div className="space-y-8 p-8 dark:bg-gray-800">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mt-10 text-white dark:text-white">Home</h1>
          {events.length === 0 ? (
            <div className="w-full flex mt-4 items-center justify-center">
              <p className="text-lg font-bold text-white mt-4">No Events Found</p>
            </div>
          ) : (
            events.slice() // Create a copy of the array to avoid mutating the original array
            .sort((a, b) => b.averageRate - a.averageRate) // Sort the events in descending order of averageRate
            .map((event) => (
              <div key={event.id} className="w-full flex mt-[2vh] items-center justify-center">
                <Card className=' w-3/4 items-center justify-center rounded-2xl hover:shadow-black  hover:shadow-2xl transition-transform hover:-translate-y-1'>
                <div className='mt-[4vh] flex flex-col items-center justify-center text-center space-y-2'>
                  {getBadgeIcon(event.ratingInEventsRank)}
                  <Typography color='black' className=''> Average Participation Rate: {event.averageRate}%</Typography>
                </div>
                  <h2 className="text-lg font-bold text-black mt-2">{event.event_title}</h2>
                  <CardBody className="flex flex-col items-start">
                    <div className="flex items-center">
                      <MdDateRange size={20} color='black' />
                      <div className="ml-2">
                        <p className="text-sm font-bold text-black">
                          {formatDate(event.start_date)} to {formatDate(event.end_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MdAccessTime size={20} color='black' />
                      <div className="ml-2">
                        <p className="text-sm font-bold text-black">
                          Days Left: {calculateDaysLeft(event.end_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MdTimer size={20} color='black' />
                      <div className="ml-2">
                        <p className="text-sm font-bold text-black">
                          Time Allowed: {event.allowed_time} {parseInt(event.allowed_time) === 1 ? 'hour' : 'hours'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {getStatus(event.start_date, event.end_date) === 'Not Started Yet' && <HiBadgeCheck color="gray" size={20} />}
                      {getStatus(event.start_date, event.end_date) === 'Ongoing' && <HiBadgeCheck color="green" size={20} />}
                      {getStatus(event.start_date, event.end_date) === 'Completed' && <HiBadgeCheck color="blue" size={20} />}
                      <div className="ml-2">
                        <p className="text-sm font-bold text-black">
                          Status: {getStatus(event.start_date, event.end_date)}
                        </p>
                      </div>
                    </div>
                    {event.question.length <= 50 && (
                                         <div className="flex items-center">
                                         <MdQuestionAnswer size={20} color='black' />
                                         <div className="ml-2">
                    <p className="text-sm font-bold text-black">Question: {event.question}</p>
                   </div>
                   </div>
                    )}
                    {event.question.length > 50 && (
                                         <div className="flex items-start">
                                         <MdQuestionAnswer size={20} color='black' />
                                         <div className="ml-2">
                        <p className="text-sm font-bold text-black">
                          Question: {expandedQuestions[event.id] ? event.question : `${event.question.substring(0, 50)}...`}
                        </p>
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={() => toggleExpandQuestion(event.id)}
                        >
                          {expandedQuestions[event.id] ? ' Show Less' : ' Read More'}
                        </span>
                      </div>
                      </div>
                    )}
                     {event.guidelines.length <= 50 && (
                      <div className="flex items-center">
                      <MdError size={20} color='black' />
                      <div className="ml-2">
        <p className="text-sm font-bold text-black">Guidelines: {event.guidelines}</p>
        </div>
         </div>
        )}
                    {event.guidelines.length > 50 && (
                                          <div className="flex items-start">
                                          <MdError size={20} color='black' />
                                          <div className="ml-2">
                        <p className="text-sm font-bold text-black">
                          Guidelines: {expandedGuidelines[event.id] ? event.guidelines : `${event.guidelines.substring(0, 50)}...`}
                        </p>
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={() => toggleExpandGuidelines(event.id)}
                        >
                          {expandedGuidelines[event.id] ? ' Show Less' : ' Read More'}
                        </span>
                      </div>
                      </div>
                    )}
                     {event.description.length <= 50 && (

                      <div className="flex items-center">
                      <MdTextSnippet size={20} color='black' />
                      <div className="ml-2">
    <p className="text-sm font-bold text-black">Description: {event.description}</p>
  </div>
  </div>
)}
                    {event.description.length > 50 && (
                                          <div className="flex items-start">
                                          <MdTextSnippet size={20} color='black' />
                                          <div className="ml-2">
                        <p className="text-sm font-bold text-black">
                          Description: {expandedDescriptions[event.id] ? event.description : `${event.description.substring(0, 50)}...`}
                        </p>
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={() => toggleExpandDescription(event.id)}
                        >
                          {expandedDescriptions[event.id] ? ' Show Less' : ' Read More'}
                        </span>
                      </div>
                      </div>
                    )}
                    <div className="flex items-center">
                      <MdAttachMoney size={20} color='black' />
                      <div className="ml-2">
                        <p className="text-sm font-bold text-black">
                          Prize Amount: PKR {event.prizeAmount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                    <MdPeople size={20} color='black' />
        <div className="ml-2">
          <p className="text-sm font-bold text-black">
            Participants : {event.joinedParticipants}/{event.numberOfParticipants}
          </p>
        </div>
      </div>
                    
                    <div className="flex items-center">
                      <MdCategory size={20} color='black' />
                      <div className="ml-2">
                        <p className="text-sm font-bold text-black">
                          Preferred Language: {event.preferedLanguage}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
