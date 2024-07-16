const db = require('../../models/projectsModel');
const grades = require('../../models/projectGradingModel');
const teamDb = require('../../models/eventTeamModel');
const requestHandler = require('../../utils/requestHandler');
const projectsModel = require('../../models/projectsModel');
const axios = require('axios');
require("dotenv").config();
const Notification = require('../../models/notificationModel')


// Project Submissions requirements

async function handleProjectEntriesDelete(req, res) {
  const { id } = req.params;
  await db
    .removeProject(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Project submission deleted successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

async function handleProjectEntriesEdit(req, res) {
  const { userId } = req.decodedToken;
  const { id } = req.params;
  const projectSubmit = {
    project_title: req.body.project_title,
    participant_or_team_name: req.body.participant_or_team_name,
    event_id: req.body.event_id,
    project_writeups: req.body.project_writeups,
    git_url: req.body.git_url,
    video_url: req.body.video_url,
    submitted_by: userId
  };
  await db
    .updateProject(id, projectSubmit)
    .then(data => {
      return requestHandler.success(
        res,
        201,
        'Project edited successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

// async function handleprojectEntriesPost(req, res) {
//   const { userId } = req.decodedToken;
//   const { id } = req.params;
//   const existingProject = await db.getProjectByEventAndUser(id, userId);
//   if (existingProject) {
//     return requestHandler.error(res, 400, 'Project already submitted');
//   }
//   const projectSubmit = {
//     project_title: req.body.project_title,
//     participant_or_team_name: req.body.participant_or_team_name,
//     event_id: id,
//     project_writeups: req.body.project_writeups,
//     submitted_by: userId
//   };
//   let newNotification = {
//     user_id: userId,
//     message: `Project submitted successfully`,
//   };

//    Notification.add(newNotification)
//     .then((createdNotification) => {
//       console.log('Notification created:', createdNotification);
//     })
//     .catch((error) => {
//       console.error('Error creating notification:', error);
//     });

//      newNotification = {
//       user_id: req.body.creator,
//       message: `Project submitted successfully by ${userId}`,
//     };
  
//      Notification.add(newNotification)
//       .then((createdNotification) => {
//         console.log('Notification created:', createdNotification);
//       })
//       .catch((error) => {
//         console.error('Error creating notification:', error);
//       });
//   await db
//     .addProject(projectSubmit)
//     .then(data => {
//       return requestHandler.success(
//         res,
//         201,
//         'Project submitted successfully',
//         data
//       );
//     })
//     .catch(error => {
//       return requestHandler.error(res, 500, ` server error ${error.message}`);
//     });
// }

async function checkForPlagiarism(code) {
  if (!code) {
    return { plagiarismScore: '0.00', aiContent: '0.00' };
  }
  const encodedParams = new URLSearchParams();
  encodedParams.set('content', code);

  const options = {
    method: 'POST',
    url: 'https://ai-plagiarism-checker.p.rapidapi.com/detector/v1/',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': process.env.Plagiarism_Key, // Replace with your RapidAPI key
      'X-RapidAPI-Host': 'ai-plagiarism-checker.p.rapidapi.com'
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    let plagiarismScore = response.data.average_score;

    // Using another API for content detection
    const contentDetectionOptions = {
      method: 'POST',
      url: 'https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.AI_CONTENT_KEY, // Replace with your RapidAPI key
        'X-RapidAPI-Host': 'ai-content-detector-ai-gpt.p.rapidapi.com'
      },
      data: {
        text: code
      }
    };

    const contentDetectionResponse = await axios.request(contentDetectionOptions);
    let aiContent = contentDetectionResponse.data.fakePercentage;
    
    // plagiarismScore = parseFloat(plagiarismScore).toFixed(2);
    // aiContent = parseFloat(aiContent).toFixed(2);

    // if (isNaN(plagiarismScore)) {
    //   plagiarismScore = parseFloat(0).toFixed(2);
    // }
    // if(isNaN(aiContent)){
    //   aiContent = parseFloat(0).toFixed(2);
    // }
    plagiarismScore = parseFloat(plagiarismScore);
aiContent = parseFloat(aiContent);

// Ensure values are capped at maximum 100
plagiarismScore = Math.min(100, plagiarismScore);
aiContent = Math.min(100, aiContent);

// Handle NaN cases and ensure formatting to two decimal places
if (isNaN(plagiarismScore)) {
  plagiarismScore = 0;
}
if (isNaN(aiContent)) {
  aiContent = 0;
}

// Format to two decimal places
plagiarismScore = plagiarismScore.toFixed(2);
aiContent = aiContent.toFixed(2);

    return { plagiarismScore, aiContent };
  } catch (error) {
    console.error(error);
    return null;
  }
}


async function handleprojectEntriesPost(req, res) {
  try {
    const { userId, name } = req.decodedToken;
    const { id } = req.params;
    const existingProject = await db.getProjectByEventAndUser(id, userId);

    if (existingProject) {
      return requestHandler.error(res, 400, 'Project already submitted');
    }

    // Prepare project submission data
    const projectSubmit = {
      project_title: req.body.project_title,
      participant_or_team_name: req.body.participant_or_team_name,
      event_id: id,
      project_writeups: req.body.project_writeups,
      submitted_by: userId,
      output:req.body.output
    };

    // Add project submission to the database
    const addedProject = await db.addProject(projectSubmit);
    console.log('Project added:', addedProject[0]);

    // Prepare notifications
    let newNotification = {
      user_id: userId,
      message: 'Project submitted successfully',
    };

    // Add notification for project submission
    await Notification.add(newNotification);

    // Notify the creator of the project submission
    newNotification = {
      user_id: req.body.creator,
      message: `Project submitted successfully by ${name}`,
    };

    // Add notification for project submission to the creator
    await Notification.add(newNotification);
console.log('Project writeups',req.body.project_writeups);
    const plagiarism = await checkForPlagiarism(req.body.project_writeups);
    console.log('Plagiarism', plagiarism);
    const {plagiarismScore,aiContent} = plagiarism;

    if (plagiarismScore === null && aiContent === null) {
      return requestHandler.error(res, 500, 'Error checking for plagiarism');
    }

    const projectGrading = {
      project_id: addedProject[0],
      judge_id: userId,
      project_event_id: id,
      judge_comments: 'Automatically Graded',
      average_rating: 0, // Initialize average_rating
      plagiarism_score: plagiarismScore,
      ai_content: aiContent,
    };

    // Calculate adjusted grade based on plagiarism and AI content scores
    if (plagiarismScore > 50 || aiContent > 50) {
      projectGrading.average_rating = 0;
    }else {
      // Calculate average rating out of 100
      let calculatedRating = ((100 - plagiarismScore) + (100 - aiContent)) / 2;
      // Ensure calculatedRating is within range 0 to 100
      calculatedRating = Math.max(0, Math.min(100, calculatedRating));
      // Assign to project grading object
      projectGrading.average_rating = calculatedRating;
    }
    console.log('Project Grading',projectGrading);
    newNotification = {
      user_id: userId,
      message: `Your Project had been Automatically Graded by ${name}`,
    };
    // Add notification for project submission to the creator
    await Notification.add(newNotification);
    newNotification = {
      user_id: req.body.creator,
      message: `Project with ID ${addedProject[0]} had been Automatically graded`,
    };

    // Add notification for project submission to the creator
    await Notification.add(newNotification);
    // Add grading to the database
    const addedGrading = await grades.addGrading(projectGrading);

    // Return success response with project submission data
    return requestHandler.success(res, 201, 'Project submitted successfully', addedProject);
  } catch (error) {
    // Handle errors
    return requestHandler.error(res, 500, `Server error: ${error.message}`);
  }
}

async function handleGetAllProjectEntries(req, res) {
  const { id } = req.params;
  try {
    const allSubmissions = await db.findAllProjectsByEventId(id);
    const projectGrades = await grades.findAllGradingsByEventId(id);
    const eventTeam = await teamDb.getTeam(id);

    const eventJudges = await eventTeam.filter(
      mate => mate.role_type === 'judge'
    );
    /**
     * Function to calculate total score for each project
     *
     * @param {*} submissions
     * @param {*} scores
     * @returns
     */
    const processedData = async (submissions, scores, judges) => {
      await submissions.map(submit => {
        const submittedProject = submit;
        submittedProject.average_rating = 0;
        submittedProject.acted_judges = 0;
        submittedProject.number_of_judges = judges.length;
        return scores.map(mark => {
          if (
            submittedProject.event_id === mark.project_event_id &&
            submittedProject.id === mark.project_id &&
            mark.judge_id
          ) {
            submittedProject.acted_judges += 1;
            submittedProject.average_rating += mark.average_rating;
            submittedProject.average_rating /= submittedProject.acted_judges;
          }
          return submittedProject;
        });
      });
      return submissions;
    };
    const allProjectScores = await processedData(
      allSubmissions,
      projectGrades,
      eventJudges
    );
    return requestHandler.success(
      res,
      200,
      'All Project submissions retrieved successfully',
      allProjectScores
    );
  } catch (error) {
    return requestHandler.error(res, 500, ` server error ${error.message}`);
  }
}

async function handleGetProjectEntry(req, res) {
  const { userId } = req.decodedToken;
  const { id } = req.params;
  console.log(userId);
  await projectsModel.getProjectByEventAndUser(id,userId)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Project submission retrieved successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}




async function handleGetProjectEntryWithScores(req, res) {
  try {
    const { id,userId } = req.params;
    console.log(userId);

    // Get project submission by event and user
    const project = await projectsModel.getProjectByEventAndUser(id, userId);

    // Check code for plagiarism
    // const plagiarismScore = await checkForPlagiarism(project.project_writeups);
    const plagiarismScore = await checkForPlagiarism(project.project_writeups);


    if (plagiarismScore === null) {
      return requestHandler.error(res, 500, 'Error checking for plagiarism');
    }

    // Add plagiarism score to the project data
    project.plagiarism_score = plagiarismScore;

    // Return success response with project data and plagiarism score
    return requestHandler.success(
      res,
      200,
      'Project submission retrieved successfully',
      project
    );
  } catch (error) {
    // Handle errors
    return requestHandler.error(res, 500, `Server error: ${error.message}`);
  }
}


module.exports = {
  handleprojectEntriesPost,
  handleGetAllProjectEntries,
  handleGetProjectEntry,
  handleProjectEntriesEdit,
  handleGetProjectEntryWithScores,
  handleProjectEntriesDelete
};
