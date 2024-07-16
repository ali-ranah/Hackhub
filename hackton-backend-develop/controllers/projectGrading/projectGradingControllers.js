/* eslint-disable no-else-return */
const db = require('../../models/projectGradingModel');
const eventsDb = require('../../models/eventsModel');
const requestHandler = require('../../utils/requestHandler');
const Notification = require('../../models/notificationModel')


// Project grading

async function handleProjectGradingDelete(req, res) {
  const { id } = req.params;
  await db
    .removeGrading(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Project grading deleted successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

async function handleProjectGradingEdit(req, res) {
  try {
    const { userId, name } = req.decodedToken;
    const { id } = req.params;

    // Prepare edited project grading object
    const editedProjectGrading = {
      project_id: req.body.project_id,
      judge_id: userId,
      project_event_id: req.body.project_event_id, // Assuming project_event_id is provided in the request body
      judge_comments: req.body.judge_comments,
      average_rating: req.body.average_rating, // Ensure average_rating is formatted to two decimal places
    };
    let newNotification = {
      user_id: id,
      message: `Your Grades had been updated by ${name}`,
    };

    // Add notification for project submission to the creator
    await Notification.add(newNotification);

    newNotification = {
      user_id: userId,
      message: `Grades for Project with ID ${req.body.project_id} have been updated`,
    };

    // Add notification for project submission to the creator
    await Notification.add(newNotification);
    // Update grading in the database
    const data = await db.updateGrading(req.body.project_id, editedProjectGrading);

    // Return success response
    return requestHandler.success(res, 200, 'Grade edited successfully', data);
  } catch (error) {
    // Handle errors
    return requestHandler.error(res, 500, `Server error: ${error.message}`);
  }
}





async function handleprojectGradingPost(req, res) {
  try {
    const { userId,name } = req.decodedToken;
    const { id } = req.params;

    // Prepare project grading object using data sent from frontend
    const projectGrading = {
      project_id: req.body.project_id,
      judge_id: req.body.creator,
      project_event_id: req.body.project_event_id,
      judge_comments: req.body.judge_comments,
    };
    console.log('Creator',req.body.creator);

    // Calculate the final grade after deducting AI content and plagiarism scores
    const aiContentPercentage = req.body.aicontent; // Example AI content percentage
    const plagiarismPercentage = req.body.plagiarism; // Example plagiarism percentage
    const originalGrade = req.body.grade;
    const adjustedGrade = originalGrade;
    
    // Include adjusted grade in the projectGrading object
    projectGrading.average_rating = adjustedGrade;
    projectGrading.plagiarism_score = plagiarismPercentage;
    projectGrading.ai_content = aiContentPercentage;
 

    // Add grading to the database
    const data = await db.addGrading(projectGrading);
    
    let newNotification = {
      user_id: userId,
      message: `${req.body.participant_name}'s Project graded successfully`,
    };
  
     Notification.add(newNotification)
      .then((createdNotification) => {
        console.log('Notification created:', createdNotification);
      })
      .catch((error) => {
        console.error('Error creating notification:', error);
      });
       newNotification = {
        user_id: req.body.participant_id,
        message: `Your Project had been graded by ${name}`,
      };
    
       Notification.add(newNotification)
        .then((createdNotification) => {
          console.log('Notification created:', createdNotification);
        })
        .catch((error) => {
          console.error('Error creating notification:', error);
        });
  

    // Return success response
    return requestHandler.success(res, 201, 'Grade submitted successfully', data);
  } catch (error) {
    // Handle errors
    return requestHandler.error(res, 500, `Server error: ${error.message}`);
  }
}


async function handleGetAllProjectGrading(req, res) {
  const { id } = req.params;
  await db
    .findAllGradingsByEventId(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'All project grades retrieved successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

async function handleGetProjectGrading(req, res) {
  const { projectId } = req.params;
  await db
    .findGrading(projectId)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Project grade retrieved successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

async function handleGetTopGradedProjects(req, res) {
  try {
    const limit = 10;
    // Retrieve top graded projects based on average ratings
    const topGradedProjects = await db.findTopGradedProjects(limit);

    // Return success response with the data
    return requestHandler.success(
      res,
      200,
      'Top graded projects retrieved successfully',
      topGradedProjects
    );
  } catch (error) {
    // Handle errors
    return requestHandler.error(res, 500, `Server error: ${error.message}`);
  }
}

async function handleGetTopPlagiarismAndAIContent(req, res) {
  try {
    const topPlagiarism = await db.findTopPlagiarismProject();
    const topAIContent = await db.findTopAIContentProject();

    const response = {
      topPlagiarism,
      topAIContent,
    };

    return requestHandler.success(
      res,
      200,
      'Top plagiarism and AI content projects retrieved successfully',
      response
    );
  } catch (error) {
    return requestHandler.error(res, 500, `Server error: ${error.message}`);
  }
}


module.exports = {
  handleprojectGradingPost,
  handleGetAllProjectGrading,
  handleGetProjectGrading,
  handleGetTopPlagiarismAndAIContent,
  handleGetTopGradedProjects,
  handleProjectGradingEdit,
  handleProjectGradingDelete
};
