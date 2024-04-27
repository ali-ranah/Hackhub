const db = require('../../models/projectsModel');
const grades = require('../../models/projectGradingModel');
const teamDb = require('../../models/eventTeamModel');
const requestHandler = require('../../utils/requestHandler');
const projectsModel = require('../../models/projectsModel');
const axios = require('axios');

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

async function handleprojectEntriesPost(req, res) {
  const { userId } = req.decodedToken;
  const { id } = req.params;
  const existingProject = await db.getProjectByEventAndUser(id, userId);
  if (existingProject) {
    return requestHandler.error(res, 400, 'Project already submitted');
  }
  const projectSubmit = {
    project_title: req.body.project_title,
    participant_or_team_name: req.body.participant_or_team_name,
    event_id: id,
    project_writeups: req.body.project_writeups,
    git_url: req.body.git_url,
    video_url: req.body.video_url,
    submitted_by: userId
  };
  await db
    .addProject(projectSubmit)
    .then(data => {
      return requestHandler.success(
        res,
        201,
        'Project submitted successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
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


async function checkForPlagiarism(code) {
  const encodedParams = new URLSearchParams();
  encodedParams.set('content', code);

  const options = {
    method: 'POST',
    url: 'https://ai-plagiarism-checker.p.rapidapi.com/detector/v1/',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '20782f52f7mshe68b16d38a6fb84p18b6bdjsnd56974fa2b62', // Replace with your RapidAPI key
      'X-RapidAPI-Host': 'ai-plagiarism-checker.p.rapidapi.com'
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    const plagiarismScore = response.data.average_score;

    // Using another API for content detection
    const contentDetectionOptions = {
      method: 'POST',
      url: 'https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '20782f52f7mshe68b16d38a6fb84p18b6bdjsnd56974fa2b62', // Replace with your RapidAPI key
        'X-RapidAPI-Host': 'ai-content-detector-ai-gpt.p.rapidapi.com'
      },
      data: {
        text: code
      }
    };

    const contentDetectionResponse = await axios.request(contentDetectionOptions);
    const aiContent = contentDetectionResponse.data.fakePercentage;

    return { plagiarismScore, aiContent };
  } catch (error) {
    console.error(error);
    return null;
  }
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
