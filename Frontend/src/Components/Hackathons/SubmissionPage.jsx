// import React, { useEffect, useState } from 'react';
// import { AxiosRequest } from '../Axios/AxiosRequest';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { selectToken } from '../../State/Reducers/tokenSlice';
// import { Button } from '@material-tailwind/react';
// import { PacmanLoader, RotateLoader } from 'react-spinners'; // Import the loader component from react-spinners

// const SubmissionPage = () => {
//   const { id } = useParams();
//   const [projects, setProjects] = useState([]);
//   const [gradings, setGradings] = useState([]);
//   const storedToken = localStorage.getItem('token');
//   const token = useSelector(selectToken) || storedToken;
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false); // State to manage loading state

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setLoading(true); // Set loading state to true when fetching projects
//         const response = await AxiosRequest.get(`/api/events/${id}/projects`, {
//           headers: {
//             authorization: token
//           }
//         });
//         setProjects(response.data.body);
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//       } finally {
//         setLoading(false); // Set loading state to false after fetching completes (whether success or error)
//       }
//     };

//     fetchProjects();
//   }, [id, token]);


//   useEffect(() => {
//     const fetchGradings = async () => {
//       try {
//         setLoading(true); // Set loading state to true when fetching gradings
//         const response = await AxiosRequest.get(`/api/events/${id}/projects/grading`, {
//           headers: {
//             authorization: token
//           }
//         });
//         setGradings(response.data.body);
//       } catch (error) {
//         console.error('Error fetching gradings:', error);
//       } finally {
//         setLoading(false); // Set loading state to false after fetching completes (whether success or error)
//       }
//     };

//     fetchGradings();
//   }, [id, token]);

//   const handleBack = () => {
//     navigate('/organizer/hackathons');
//   };

  
//   const handleGradeButtonClick = (submissionId, projectId, event_id, plagiarismScore, aiContent,name,participant_id) => {
//     navigate(`/organizer/grade/${submissionId}`, {
//       state: {
//         projectId,
//         event_id,
//         plagiarismScore,
//         aiContent,
//         name,
//         participant_id
//       }
//     });
//   };

//   const handleEditButtonClick = (event) => {

//   }
  
//   return (
//     <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
//       <div className="flex items-center justify-center">
//         <h1 className="text-2xl font-bold mb-4 text-white dark:text-white">Event Submissions</h1>
//       </div>
//       {loading ? (
//         <div className="flex items-center justify-center mb-[8vh] mt-[8vh]">
//           <RotateLoader color="#ffffff" loading={loading} size={16} />
//         </div>
//       ) : (
//         <>
//           <div className="flex flex-col gap-6">
//             {projects.length === 0 ? (
//               <div className='mt-10'><p className='text-white'>No Submissions Available</p></div>
//             ) : (
//               projects.map(project => (
//                 <div
//                   key={project.id}
//                   className="bg-white rounded-lg max-w-[80vw] overflow-x-auto shadow-md p-6 flex-row-1 items-center"
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <h1 className="text-xl font-bold mb-4">Project Title: {project.project_title}</h1>
//                   <p><strong>Participant Name:</strong> {project.participant_or_team_name}</p>
//                   <p><strong>Project Code:</strong><pre className='text-sm text-wrap lg:text-md'>{project.project_writeups}</pre></p>
//                   <p><strong>Participant ID:</strong> {project.submitted_by}</p>
//                   <p><strong>Created At:</strong> {new Date(project.created_at).toLocaleString()}</p>
//                   {gradings.some(grading => grading.project_id === project.id) ? (
//                     // If grading exists, display the grading details
//                     <>
//                       <p><strong>Grade already exists</strong></p>
//                       {/* Display the grading details */}
//                       {gradings
//                         .filter(grading => grading.project_id === project.id)
//                         .map((grading, index) => (
//                           <div key={index}>
//                             <p><strong>Grade:</strong> {grading.average_rating}</p>
//                             <p><strong>Comments:</strong> {grading.judge_comments}</p>
//                             <p><strong>AI Content:</strong> {grading.ai_content}</p>
//                             <p><strong>Plagiarism:</strong> {grading.plagiarism_score}</p>
//                           </div>
//                         ))}
//                     </>
//                   ) : (
//                     <>
//                       {project.plagiarism_score && (
//                         <>
//                           <p><strong>Average Plagiarism Score:</strong> {project.plagiarism_score.plagiarismScore}</p>
//                           <p><strong>AI Content:</strong> {project.plagiarism_score.aiContent}</p>
//                           <div className='flex items-center justify-center'>
//                             <Button className="bg-black text-sm mt-6" onClick={() => handleGradeButtonClick(project.submitted_by, project.id, project.event_id, project.plagiarism_score.plagiarismScore, project.plagiarism_score.aiContent,project.participant_or_team_name,project.submitted_by)}>Grade Project</Button>
//                           </div>
//                         </>
//                       ) 
//                       // : (
//                       //   <div className='flex items-center justify-center'>
//                       //     <Button className="bg-black text-sm mt-6" onClick={() => handleClick(project.event_id, project.submitted_by)}>Check Plagiarism Score</Button>
//                       //   </div>
//                       // )
//                       }
//                     </>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         </>
//       )}
//       <Button onClick={handleBack} className="bg-black text-sm mt-6">Back</Button>
//     </div>
//   );
// };

