import React, { useState } from 'react';
import { useLocation,useNavigate,useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector and useDispatch
import { selectToken } from '../../State/Reducers/tokenSlice';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { ToastContainer, toast } from 'react-toastify';
import {Input,Button} from '@material-tailwind/react';
import {selectSelectedRole} from "../../State/Reducers/roleSlice"


const GradeProject = () => {
  const location = useLocation();
  const {submissionId} = useParams();
  const { projectId, event_id, plagiarismScore, aiContent } = location.state || {};
  console.log('Location State',location.state);
  console.log('VALUES IN STATE',projectId,event_id,plagiarismScore,aiContent);
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const storedRole = localStorage.getItem('selectedRole');
  const role = useSelector(selectSelectedRole) || storedRole; 
  const navigate = useNavigate();

  const [comments, setComments] = useState('');
  const [averageRating, setAverageRating] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const id = submissionId;
      const response = await AxiosRequest.post(`/api/events/projects/${id}/grading`, {
        project_id: projectId,
        project_event_id: event_id,
        judge_comments: comments,
        aicontent: aiContent,
        plagiarism: plagiarismScore,
        grade: averageRating,
      }, {
        headers: {
          authorization: token
        }
      });
      console.log('Reponse',response)
      if(response && response.data){
      toast.success('Grade submitted successfully');    
      setTimeout(() => {
        navigate(`/organizer/hackathons`);
      }, 3000);  
      }
    } catch (error) {
      console.error('Error grading project:', error);
      toast.error('Error grading project:');
    }
  };
  

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
                  <ToastContainer />
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-xl">
    <div className="flex items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white"> Grade Project</h1>
    </div>
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <Input
        type="text"
        label="Comments"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        required   
        size="md"
        color='black'
        variant='outlined'
        className="focus:ring-0"
      />
      <Input
        type="number"
        label="Average Rating"
        value={averageRating}
        onChange={(e) => setAverageRating(e.target.value)}
        required   
        size="md"
        color='black'
        variant='outlined'
        className="focus:ring-0"
      />
      <div className='flex items-center justify-center'>
      <Button type="submit" color="black"  size="lg">Grade Project</Button>
      </div>
      </form>
      </div>
    </div>
  );
};

export default GradeProject;
