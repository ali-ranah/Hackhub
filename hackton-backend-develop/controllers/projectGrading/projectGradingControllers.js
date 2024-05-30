/* eslint-disable no-else-return */
const db = require('../../models/projectGradingModel');
const eventsDb = require('../../models/eventsModel');
const requestHandler = require('../../utils/requestHandler');

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
    const { userId } = req.decodedToken;
    const { id } = req.params;

    // Calculate average rating
    const totalRating = [
      req.body.product_design,
      req.body.functionality,
      req.body.innovation,
      req.body.product_fit,
      req.body.extensibility,
      req.body.presentation
    ];
    const avgRating = totalRating.reduce((a, b) => a + b) / totalRating.length;

    // Prepare edited project grading object
    const editedProjectGrading = {
      product_design: req.body.product_design,
      functionality: req.body.functionality,
      project_id: id,
      innovation: req.body.innovation,
      product_fit: req.body.product_fit,
      extensibility: req.body.extensibility,
      presentation: req.body.presentation,
      judge_id: userId,
      project_event_id: req.body.project_event_id,
      judge_comments: req.body.judge_comments,
      average_rating: avgRating.toFixed(1)
    };

    // Update grading in the database
    const data = await db.updateGrading(id, editedProjectGrading);

    // Return success response
    return requestHandler.success(res, 200, 'Grade edited successfully', data);
  } catch (error) {
    // Handle errors
    return requestHandler.error(res, 500, `Server error: ${error.message}`);
  }
}



// async function handleprojectGradingPost(req, res) {
//   try {
//     const { userId } = req.decodedToken;
//     const { id } = req.params;

//     // Prepare project grading object using data sent from frontend
//     const projectGrading = {
//       project_id: id,
//       judge_id: userId,
//       project_event_id: req.body.project_event_id,
//       judge_comments: req.body.judge_comments
//       // No need for average_rating property since rubrics are not used
//     };

//     // Add grading to the database
//     const data = await db.addGrading(projectGrading);

//     // Return success response
//     return requestHandler.success(res, 201, 'Grade submitted successfully', data);
//   } catch (error) {
//     // Handle errors
//     return requestHandler.error(res, 500, `Server error: ${error.message}`);
//   }
// }

async function handleprojectGradingPost(req, res) {
  try {
    const { userId } = req.decodedToken;
    const { id } = req.params;

    // Prepare project grading object using data sent from frontend
    const projectGrading = {
      project_id: req.body.project_id,
      judge_id: userId,
      project_event_id: req.body.project_event_id,
      judge_comments: req.body.judge_comments,
    };

    // Calculate the final grade after deducting AI content and plagiarism scores
    const aiContentPercentage = req.body.aicontent; // Example AI content percentage
    const plagiarismPercentage = req.body.plagiarism; // Example plagiarism percentage
    const originalGrade = req.body.grade;
    const adjustedGrade = originalGrade * ((100 - aiContentPercentage) / 100) * ((100 - plagiarismPercentage) / 100);
    
    // Include adjusted grade in the projectGrading object
    projectGrading.average_rating = adjustedGrade;
    projectGrading.plagiarism = plagiarismPercentage;
    projectGrading.ai_content = aiContentPercentage;
 

    // Add grading to the database
    const data = await db.addGrading(projectGrading);

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

module.exports = {
  handleprojectGradingPost,
  handleGetAllProjectGrading,
  handleGetProjectGrading,
  handleProjectGradingEdit,
  handleProjectGradingDelete
};
