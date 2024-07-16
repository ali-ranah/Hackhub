const db = require('../../models/eventParticipantsModel');
const requestHandler = require('../../utils/requestHandler');
const Notification = require('../../models/notificationModel')


async function handleEventsGetById(req, res) {
  const { id } = req.params;
  await db
    .getByEventId(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Participant(s) retrieved successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 404, `Event Not Found ${error.message}`);
    });
}

async function handleEventRegistration(req, res) {
  const { userId } = req.decodedToken;
  const { id } = req.params;

  // Check the current number of participants for the event
  const numberOfParticipants = await db.checkParticipants(id);

  // Fetch the event details to get the maximum number of participants allowed
  const event = await db.getEventById(id);


  console.log("Number of participants", numberOfParticipants);
  console.log("Event Data is", event.numberOfParticipants);
  
  if (numberOfParticipants >= event.numberOfParticipants) {
    return requestHandler.error(res, 400, 'Event is full');
  }
  
  const newNotification = {
    user_id: userId,
    message: `Event ${event.event_title} joined successfully`,
  };

   Notification.add(newNotification)
    .then((createdNotification) => {
      console.log('Notification created:', createdNotification);
    })
    .catch((error) => {
      console.error('Error creating notification:', error);
    });
  // Add participant if there is still space
  await db
    .addCredentials({
      user_id: userId,
      event_id: id,
      question: req.body.question,
      guidelines: req.body.guidelines,
      description: req.body.description
    })
    .then(data => {
      return requestHandler.success(
        res,
        201,
        'Event registered successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(
        res,
        500,
        `Internal server error ${error.message}`
      );
    });
}



async function handleEventDelete(req, res) {
  const { userId } = req.decodedToken;
  const { id } = req.params;
  await db
    .remove(userId, id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Event deleted successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(
        res,
        500,
        `Internal server error ${error.message}`
      );
    });
}

async function handleSpecificEventsUserSignedFor (req, res) {
  try {
    // const { perPage } = req.query;
    // const { currentPage } = req.query;
    const { id } = req.params;
    const { userId } = req.decodedToken;
    const registeredEvents = await db.getByUserIdAndEventId( userId,id);
    return requestHandler.success(
      res,
      200,
      'Retrieved events registered by user successfully',
      registeredEvents
    );
  } catch (error) {
    return requestHandler.error(
      res,
      500,
      `Internal server error ${error.message}`
    );
  }
};

async function handleEventsUserSignedFor (req, res) {
  try {
    // const { perPage } = req.query;
    // const { currentPage } = req.query;
    const { userId } = req.decodedToken;
    const registeredEvents = await db.getByUserId( userId);
    return requestHandler.success(
      res,
      200,
      'Retrieved events registered by user successfully',
      registeredEvents
    );
  } catch (error) {
    return requestHandler.error(
      res,
      500,
      `Internal server error ${error.message}`
    );
  }
};


module.exports = {
  handleEventsGetById,
  handleSpecificEventsUserSignedFor,
  handleEventRegistration,
  handleEventDelete,
  handleEventsUserSignedFor
};
