// import React, { useState } from 'react';
// import { Input, Button, Select, Textarea } from '@material-tailwind/react';
// import { useSelector } from 'react-redux';
// import { selectToken } from '../../State/Reducers/tokenSlice';
// import { AxiosRequest } from '../Axios/AxiosRequest';
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const Organize = () => {
//   const [eventName, setEventName] = useState('');
//   const [question, setQuestion] = useState('');
//   const [guidelines, setGuidelines] = useState('');
//   const [description, setDescription] = useState('');
//   const [participants, setParticipants] = useState('');
//   const [startdate, setstartDate] = useState('');
//   const [enddate, setendDate] = useState('');
//   const [timeAllowed, setTimeAllowed] = useState('');
//   const [language, setLanguage] = useState('');
//   const [prizeAmount, setPrizeAmount] = useState('');
//   const [participantLevel, setParticipantLevel] = useState('');
//   const storedToken = localStorage.getItem('token');
//   const [isFocused, setIsFocused] = useState(false);
//   const [isAmountFocused, setIsAmountFocused] = useState(false);
//   const token = useSelector(selectToken) || storedToken;
//   const navigate = useNavigate();

//   const languageOptions = [
//     { value: 'C', label: 'C' },
//     { value: 'C++', label: 'C++' },
//     { value: 'JAVA', label: 'JAVA' },
//     { value: 'PYTHON', label: 'PYTHON' },
//   ];

//   const levelOptions = [
//     { value: 'Beginner', label: 'Beginner' },
//     { value: 'Intermediate', label: 'Intermediate' },
//     { value: 'Advance', label: 'Advance' },
//     { value: 'Expert', label: 'Expert' },
//   ];

//   function formatPrizeAmount(value, isFocused) {
//     if (!value) return '';
//     if (isFocused) return value;
//     return 'PKR' + ' ' + value;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!language) {
//       toast.error('Please Select Preferred Language');
//       return;
//     }
//     if (!participantLevel) {
//       toast.error('Please Select Participant Level');
//       return;
//     }

//     const eventData = {
//       event_title: eventName,
//       numberOfParticipants: participants,
//       start_date: startdate,
//       allowed_time: timeAllowed,
//       question: question,
//       guidelines: guidelines,
//       description: description,
//       end_date: enddate,
//       preferedLanguage: language,
//       prizeAmount: prizeAmount,
//       levelOfParticipant: participantLevel,
//     };

//     try {
//       const response = await AxiosRequest.post('/api/events/create-event', eventData, {
//         headers: {
//           authorization: token,
//         },
//       });
//       console.log('Event Created Successfully', response.data);
//       toast.success('Event Created Successfully');
//       navigate('/organizer/hackathons');
//     } catch (error) {
//       console.error(error);
//       console.log('Error', error.response, error.response.data, error.response.data.message);
//       if (error.response && error.response.data && error.response.data.message === "This event title already exists in the database, please pick a new event title!") {
//         toast.error('Event Title Already Exists');
//       } else if (error.response && error.response.data && error.response.data.message.event_title === "event_title must be between 10 to 50 characters") {
//         toast.error('Event Title Must Be Between 10 to 50 Characters');
//       } else if (error.response && error.response.data && error.response.data.message.event_description === "event_description must be between 10 to 100 characters") {
//         toast.error('Event Description Must Be Between 10 to 100 Characters');
//       } else if (error.response && error.response.data && error.response.data.message.guidelines === "guidelines must be between 10 to 100 characters") {
//         toast.error('Guidelines Must Be Between 10 to 100 Characters');
//       }
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen min-w-screen flex items-center justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
//         <ToastContainer />
//         <div className="max-w-md w-screen space-y-8 p-8 bg-white rounded-xl shadow-xl">
//           <div>
//             <h1 className="text-2xl text-center font-bold mb-4 text-black dark:text-white">Organize Hackathons</h1>
//           </div>
//           <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//             <Input
//               type="text"
//               label="Event Name"
//               value={eventName}
//               onChange={(e) => setEventName(e.target.value)}
//               size="md"
//               color="black"
//               required
//               className="focus:ring-0"
//             />
//             <Textarea
//               label="Question"
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               size="md"
//               color="primary"
//               required
//               fullWidth
//               className="focus:ring-0"
//             />
//             <Textarea
//               label="Guidelines (Optional)"
//               value={guidelines}
//               onChange={(e) => setGuidelines(e.target.value)}
//               size="md"
//               color="primary"
//               fullWidth
//               className="focus:ring-0"
//             />
//             <Textarea
//               label="Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               size="md"
//               color="primary"
//               required
//               fullWidth
//               className="focus:ring-0"
//             />

//             <Input
//               type="number"
//               label="Number of Participants"
//               value={participants}
//               onChange={(e) => setParticipants(e.target.value)}
//               color="black"
//               required
//               size="md"
//               className="focus:ring-0"
//             />
//             <Input
//               type="text"
//               label="Time Allowed (HH:MM)"
//               required
//               value={timeAllowed}
//               onChange={(e) => setTimeAllowed(e.target.value)}
//               placeholder="HH:MM"
//               color="black"
//               size="md"
//               className="focus:ring-0"
//             />

//             <Input
//               type="date"
//               label="Select Start Date"
//               value={startdate}
//               required
//               onChange={(e) => setstartDate(e.target.value)}
//               color="black"
//               size="md"
//               className="focus:ring-0"
//             />
//             <Input
//               type="date"
//               label="Select End Date"
//               value={enddate}
//               required
//               onChange={(e) => setendDate(e.target.value)}
//               color="black"
//               size="md"
//               className="focus:ring-0"
//             />
//             <Select
//               variant="outlined"
//               label="Preferred Language"
//               value={language}
//               onChange={(value) => setLanguage(value)}
//               size="md"
//               className="focus:ring-0"
//             >
//               {languageOptions.map((option) => (
//                 <Select.Option key={option.value} value={option.value}>
//                   {option.label}
//                 </Select.Option>
//               ))}
//             </Select>
//             <Input
//               type="text"
//               label="Prize Amount"
//               required
//               value={formatPrizeAmount(prizeAmount, isAmountFocused)}
//               onChange={(e) => {
//                 const newValue = e.target.value.replace(/[^\d]/g, '');
//                 setPrizeAmount(newValue);
//               }}
//               onFocus={() => setIsAmountFocused(true)}
//               onBlur={() => setIsAmountFocused(false)}
//               color="black"
//               size="md"
//               className="focus:ring-0"
//             />

//             <Select
//               variant="outlined"
//               label="Level of Participant"
//               value={participantLevel}
//               onChange={(value) => setParticipantLevel(value)}
//               size="md"
//               className="focus:ring-0"
//             >
//               {levelOptions.map((option) => (
//                 <Select.Option key={option.value} value={option.value}>
//                   {option.label}
//                 </Select.Option>
//               ))}
//             </Select>
//             <div className="flex justify-center items-center">
//               <Button
//                 type="submit"
//                 color="black"
//                 size="md"
//                 className="bg-black"
//               >
//                 Submit
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Organize;

import React, { useState } from 'react';
import { Input, Button, Select, Textarea } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import { selectToken } from '../../State/Reducers/tokenSlice';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Organize = () => {
  const [eventName, setEventName] = useState('');
  const [question, setQuestion] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState('');
  const [startdate, setstartDate] = useState('');
  const [enddate, setendDate] = useState('');
  const [allowedTime, setAllowedTime] = useState('');
  const [language, setLanguage] = useState('');
  const [prizeAmount, setPrizeAmount] = useState('');
  const [participantLevel, setParticipantLevel] = useState('');
  const storedToken = localStorage.getItem('token');
  const [isFocused, setIsFocused] = useState(false);
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const token = useSelector(selectToken) || storedToken;
  const navigate = useNavigate();

  const languageOptions = [
    { value: 'C', label: 'C' },
    { value: 'C++', label: 'C++' },
    { value: 'JAVA', label: 'JAVA' },
    { value: 'PYTHON', label: 'PYTHON' },
  ];

  const levelOptions = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advance', label: 'Advance' },
    { value: 'Expert', label: 'Expert' },
  ];

  const allowedTimeOptions = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hour = i.toString().padStart(2, '0');
      const minute = j.toString().padStart(2, '0');
      allowedTimeOptions.push({ value: `${hour}:${minute}`, label: `${hour}:${minute}` });
    }
  }

  function formatPrizeAmount(value, isFocused) {
    if (!value) return '';
    if (isFocused) return value;
    return 'PKR' + ' ' + value;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!language) {
      toast.error('Please Select Preferred Language');
      return;
    }
    if (!participantLevel) {
      toast.error('Please Select Participant Level');
      return;
    }

    const eventData = {
      event_title: eventName,
      numberOfParticipants: participants,
      start_date: startdate,
      allowed_time: allowedTime,
      question: question,
      guidelines: guidelines,
      description: description,
      end_date: enddate,
      preferedLanguage: language,
      prizeAmount: prizeAmount,
      levelOfParticipant: participantLevel,
    };

    try {
      const response = await AxiosRequest.post('/api/events/create-event', eventData, {
        headers: {
          authorization: token,
        },
      });
      console.log('Event Created Successfully', response.data);
      toast.success('Event Created Successfully');
      navigate('/organizer/hackathons');
    } catch (error) {
      console.error(error);
      console.log('Error', error.response, error.response.data, error.response.data.message);
      if (error.response && error.response.data && error.response.data.message === "This event title already exists in the database, please pick a new event title!") {
        toast.error('Event Title Already Exists');
      } else if (error.response && error.response.data && error.response.data.message.event_title === "event_title must be between 10 to 50 characters") {
        toast.error('Event Title Must Be Between 10 to 50 Characters');
      } else if (error.response && error.response.data && error.response.data.message.event_description === "event_description must be between 10 to 100 characters") {
        toast.error('Event Description Must Be Between 10 to 100 Characters');
      } else if (error.response && error.response.data && error.response.data.message.guidelines === "guidelines must be between 10 to 100 characters") {
        toast.error('Guidelines Must Be Between 10 to 100 Characters');
      }
    }
  };

  return (
    <>
      <div className="min-h-screen min-w-screen flex items-center justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer />
        <div className="max-w-md w-screen space-y-8 p-8 bg-white rounded-xl shadow-xl">
          <div>
            <h1 className="text-2xl text-center font-bold mb-4 text-black dark:text-white">Organize Hackathons</h1>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <Input
              type="text"
              label="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              size="md"
              color="black"
              required
              className="focus:ring-0"
            />
            <Textarea
              label="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              size="md"
              color="primary"
              required
              fullWidth
              className="focus:ring-0"
            />
            <Textarea
              label="Guidelines (Optional)"
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              size="md"
              color="primary"
              fullWidth
              className="focus:ring-0"
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              size="md"
              color="primary"
              required
              fullWidth
              className="focus:ring-0"
            />

            <Input
              type="number"
              label="Number of Participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              color="black"
              required
              size="md"
              className="focus:ring-0"
            />

            <Select
              variant="outlined"
              label="Allowed Time"
              value={allowedTime}
              onChange={(value) => setAllowedTime(value)}
              size="md"
              className="focus:ring-0"
            >
              {allowedTimeOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>

            <Input
              type="date"
              label="Select Start Date"
              value={startdate}
              required
              onChange={(e) => setstartDate(e.target.value)}
              color="black"
              size="md"
              className="focus:ring-0"
            />
            <Input
              type="date"
              label="Select End Date"
              value={enddate}
              required
              onChange={(e) => setendDate(e.target.value)}
              color="black"
              size="md"
              className="focus:ring-0"
            />
            <Select
              variant="outlined"
              label="Preferred Language"
              value={language}
              onChange={(value) => setLanguage(value)}
              size="md"
              className="focus:ring-0"
            >
              {languageOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
            <Input
              type="text"
              label="Prize Amount"
              required
              value={formatPrizeAmount(prizeAmount, isAmountFocused)}
              onChange={(e) => {
                const newValue = e.target.value.replace(/[^\d]/g, '');
                setPrizeAmount(newValue);
              }}
              onFocus={() => setIsAmountFocused(true)}
              onBlur={() => setIsAmountFocused(false)}
              color="black"
              size="md"
              className="focus:ring-0"
            />

            <Select
              variant="outlined"
              label="Level of Participant"
              value={participantLevel}
              onChange={(value) => setParticipantLevel(value)}
              size="md"
              className="focus:ring-0"
            >
              {levelOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>

            <Button type="submit" fullWidth>
              Create Event
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Organize;
