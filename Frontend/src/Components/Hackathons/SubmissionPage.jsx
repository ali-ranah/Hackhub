import React, { useEffect, useState } from 'react';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector and useDispatch
import { selectToken } from '../../State/Reducers/tokenSlice';
import { Button } from '@material-tailwind/react';

const SubmissionPage = () => {
  const { id } = useParams();
  const [projects, setProjects] = useState([]); // Change initial state to an empty array
  const [gradings, setGradings] = useState([]);
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await AxiosRequest.get(`/api/events/${id}/projects`, {
          headers: {
            authorization: token // Pass the authorization token in the request headers
          }
        });
        setProjects(response.data.body);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [id, token]);


  useEffect(() => {
    const fetchGradings = async () => {
      try {
        const response = await AxiosRequest.get(`/api/events/${id}/projects/grading`, {
          headers: {
            authorization: token
          }
        });
        setGradings(response.data.body);
      } catch (error) {
        console.error('Error fetching gradings:', error);
      }
    };

    fetchGradings();
  }, [id, token]);

  const handleBack = () => {
    navigate('/organizer/hackathons');
  };

  const handleClick = async (id, userId) => {
    try {
      const response = await AxiosRequest.get(`/api/events/project/${id}/${userId}`, {
        headers: {
          authorization: token
        }
      });      
      const updatedProject = response.data.body;
  
      // Update the projects state to include the updated project
      setProjects(projects.map(p => {
        if (p.id === updatedProject.id) {
          return updatedProject;
        }
        return p;
      }));
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };
  
  
  

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 text-white dark:text-white">Event Submissions</h1>
      </div>
      {projects.length === 0 ? (
        <div className='mt-10'><p className='text-white'>No Submissions Available</p></div>
      ) : (
        <>
          <div className="flex flex-col gap-6">
          {projects.map(project => (
  <div
    key={project.id}
    className="bg-white rounded-lg max-w-[80vw] overflow-x-auto shadow-md p-6 flex-row-1 items-center"
    style={{ cursor: 'pointer' }}
  >
    <h1 className="text-xl font-bold mb-4">Project Title: {project.project_title}</h1>
    <p><strong>Participant Name:</strong> {project.participant_or_team_name}</p>
    <p><strong>Project Code:</strong><pre className='text-sm text-wrap lg:text-md'>{project.project_writeups}</pre></p>
    <p><strong>Participant ID:</strong> {project.submitted_by}</p>
    <p><strong>Created At:</strong> {new Date(project.created_at).toLocaleString()}</p>
    {gradings.some(grading => grading.project_id === project.id) ? (
  // If grading exists, display the grading details
  <>
    <p><strong>Grade already exists</strong></p>
    {/* Display the grading details */}
    {gradings
      .filter(grading => grading.project_id === project.id)
      .map((grading, index) => (
        <div key={index}>
          <p><strong>Grade:</strong> {grading.average_rating}</p>
          <p><strong>AI Content:</strong> {grading.ai_content}</p>
          <p><strong>Plagiarism:</strong> {grading.plagiarism}</p>
        </div>
      ))}
  </>
) : (
                  <>
                    {project.plagiarism_score ? (
                      <>
                            <p><strong>Average Plagiarism Score:</strong> {project.plagiarism_score.plagiarismScore}</p>
                            <p><strong>AI Content:</strong> {project.plagiarism_score.aiContent}</p>
                        <Button className="bg-black text-sm mt-6" onClick={() => navigate(`/organizer/grade/${project.submitted_by}`, { state: { projectId: project.id, event_id: project.event_id, plagiarismScore: project.plagiarism_score.plagiarismScore, aiContent: project.plagiarism_score.aiContent } })}>Grade Project</Button>
                      </>
                    ) : (
                      <Button className="bg-black text-sm mt-6" onClick={() => handleClick(project.event_id, project.submitted_by)}>Check Plagiarism Score</Button>
                    )}
                  </>
                )}
  </div>
))}

          </div>
        </>
      )}
      <Button onClick={handleBack} className="bg-black text-sm mt-6">Back</Button>
    </div>
  );
};

export default SubmissionPage;
