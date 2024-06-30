import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { selectToken } from '../../State/Reducers/tokenSlice';

const EventDetails = () => {
  const {eventId } = useParams();
  const [eventDetails, setEventDetails] = useState([]);
  const [gradingData, setGradingData] = useState([]);
  const [topGradedPersons, setTopGradedPersons] = useState([]);
  const [topPlagiarismAndAIContent, setTopPlagiarismAndAIContent] = useState({});
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const [eventResponse, gradingResponse, topGradedResponse, topPlagiarismAndAIContentResponse] = await Promise.all([
          AxiosRequest.get(`/api/events/${eventId}`, {
            headers: {
              authorization: token,
            },
          }),
          AxiosRequest.get(`/api/events/${eventId}/projects/grading`, {
            headers: {
              authorization: token,
            },
          }),
          AxiosRequest.get(`/api/events/${eventId}/projects/top-graded`, {
            headers: {
              authorization: token,
            },
          }),
          AxiosRequest.get(`/api/events/${eventId}/projects/top-plagiarism-ai-content`, {
            headers: {
              authorization: token,
            },
          }),
        ]);

        const eventDetailsData = eventResponse.data.body;
        const gradingData = gradingResponse.data.body;
        const topGradedPersons = topGradedResponse.data.body;
        const topPlagiarismAndAIContent = topPlagiarismAndAIContentResponse.data.body;

        console.log('topGraded', topGradedPersons);
        console.log('gradingData', gradingData);
        console.log('EventData', eventDetailsData);
        console.log('topPlagiarismAndAIContent', topPlagiarismAndAIContent);

        setEventDetails(eventDetailsData);
        setGradingData(gradingData);
        setTopGradedPersons(topGradedPersons);
        setTopPlagiarismAndAIContent(topPlagiarismAndAIContent);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [eventId, token]);

  if (!eventDetails.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#14082c] justify-center text-center items-center p-4">
      {eventDetails.map(event => (
        <div key={event.id} className="max-w-3xl bg-white p-6 rounded-lg shadow-md w-full mb-6">
          <h1 className="text-3xl font-bold mb-4">{event.event_title}</h1>
          <p className="text-lg text-gray-800">{event.description}</p>
          <div className="mt-4">
            <p className="text-gray-700">Start Date: {new Date(event.start_date).toLocaleDateString()}</p>
            <p className="text-gray-700">End Date: {new Date(event.end_date).toLocaleDateString()}</p>
            <p className="text-gray-700">Organized By: {event.organizer_name}</p>
          </div>
        </div>
      ))}
      {gradingData.length > 0 && (
        <div className="max-w-3xl bg-white p-6 rounded-lg shadow-md w-full mb-6">
          <h2 className="text-xl font-semibold mb-2">Grading Information</h2>
          {gradingData.map(grading => (
            <div key={grading.project_id} className="mt-2">
              <p className="text-black">Project ID: {grading.project_id}</p>
              <p className="text-black">Average Rating: {grading.average_rating}</p>
              <p className="text-black">Participant Name: {grading.participant_or_team_name}</p>
              <p className="text-black">Plagiarism Score: {grading.plagiarism_score}</p>
              <p className="text-black">Judge Comments: {grading.judge_comments}</p>
            </div>
          ))}
        </div>
      )}
      {topGradedPersons.length > 0 && (
        <div className="max-w-3xl bg-white p-6 rounded-lg shadow-md w-full mb-6">
          <h2 className="text-xl font-semibold mb-2">Top Graded Persons</h2>
          <ul className="list-disc list-inside">
          {topGradedPersons.map(person => (
  <li key={person.project_id}>
    Project ID: {person.project_id} - {person.participant_or_team_name} - Grade: {person.average_rating}
  </li>
))}
          </ul>
        </div>
      )}
      {topPlagiarismAndAIContent.topPlagiarism && topPlagiarismAndAIContent.topPlagiarism.length>0 && (
        <div className="max-w-3xl bg-white p-6 rounded-lg shadow-md w-full mb-6">
          <h2 className="text-xl font-semibold mb-2">Top Plagiarism Project</h2>
          <p className="text-black">Project ID: {topPlagiarismAndAIContent.topPlagiarism[0].project_id}</p>
          <p className="text-black">Plagiarism Score: {topPlagiarismAndAIContent.topPlagiarism[0].plagiarism_score}</p>
        </div>
      )}
      {topPlagiarismAndAIContent.topAIContent && topPlagiarismAndAIContent.topAIContent.length>0 && (
        <div className="max-w-3xl bg-white p-6 rounded-lg shadow-md w-full mb-6">
          <h2 className="text-xl font-semibold mb-2">Top AI Content Project</h2>
          <p className="text-black">Project ID: {topPlagiarismAndAIContent.topAIContent[0].project_id}</p>
          <p className="text-black">AI Content Score: {topPlagiarismAndAIContent.topAIContent[0].ai_content}</p>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
