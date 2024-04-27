import React, { useState } from 'react';
import { useLocation,useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector and useDispatch
import { selectToken } from '../../State/Reducers/tokenSlice';
import { AxiosRequest } from '../Axios/AxiosRequest';

const GradeProject = () => {
  const location = useLocation();
  const {submissionId} = useParams();
  const {projectId, event_id, plagiarismScore, aiContent } = location.state;
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;

  const [comments, setComments] = useState('');
  const [averageRating, setAverageRating] = useState('');

  const handleGradeProject = async () => {
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
        alert('Grade submitted successfully');
        // Handle success
      } catch (error) {
      console.error('Error grading project:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h1>Grade Project</h1>
      <input
        type="text"
        placeholder="Comments"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />
      <input
        type="number"
        placeholder="Average Rating"
        value={averageRating}
        onChange={(e) => setAverageRating(e.target.value)}
      />
      <button onClick={handleGradeProject}>Grade Project</button>
    </div>
  );
};

export default GradeProject;
