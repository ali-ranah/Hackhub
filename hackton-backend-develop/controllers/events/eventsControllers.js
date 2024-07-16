/* eslint-disable no-use-before-define */
const moment = require('moment');
const db = require('../../models/eventsModel');
const requestHandler = require('../../utils/requestHandler');
const jwt=require('jsonwebtoken');
const Notification = require('../../models/notificationModel')

function handleEventsGetByUSerId(req, res) {
  const { userId } = req.decodedToken;
  const { perPage } = req.query;
  const { currentPage } = req.query;
db.getByUserId(perPage, currentPage, userId)
  .then(data => {
    const { totalEvents, ...responseData } = data; // Destructure totalEvents from data
    return requestHandler.success(
      res,
      200,
      'Successfully retrieved all your events',
      { ...responseData, totalEvents } // Add totalEvents to the response data
    );
  })
  .catch(error => {
    return requestHandler.error(res, 500, `server error ${error.message}`);
  });
}


function handleEventGetById(req, res) {
  const { id } = req.params;
  db.findById(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Events retrieved Successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, `server error ${error.message}`);
    });
}

function handleEventsDelete(req, res) {
  const { id } = req.params;
  const { userId } = req.decodedToken;
  const newNotification = {
    user_id: userId,
    message: `Event Deleted Successfully`,
  };

   Notification.add(newNotification)
    .then((createdNotification) => {
      console.log('Notification created:', createdNotification);
    })
    .catch((error) => {
      console.error('Error creating notification:', error);
    });
  db.remove(id)
    .then(() => {
      return requestHandler.success(
        res,
        200,
        'your event was deleted successfully!'
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, `server error ${error.message}`);
    });
}

function handleEventsEdit(req, res) {
  const { id } = req.params;
  const { userId } = req.decodedToken;
  const editedStartDate = moment(req.body.start_date).format('YYYY-MM-DD');
  const editedEndDate = moment(req.body.end_date).format('YYYY-MM-DD');
  const editedEvent = {
    event_title: req.body.event_title,
    numberOfParticipants: req.body.numberOfParticipants,
    creator_id: userId,
    start_date: editedStartDate,
    end_date: editedEndDate,
    location: req.body.location,
    preferedLanguage: req.body.preferedLanguage,
    prizeAmount: req.body.prizeAmount,
    levelOfParticipant:req.body.levelOfParticipant

  };

  db.update(id, editedEvent)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'your event was edited successfully!',
        { event: data }
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, `server error ${error.message}`);
    });
}

function handleEventsPost (req, res, next) {

  const startDate = moment(req.body.start_date).format('YYYY-MM-DD HH:mm');
  const endDate = moment(req.body.end_date).format('YYYY-MM-DD HH:mm');

  const token = req.headers.authorization;
    
    // Verify and decode the JWT token to extract the user ID
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const {userId} = decodedToken;
    console.log(userId)

  const event = {
    event_title: req.body.event_title,
    numberOfParticipants: req.body.numberOfParticipants,
    creator_id: userId,
    start_date: startDate,
    allowed_time : req.body.allowed_time,
    end_date: endDate,
    preferedLanguage: req.body.preferedLanguage,
    question: req.body.question,
    guidelines: req.body.guidelines,
    description: req.body.description,
    prizeAmount: req.body.prizeAmount,
    levelOfParticipant:req.body.levelOfParticipant
  };

  const newNotification = {
    user_id: userId,
    message: `New event created: ${event.event_title}`,
  };

   Notification.add(newNotification)
    .then((createdNotification) => {
      console.log('Notification created:', createdNotification);
    })
    .catch((error) => {
      console.error('Error creating notification:', error);
    });

  db.add(event)
    .then(data => {
      return requestHandler.success(
        res,
        201,
        'Your event was added successfully!',
        { event_id: Number(data.toString()) }
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, `Server error: ${error.message}`);
    });
 
}



function handleEventsGet(req, res) {
  db.find()
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'All Events retrieved Successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, `server error ${error.message}`);
    });
}

module.exports = {
  handleEventsGetByUSerId,
  handleEventGetById,
  handleEventsDelete,
  handleEventsEdit,
  handleEventsPost,
  handleEventsGet
};
