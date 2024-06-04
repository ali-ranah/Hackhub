import React, { useState } from 'react';
import { Input,Button,Select,Textarea } from '@material-tailwind/react';
import { useSelector} from 'react-redux'; // Import useSelector and useDispatch
import { selectToken } from '../../State/Reducers/tokenSlice';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { toast,ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Organize = () => {
  const [eventName, setEventName] = useState('');
  const [question, setQuestion] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState('');
  const [startdate, setstartDate] = useState('');
  const [enddate, setendDate] = useState('');
  const [timeAllowed, setTimeAllowed] = useState('');
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
  ]

  function formatTime(value, isFocused) {
    if (!value) return '';
    if (isFocused) return value;
    return value + (parseInt(value) === 1 ? ' hour' : ' hours');
  }
  function formatPrizeAmount(value, isFocused) {
    if (!value) return '';
    if (isFocused) return value;
    return 'PKR'+' '+ value ;
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!language) {
      toast.error('Please Select Preferred Language');
      return;
    }
    if (!participantLevel) {
      toast.error('Please Select Participant Level');
      return;
    }

console.log("Form submission",eventName,question,guidelines,description,participants,startdate,enddate,timeAllowed,language,prizeAmount,participantLevel)
const eventData = {
  event_title: eventName,
  numberOfParticipants: participants,
  start_date: startdate,
  allowed_time: timeAllowed,
  question:question,
  guidelines:guidelines,
  description:description,
  end_date: enddate,
  preferedLanguage: language,
  prizeAmount: prizeAmount,
  levelOfParticipant: participantLevel
};

try {
  console.log("Token",token);
  console.log("Time Allowed",eventData.allowed_time);

  const response = await AxiosRequest.post('/api/events/create-event', eventData, {
    headers: {
      authorization: token // Pass the authorization token in the request headers
    }
  });
  console.log('Event Created Successfully',response.data); // Log the response from the backend
  toast.success('Event Created Successfully');
  navigate('/organizer/hackathons')
} catch (error) {
  console.error(error); // Log any errors
  console.log('Error',error.response, error.response.data,error.response.data.message); // Log any errors
  if (error.response && error.response.data && error.response.data.message === "This event title already exists in the database, please pick a new event title!") {
    toast.error('Event Title Already Exists');
  }
  else if (error.response && error.response.data && error.response.data.message.event_title === "event_title must be between 10 to 50 characters") {
    toast.error('Event Title Must Be Between 10 to 50 Characters');
  }
  else if (error.response && error.response.data && error.response.data.message.event_description === "event_description must be between 10 to 100 characters") {
    toast.error('Event Description Must Be Between 10 to 100 Characters');
  }
  else if (error.response && error.response.data && error.response.data.message.guidelines === "guidelines must be between 10 to 100 characters") {
    toast.error('Guidelines Must Be Between 10 to 100 Characters');
  }

}
  };

  return (
    <>
      <div className="min-h-screen min-w-screen flex items-center justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
       <ToastContainer/> 
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
<Input
  type="text"
  label="Time Allowed"
  required
  value={formatTime(timeAllowed, isFocused)}
  onChange={(e) => {
    const newValue = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
    if (/^\d{0,2}$/.test(newValue) && !/^0{1,2}$/.test(newValue)) {
      setTimeAllowed(newValue);
    }
  }}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  color="black"
  size="md"
  className="focus:ring-0"
/>


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
  onChange={(value) => setLanguage(value)} // Update the state with the selected value
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
    const newValue = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
      setPrizeAmount(newValue);

  }}  onFocus={() => setIsAmountFocused(true)}
  onBlur={() => setIsAmountFocused(false)}
  color="black"
  size="md"
  className="focus:ring-0"
/>

<Select
  variant="outlined"
  label="Level of Participant"
  value={participantLevel}
  onChange={(value) => setParticipantLevel(value)} // Update the state with the selected value
  size="md"
  className="focus:ring-0"
  >
  {levelOptions.map((option) => (
    <Select.Option key={option.value} value={option.value}>
      {option.label}
    </Select.Option>
  ))}
</Select> 
            <div className='flex justify-center items-center'>
              <Button
                type="submit"
                color="black"
                size="md"
                className='bg-black'
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Organize;
