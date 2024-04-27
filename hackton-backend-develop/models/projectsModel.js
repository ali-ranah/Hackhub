const db = require('../data/dbConfig');

// project entries models
async function addProject(project) {
  const submittedProject = await db('project_entries')
    .insert(project)
    .returning('*');
  return submittedProject;
}

async function findProjectTitle(projectTitle) {
  const submitProject = await db('project_entries')
    .where({ project_title: projectTitle })
    .returning('*');
  return submitProject;
}
async function getProjectByEventAndUser(eventId, userId) {
  const project = await db('project_entries')
    .where({
      event_id: eventId,
      submitted_by: userId
    })
    .first();
  return project;
}

async function findAllProjectsByEventId(id) {
  const foundAllSubmissions = await db('project_entries')
    .where({
      event_id: id
    })
    .returning('*');
  return foundAllSubmissions;
}
// async function findProject(userId) {
//   const foundSubmission = await db('project_entries')
//     .where({
//       submitted_by: userId
//     })
//     .returning('*');
//     return foundSubmission;
// }

async function findProject(userId) {
  try {
    const foundSubmission = await db('project_entries')
      .where({
        submitted_by: userId
      });
    return foundSubmission;
  } catch (error) {
    // Handle the error, e.g., log it or return an error message
    console.error('Error finding project:', error);
    return null; // Or throw an error
  }
}


async function updateProject(id, project) {
  const updateSubmission = await db('project_entries')
    .where({ id })
    .update(project)
    .returning('*');
  return updateSubmission;
}
async function removeProject(id) {
  const deletedSubmission = await db('project_entries')
    .where({ id })
    .delete();
  return deletedSubmission;
}

module.exports = {
  // Project entries models
  addProject,
  findProject,
  findAllProjectsByEventId,
  updateProject,
  removeProject,
  findProjectTitle,
  getProjectByEventAndUser
};