// export default SubmissionPage;



import React, { useEffect, useState } from 'react';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectToken } from '../../State/Reducers/tokenSlice';
import { Button } from '@material-tailwind/react';
import { PacmanLoader, RotateLoader } from 'react-spinners'; // Import the loader component from react-spinners

const SubmissionPage = () => {
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [gradings, setGradings] = useState([]);
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State to manage loading state

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true); // Set loading state to true when fetching projects
        const response = await AxiosRequest.get(`/api/events/${id}/projects`, {
          headers: {
            authorization: token
          }
        });
        setProjects(response.data.body);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false); // Set loading state to false after fetching completes (whether success or error)
      }
    };

    fetchProjects();
  }, [id, token]);


  useEffect(() => {
    const fetchGradings = async () => {
      try {
        setLoading(true); // Set loading state to true when fetching gradings
        const response = await AxiosRequest.get(`/api/events/${id}/projects/grading`, {
          headers: {
            authorization: token
          }
        });
        setGradings(response.data.body);
      } catch (error) {
        console.error('Error fetching gradings:', error);
      } finally {
        setLoading(false); // Set loading state to false after fetching completes (whether success or error)
      }
    };

    fetchGradings();
  }, [id, token]);

  const handleBack = () => {
    navigate('/organizer/hackathons');
  };

  const handleGradeButtonClick = (submissionId, projectId, event_id, plagiarismScore, aiContent, name, participant_id) => {
    navigate(`/organizer/grade/${submissionId}`, {
      state: {
        projectId,
        event_id,
        plagiarismScore,
        aiContent,
        name,
        participant_id
      }
    });
  };

  const handleEditButtonClick = (submissionId,projectId,event_id) => {
    const grading = gradings.find(grading => grading.project_id === projectId);
    if (grading) {
      navigate(`/organizer/grade/${projectId}`, {
        state: {
          submissionId,
          projectId,
          event_id,
        }
      });
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 text-white dark:text-white">Event Submissions</h1>
      </div>
      {loading ? (
        <div className="flex items-center justify-center mb-[8vh] mt-[8vh]">
          <RotateLoader color="#ffffff" loading={loading} size={16} />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {projects.length === 0 ? (
              <div className='mt-10'><p className='text-white'>No Submissions Available</p></div>
            ) : (
              projects.map(project => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg max-w-[80vw] overflow-x-auto shadow-md p-6 flex-row-1 items-center"
                  style={{ cursor: 'pointer' }}
                >
                  <h1 className="text-xl font-bold mb-4">Project Title: {project.project_title}</h1>
                  <p><strong>Participant Name:</strong> {project.participant_or_team_name}</p>
                  <p><strong>Project ID:</strong> {project.id}</p>
                  <p><strong>Project Code:</strong><pre className='text-sm text-wrap lg:text-md'>{project.project_writeups}</pre></p>
                  <p><strong>Participant ID:</strong> {project.submitted_by}</p>
                  <p><strong>Created At:</strong> {new Date(project.created_at).toLocaleString()}</p>
                  {gradings.some(grading => grading.project_id === project.id) && (
                    // If grading exists, display the grading details
                    <>
                      <p><strong>Grade already exists</strong></p>
                      {/* Display the grading details */}
                      {gradings
                        .filter(grading => grading.project_id === project.id)
                        .map((grading, index) => (
                          <div key={index}>
                            <p><strong>Grade:</strong> {grading.average_rating}</p>
                            <p><strong>Comments:</strong> {grading.judge_comments}</p>
                            <p><strong>AI Content:</strong> {grading.ai_content}</p>
                            <p><strong>Plagiarism:</strong> {grading.plagiarism_score}</p>
                            <div className='flex items-center justify-center'>
                            <Button className="bg-black text-sm mt-2" onClick={() => handleEditButtonClick(project.submitted_by,project.id,project.project_event_id)}>Edit Grade</Button>
                            </div>
                          </div>
                        ))}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
      <Button onClick={handleBack} className="bg-black text-sm mt-6">Back</Button>
    </div>
  );
};

export default SubmissionPage;

